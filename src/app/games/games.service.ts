import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';

import * as firebase from 'firebase';


import {TournamentGame} from '../../../shared/model/tournament-game';
import {ADD_GAME_ACTION, CLEAR_GAMES_ACTION} from './games-actions';


@Injectable()
export class GamesService  {


  private gamesRef: firebase.database.Reference;

  constructor(protected store: Store<ApplicationState>) {
  }

  unsubscribeOnFirebaseGames(): void {
    if (this.gamesRef) {
      this.gamesRef.off();
    }
    this.store.dispatch({type: CLEAR_GAMES_ACTION});
  }

  subscribeOnFirebaseGames() {

    const that = this;

    this.gamesRef = firebase.database().ref('players-games');

    this.gamesRef.on('child_added', function (snapshot) {

      snapshot.forEach(function (child) {
        const game: TournamentGame = TournamentGame.fromJson(child.val());
        game.id = child.key;
        that.store.dispatch({type: ADD_GAME_ACTION, payload: game});
        return false;
      });

    });

  }
}
