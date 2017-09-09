import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {AppState} from '../../store/reducers/index';

import {
  ADD_ALL_MY_GAMES_ACTION,
  ADD_MY_GAME_ACTION, CHANGE_MY_GAME_ACTION,
  CLEAR_ALL_MY_GAMES_ACTION, LOAD_MY_GAMES_FINISHED_ACTION, REMOVE_MY_GAME_ACTION
} from './my-games-actions';
import {TournamentGame} from '../../../../shared/model/tournament-game';



@Injectable()
export class MyGamesService  {

  private gamesRef: firebase.database.Reference;
  private playerId: string;


  constructor(protected store: Store<AppState>) {}

  unsubscribeOnFirebaseMyGames(): void {
    if (this.gamesRef) {
      this.gamesRef.off();
    }
    this.store.dispatch({type: CLEAR_ALL_MY_GAMES_ACTION});
  }


  subscribeOnFirebaseMyGames(playerId: string) {

    this.playerId = playerId;

    const that = this;
    const allGames: TournamentGame[] = [];
    let newItems = false;

    this.gamesRef = firebase.database().ref('games');

    this.gamesRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }
      if (that.playerId === snapshot.val().playerOnePlayerId ||
          that.playerId === snapshot.val().playerTwoPlayerId) {
        const game: TournamentGame = TournamentGame.fromJson(snapshot.val());
        game.id = snapshot.key;

        that.store.dispatch({type: ADD_MY_GAME_ACTION, payload: game});
      }
    });

    this.gamesRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }
      if (that.playerId === snapshot.val().playerOnePlayerId ||
        that.playerId === snapshot.val().playerTwoPlayerId) {
        const game: TournamentGame = TournamentGame.fromJson(snapshot.val());
        game.id = snapshot.key;

        that.store.dispatch({type: CHANGE_MY_GAME_ACTION, payload: game});
      }
    });

    this.gamesRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      if (that.playerId === snapshot.val().playerOnePlayerId ||
        that.playerId === snapshot.val().playerTwoPlayerId) {
        that.store.dispatch({type: REMOVE_MY_GAME_ACTION, payload: snapshot.key});
      }
    });

    this.gamesRef.once('value', function (snapshot) {

      snapshot.forEach(function (gameSnapshot) {
        if (that.playerId === gameSnapshot.val().playerOnePlayerId ||
          that.playerId === gameSnapshot.val().playerTwoPlayerId) {
          const game: TournamentGame = TournamentGame.fromJson(gameSnapshot.val());
          game.id = gameSnapshot.key;
          allGames.push(game);
        }

        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_MY_GAMES_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_MY_GAMES_ACTION, payload: allGames});
      newItems = true;
    });
  }


}

