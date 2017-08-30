import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';
import {
  ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION, LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION
} from './tournament-actions';


import * as firebase from 'firebase';
import {TournamentPlayer} from '../../../shared/model/tournament-player';

@Injectable()
export class ActualTournamentPlayerService {

  private tournamentPlayersRef: firebase.database.Reference;

  constructor(protected store: Store<AppState>) {

  }

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION});
    if (this.tournamentPlayersRef) {
      this.tournamentPlayersRef.off();
    }
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allTournamentPlayers: TournamentPlayer[] = [];
    let newItems = true;

    this.tournamentPlayersRef = firebase.database().ref('tournament-players/' + tournamentId);

    this.tournamentPlayersRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const registration: TournamentPlayer = TournamentPlayer.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION, payload: registration});

    });

    this.tournamentPlayersRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const registration: TournamentPlayer = TournamentPlayer.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION, payload: registration});
    });

    this.tournamentPlayersRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION, payload: snapshot.key});
    });

    this.tournamentPlayersRef.once('value', function (snapshot) {

      snapshot.forEach(function (playerSnapshot) {

        const player: TournamentPlayer = TournamentPlayer.fromJson(playerSnapshot.val());
        player.id = playerSnapshot.key;
        allTournamentPlayers.push(player);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION, payload: allTournamentPlayers});
      newItems = true;
    });
  }


}
