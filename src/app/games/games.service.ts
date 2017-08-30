import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as firebase from 'firebase';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {
  ADD_ALL_GAMES_ACTION, ADD_GAME_ACTION, CLEAR_GAMES_ACTION,
  LOAD_GAMES_FINISHED_ACTION
} from './games-actions';
import {AppState} from '../store/reducers/index';
import * as _ from 'lodash';

@Injectable()
export class GamesService  {


  private gamesRef: firebase.database.Reference;

  constructor(protected store: Store<AppState>) {

  }

  unsubscribeOnFirebaseGames(): void {
    if (this.gamesRef) {
      this.gamesRef.off();
    }
    this.store.dispatch({type: CLEAR_GAMES_ACTION});
  }

  subscribeOnFirebaseGames() {

    const that = this;
    const allGames: TournamentGame[] = [];
    let newItems = false;

    this.gamesRef = firebase.database().ref('players-games');

    // totaly new player
     this.gamesRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      snapshot.forEach(function (child) {

        const game: TournamentGame = TournamentGame.fromJson(child.val());
        game.id = child.key;

        if (!findGame(allGames, game)) {
          that.store.dispatch({type: ADD_GAME_ACTION, payload: game});
        }
        return false;
      });
    });

    // new game for existing player
    this.gamesRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      snapshot.forEach(function (child) {

        const game: TournamentGame = TournamentGame.fromJson(child.val());
        game.id = child.key;
        if (!findGame(allGames, game)) {
          that.store.dispatch({type: ADD_GAME_ACTION, payload: game});
        }
        return false;
      });
    });

    this.gamesRef.once('value', function (snapshot) {

      snapshot.forEach(function (gamesForPlayerSnapshot) {

        gamesForPlayerSnapshot.forEach(function (gameSnapshot) {

          const game: TournamentGame = TournamentGame.fromJson(gameSnapshot.val());
          game.id = gameSnapshot.key;
          allGames.push(game);
          return false;
        });
        return false;
      });
    }).then(function () {
      that.store.dispatch({type: LOAD_GAMES_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_GAMES_ACTION, payload: allGames});
      newItems = true;
    });
  }
}

function findGame(givenAllGames, givenGame) {
  return _.find(givenAllGames, function (game: TournamentGame) {
    return game.id === givenGame.id;

  });
}
