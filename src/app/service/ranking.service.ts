import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';

import {MdSnackBar} from '@angular/material';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Tournament} from '../../../shared/model/tournament';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {
  AddTournamentRankingAction, ChangeTournamentRankingAction,
  DeleteTournamentRankingAction
} from '../store/actions/ranking-actions';

import * as _ from 'lodash';

@Injectable()
export class RankingService implements OnDestroy {

  tournamentRankingsRef:  firebase.database.Reference;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {

  }

  public subscribeOnTournamentRankings(tournamentId: string) {

    const that = this;

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


  createRankingForFirstRound() {

    const that = this;

    console.log('create ranking for first round');

    this.store.select(state => state.tournamentData).subscribe(tournamentData => {
      const allPlayers: TournamentPlayer[] = tournamentData.actualTournamentPlayers;
      const allGames: TournamentGame[] = tournamentData.actualTournamentGames;
      const allRankings: TournamentRanking[] = tournamentData.actualTournamentRankings;
      const tournament: Tournament = tournamentData.actualTournament;

      _.forEach(allPlayers, function (player: TournamentPlayer) {
          const tournamentRanking = new TournamentRanking(player.id, player.tournamentId, 0, 0, 0, 0, 1, []);
          const tournamentRankingsRef = that.afService.database
            .list('tournament-rankings/' + tournamentRanking.tournamentId );
          tournamentRankingsRef.push(tournamentRanking);


      });

    });
  }

}
