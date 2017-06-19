import { Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';

import * as firebase from 'firebase';
import {GameAddedAction, GamesClearAction} from '../store/actions/games-actions';

import {TournamentGame} from '../../../shared/model/tournament-game';


@Injectable()
export class GamesService  {

  private gamesRef: firebase.database.Reference;

  constructor(protected store: Store<ApplicationState>) {
  }


  subscribeOnGames() {

    console.log('subscribe on games');
    this.store.dispatch(new GamesClearAction());


    const that = this;

    this.gamesRef = firebase.database().ref('players-games');

    this.gamesRef.on('child_added', function (snapshot) {

      snapshot.forEach(function (child) {
        const game: TournamentGame = TournamentGame.fromJson(child.val());
        game.id = child.key;
        that.store.dispatch(new GameAddedAction(game));
        return false;
      });

    });

  }
}
