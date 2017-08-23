import { Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';

import {
  PlayerAddedAction,
  PlayerChangedAction,
  PlayerDeletedAction,
  PlayersClearAction
} from '../store/actions/players-actions';
import {Player} from '../../../shared/model/player';
import {MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import * as firebase from 'firebase';
import {AppState} from '../store/reducers/index';

@Injectable()
export class PlayersService  implements OnDestroy {

  private playersRef: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private  router: Router,
              private snackBar: MdSnackBar) {
  }

  ngOnDestroy(): void {

    if (this.playersRef) {
      this.playersRef.off();
    }
  }



  subscribeOnPlayers() {

    this.store.dispatch(new PlayersClearAction());
    const that = this;

    if (this.playersRef) {
      this.playersRef.off();
    }

    this.playersRef = firebase.database().ref('players');

    this.playersRef.on('child_added', function (snapshot) {

      const tournament: Player = Player.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch(new PlayerAddedAction(tournament));

    });

    this.playersRef.on('child_changed', function (snapshot) {

      const tournament: Player = Player.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch(new PlayerChangedAction(tournament));
    });

    this.playersRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new PlayerDeletedAction(snapshot.key));
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
