import {Inject, Injectable, OnDestroy} from '@angular/core';
import {AngularFire, FirebaseRef} from 'angularfire2';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {
  PlayerAddedAction,
  PlayerChangedAction,
  PlayerDeletedAction,
  PlayersClearAction
} from '../store/actions/players-actions';
import {Player} from '../../../shared/model/player';
import {PlayerVM} from '../player/player.vm';
import {MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';


@Injectable()
export class PlayersService implements OnDestroy {

  private query: any;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb,
              private  router: Router,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {
    this.query.off();
  }

  subscribeOnPlayers() {

    if (!this.query) {
      console.log('subscribe on tournaments');
      this.store.dispatch(new PlayersClearAction());

      const that = this;

      this.query = this.fb.database().ref('players').orderByChild('firstname');

      this.query.on('child_added', function (snapshot) {

        const tournament: Player = Player.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch(new PlayerAddedAction(tournament));

      });

      this.query.on('child_changed', function (snapshot) {

        const tournament: Player = Player.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch(new PlayerChangedAction(tournament));
      });

      this.query.on('child_removed', function (snapshot) {

        that.store.dispatch(new PlayerDeletedAction(snapshot.key));
      });
    }

  }

  unsubscribeOnPlayers() {

    this.query.off();
  }

  pushPlayer(playerVM: PlayerVM) {

    const that = this;

    const player = Player.fromPlayerVM(playerVM);

    if (playerVM.id) {
      this.afService.database.object('players/' + playerVM.id).$ref.set(player);
    } else {
      const players = this.afService.database.list('players');

      this.fb.database().ref('players').orderByChild('nickName')
        .equalTo(player.nickName).once('value', function (snapshot) {
        const userData = snapshot.val();
        if (!userData) {
          players.push(player);
          that.snackBar.open('Player Profile successfully created. You can register to tournaments', '', {
            duration: 5000
          });
          that.router.navigate(['/home']);
        } else {

          that.snackBar.open('NickName already in use. Please try another one.', '', {
            duration: 5000
          });
        }
      });

    }
  }


}

// this.pushPlayer({
//   name: 'Player1',
//   location: 'Karlsruhe',
//   beginDate: moment('2017-03-12').format(),
//   endDate: moment('2017-03-12').format(),
//   actualRound: 0,
//   maxParticipants: 16,
//   teamSize: 1
// });
// this.pushPlayer({
//   name: 'Player2',
//   location: 'Oberhausen',
//   beginDate: moment('2017-03-17').format(),
//   endDate: moment('2017-03-18').format(),
//   actualRound: 1,
//   maxParticipants: 64,
//   teamSize: 3
// });
// this.pushPlayer({
//   name: 'Player3',
//   location: 'Erfurt',
//   beginDate: moment('2017-04-01').format(),
//   endDate: moment('2017-04-01').format(),
//   actualRound: 0,
//   maxParticipants: 32,
//   teamSize: 1
// });
