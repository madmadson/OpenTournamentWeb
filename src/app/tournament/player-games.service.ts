import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {AppState} from '../store/reducers/index';

import {
  ADD_ACTUAL_TOURNAMENT_GAME_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION,
} from 'app/tournament/store/tournament-actions';
import {
  ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION,
  LOAD_TOURNAMENT_GAMES_FINISHED_ACTION
} from './store/tournament-actions';
import {Subscription} from 'rxjs/Subscription';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import * as _ from 'lodash';


@Injectable()
export class PlayerGamesService {

  tournamentGamesRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(protected store: Store<AppState>,
              private afoDatabase: AngularFireOfflineDatabase) {
  }

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION});
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }

    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  public subscribeOnOfflineFirebase(tournamentId: string) {


    this.offlineSub = this.afoDatabase.list('tournament-games/' + tournamentId)
      .subscribe((tournamentGames) => {

      console.log('update games');

        const allPlayerGames: TournamentGame[] = [];

        _.forEach(tournamentGames, function (gameSnapshot) {
          const tournamentGame: TournamentGame = TournamentGame.fromJson(gameSnapshot);
          tournamentGame.id = gameSnapshot.$key;
          allPlayerGames.push(tournamentGame);
        });

        this.store.dispatch({type: LOAD_TOURNAMENT_GAMES_FINISHED_ACTION});
        this.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION, payload: allPlayerGames});

        // console.log('ALL LOADED!');
        // } else {
        //
        //   const newPlayerGames: TournamentGame[] = [];
        //   const newPlayerGamesIds: string[] = [];
        //
        //   _.forEach(tournamentGames, function (gameSnapshot) {
        //     const newTournamentGame: TournamentGame = TournamentGame.fromJson(gameSnapshot);
        //     newTournamentGame.id = gameSnapshot.$key;
        //
        //     newPlayerGamesIds.push(newTournamentGame.id);
        //     newPlayerGames.push(newTournamentGame);
        //
        //     if (_.includes(playerGamesIds, newTournamentGame.id)) {
        //       that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION, payload: newTournamentGame});
        //     } else {
        //       that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_GAME_ACTION, payload: newTournamentGame});
        //     }
        //   });
        //
        //   _.forEach(allPlayerGames, function (game: TournamentGame) {
        //
        //     if (!_.includes(newPlayerGamesIds, game.id)) {
        //       that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION, payload: game.id});
        //     }
        //   });
        //
        //
        //   allPlayerGames = newPlayerGames;
        // }
      });
  }


  public subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allGames: TournamentGame[] = [];
    let newItems = false;

    this.tournamentGamesRef = firebase.database().ref('tournament-games/' + tournamentId);

    this.tournamentGamesRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_GAME_ACTION, payload: tournamentGame});

    });

    this.tournamentGamesRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION, payload: tournamentGame});

    });

    this.tournamentGamesRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION, payload: snapshot.key});
    });

    this.tournamentGamesRef.once('value', function (snapshot) {


      snapshot.forEach(function (gameSnapshot) {

        const tournamentGame: TournamentGame = TournamentGame.fromJson(gameSnapshot.val());
        tournamentGame.id = gameSnapshot.key;
        allGames.push(tournamentGame);
        return false;
      });

    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENT_GAMES_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION, payload: allGames});
      newItems = true;
    });
  }

}


