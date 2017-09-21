import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {AppState} from '../store/reducers/index';
import {
  ADD_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_TEAM_RANKINGS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION,
  LOAD_TOURNAMENT_TEAM_RANKINGS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION,
} from 'app/tournament/store/tournament-actions';


@Injectable()
export class ActualTournamentTeamRankingService {

  tournamentTeamRankingsRef: firebase.database.Reference;

  constructor(protected store: Store<AppState>) {}

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION});
    if (this.tournamentTeamRankingsRef) {
      this.tournamentTeamRankingsRef.off();
    }
  }

  public subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allTeamRankings: TournamentRanking[] = [];
    let newItems = false;

    this.tournamentTeamRankingsRef = firebase.database().ref('tournament-team-rankings/' + tournamentId);
    this.tournamentTeamRankingsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION, payload: ranking});
    });

    this.tournamentTeamRankingsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION, payload: ranking});
    });

    this.tournamentTeamRankingsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION, payload: snapshot.key});
    });

    this.tournamentTeamRankingsRef.once('value', function (snapshot) {

      snapshot.forEach(function (rankingSnapshot) {

        const ranking: TournamentRanking = TournamentRanking.fromJson(rankingSnapshot.val());
        ranking.id = rankingSnapshot.key;
        allTeamRankings.push(ranking);
        return false;
      });

    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENT_TEAM_RANKINGS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_TEAM_RANKINGS_ACTION, payload: allTeamRankings});
      newItems = true;
    });
  }


}

