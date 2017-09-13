import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {Player} from '../../../shared/model/player';
import {MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import * as firebase from 'firebase';
import {AppState} from '../store/reducers/index';
import {
  ADD_ALL_PLAYERS_ACTION,
  ADD_PLAYER_ACTION,
  CHANGE_PLAYER_ACTION,
  CLEAR_ALL_PLAYERS_ACTION,
  LOAD_PLAYERS_FINISHED_ACTION,
  REMOVE_PLAYER_ACTION
} from './players-actions';

@Injectable()
export class PlayersService {

  private playersRef: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private  router: Router,
              private snackBar: MdSnackBar) {
  }

  unsubscribeOnFirebase(): void {
    if (this.playersRef) {
      this.playersRef.off();
    }
    this.store.dispatch({type: CLEAR_ALL_PLAYERS_ACTION});
  }


  subscribeOnFirebase() {

    const that = this;
    const allPlayers: Player[] = [];
    let newItems = false;


    this.playersRef = firebase.database().ref('players');

    this.playersRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const player: Player = Player.fromJson(snapshot.val());
      player.id = snapshot.key;

      that.store.dispatch({type: ADD_PLAYER_ACTION, payload: player});

    });

    this.playersRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const player: Player = Player.fromJson(snapshot.val());
      player.id = snapshot.key;

      that.store.dispatch({type: CHANGE_PLAYER_ACTION, payload: player});
    });

    this.playersRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_PLAYER_ACTION, payload: snapshot});
    });


    this.playersRef.once('value', function (snapshot) {

      snapshot.forEach(function (playersSnapshot) {
        const player: Player = Player.fromJson(playersSnapshot.val());
        player.id = playersSnapshot.key;
        allPlayers.push(player);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_PLAYERS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_PLAYERS_ACTION, payload: allPlayers});
      newItems = true;
    });
  }


  pushPlayer(player: Player) {

    const that = this;

    if (player.id) {
      this.afoDatabase.object('players/' + player.id).set(player);
      that.snackBar.open('Player Profile successfully updated.', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });
    } else {
      const players = this.afoDatabase.list('players');

      firebase.database().ref('players').orderByChild('nickName')
        .equalTo(player.nickName).once('value', function (snapshot) {
        const userData = snapshot.val();
        if (!userData) {
          players.push(player);
          that.snackBar.open('Player Profile successfully created. You can register to tournaments', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });
          that.router.navigate(['/home']);
        } else {

          that.snackBar.open('NickName already in use. Please try another one.', '', {
            extraClasses: ['snackBar-fail'],
            duration: 5000
          });
        }
      });

    }
  }
}
