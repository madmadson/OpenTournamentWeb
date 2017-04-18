import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFireDatabase, FirebaseRef} from 'angularfire2';


import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Tournament} from '../../../shared/model/tournament';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {
  AddTournamentRankingAction, ChangeTournamentRankingAction, ClearRankingAction,
  DeleteTournamentRankingAction
} from '../store/actions/tournament-rankings-actions';

import * as _ from 'lodash';
import {PairingConfiguration} from '../../../shared/model/pairing-configuration';


@Injectable()
export class TournamentRankingService implements OnDestroy {

  tournamentRankingsRef: firebase.database.Reference;

  allPlayers: TournamentPlayer[];
  allRankings: TournamentRanking[];
  actualTournament: Tournament;

  constructor(protected fireDB: AngularFireDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;
      this.allRankings = state.actualTournamentRankings.actualTournamentRankings;
      this.actualTournament = state.actualTournament.actualTournament;
    });

  }

  ngOnDestroy(): void {

  }

  public subscribeOnTournamentRankings(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearRankingAction());

    console.log('subscribeOnTournamentRankings');

    this.tournamentRankingsRef = this.fb.database().ref('tournament-rankings/' + tournamentId);

    this.tournamentRankingsRef.on('child_added', function (snapshot) {

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch(new AddTournamentRankingAction(ranking));

    });

    this.tournamentRankingsRef.on('child_changed', function (snapshot) {

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentRankingAction(ranking));

    });

    this.tournamentRankingsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentRankingAction(snapshot.key));

    });
  }


  pushRankingForRound(config: PairingConfiguration): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    this.eraseRankingsForRound(config);

    console.log('push ranking for round: '  + config.round);

    const lastRoundRankings: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {

      const newTournamentRanking = new TournamentRanking(
        tournamentPlayer.tournamentId,
        tournamentPlayer.playerId ?  tournamentPlayer.playerId : tournamentPlayer.id,
        tournamentPlayer.playerName,
        tournamentPlayer.faction ?  tournamentPlayer.faction : '',
        tournamentPlayer.teamName ?  tournamentPlayer.teamName : '',
        tournamentPlayer.origin ?  tournamentPlayer.origin : '',
        tournamentPlayer.meta ?  tournamentPlayer.meta : '',
        tournamentPlayer.elo ? tournamentPlayer.elo : 0,
        0,
        0,
        0,
        0,
        1,
        []);

      _.find(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {
        if (lastRoundRanking.playerId === tournamentPlayer.playerId) {

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = (lastRoundRanking.tournamentRound + 1);
          newTournamentRanking.opponentPlayerIds = lastRoundRanking.opponentPlayerIds;
        }
      });

      const tournamentRankingsRef = that.fireDB
        .list('tournament-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }

  eraseRankingsForRound(config: PairingConfiguration) {

    console.log('erase ranking for round: '  + config.round);

    const query = this.fb.database().ref('tournament-rankings/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }

}
