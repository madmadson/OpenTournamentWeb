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


@Injectable()
export class ActualTournamentGamesService {

  tournamentGamesRef: firebase.database.Reference;

  constructor(protected store: Store<AppState>) {}

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION});
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }
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


