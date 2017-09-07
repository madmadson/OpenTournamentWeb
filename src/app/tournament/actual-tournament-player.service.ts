import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';
import {
  ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION,
  LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION
} from './store/tournament-actions';


import * as firebase from 'firebase';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class ActualTournamentPlayerService {

  private tournamentPlayersRef: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private snackBar: MdSnackBar) {

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
    let newItems = false;

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

  killPlayer(player: TournamentPlayer) {
    const playerRef = this.afoDatabase.list('tournament-players/' + player.tournamentId + '/' + player.id);
    playerRef.remove();

    if (player.registrationId) {
      const registrationRef = this.afoDatabase
        .object('tournament-registrations/' + player.tournamentId + '/' + player.registrationId);
      registrationRef.update({isTournamentPlayer: false});
    }
    this.snackBar.open('Player deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  pushTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    const tournamentPlayers = this.afoDatabase.list('tournament-players/' + tournamentPlayer.tournamentId);
    tournamentPlayers.push(tournamentPlayer);

    this.snackBar.open('Player saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}
