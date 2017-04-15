import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFireDatabase, FirebaseRef} from 'angularfire2';


import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Tournament} from '../../../shared/model/tournament';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {
  AddTournamentRankingAction, ChangeTournamentRankingAction,
  DeleteTournamentRankingAction
} from '../store/actions/tournament-rankings-actions';

import * as _ from 'lodash';


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

    this.tournamentRankingsRef = this.fb.ref('tournament-rankings/' + tournamentId);

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


  createRankingForRound(tournamentRound: number): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    console.log('create ranking for first round');

    const lastRoundRankings: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return ranking.tournamentRound = (tournamentRound - 1);
    });

    _.forEach(this.allPlayers, function (player: TournamentPlayer) {
      const newTournamentRanking = new TournamentRanking(
        player.id,
        player.tournamentId,
        player.playerName,
        0,
        0,
        0,
        0,
        1,
        []);


      _.find(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {
        if (lastRoundRanking.playerId === player.playerId) {

          newTournamentRanking.playerName = lastRoundRanking.playerName;
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

      newRankings.push(newTournamentRanking)
    });

    return newRankings;
  }

}
