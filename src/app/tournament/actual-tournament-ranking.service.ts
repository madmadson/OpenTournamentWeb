import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {AppState} from '../store/reducers/index';
import {
  ADD_ACTUAL_TOURNAMENT_RANKING_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION,
  LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION,
} from 'app/tournament/store/tournament-actions';
import {DropPlayerPush} from '../../../shared/dto/drop-player-push';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';


@Injectable()
export class ActualTournamentRankingService {

  tournamentRankingsRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>) {

  }

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION});
    if (this.tournamentRankingsRef) {
      this.tournamentRankingsRef.off();
    }
    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  public subscribeOnOfflineFirebase(tournamentId: string) {

    const that = this;

    this.offlineSub = this.afoDatabase.list('tournament-rankings/' + tournamentId)
      .subscribe((rankings) => {
        const allRankings: TournamentRanking[] = [];

        _.forEach(rankings, function (rank) {
          const ranking: TournamentRanking = TournamentRanking.fromJson(rank);
          ranking.id = rank.$key;
          allRankings.push(ranking);
        });
        that.store.dispatch({type: LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION});
        that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION, payload: allRankings});
      });
  }

  public subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allRankings: TournamentRanking[] = [];
    let newItems = false;

    this.tournamentRankingsRef = firebase.database().ref('tournament-rankings/' + tournamentId);

    this.tournamentRankingsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_RANKING_ACTION, payload: ranking});

    });

    this.tournamentRankingsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION, payload: ranking});

    });

    this.tournamentRankingsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION, payload: snapshot.key});
    });

    this.tournamentRankingsRef.once('value', function (snapshot) {

      snapshot.forEach(function (rankingSnapshot) {

        const ranking: TournamentRanking = TournamentRanking.fromJson(rankingSnapshot.val());
        ranking.id = rankingSnapshot.key;
        allRankings.push(ranking);
        return false;

      });

    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION, payload: allRankings});
      newItems = true;
    });
  }

  dropPlayer(dropAction: DropPlayerPush) {

    const rankingRef = this.afoDatabase.object('tournament-rankings/' +
      dropAction.ranking.tournamentId + '/' + dropAction.ranking.id);

    rankingRef.update({
      droppedInRound: dropAction.round
    });

    const tournamentPlayerRef = this.afoDatabase.object('tournament-players/' +
      dropAction.ranking.tournamentId + '/' + dropAction.ranking.tournamentPlayerId);

    tournamentPlayerRef.update({
      droppedInRound: dropAction.round
    });
  }

  undoDropPlayer(ranking: TournamentRanking) {

    const rankingRef = this.afoDatabase.object('tournament-rankings/' +
      ranking.tournamentId + '/' + ranking.id);

    rankingRef.update({
      droppedInRound: 0
    });

    const tournamentPlayerRef = this.afoDatabase.object('tournament-players/' +
      ranking.tournamentId + '/' + ranking.tournamentPlayerId);

    tournamentPlayerRef.update({
      droppedInRound: 0
    });
  }


}

