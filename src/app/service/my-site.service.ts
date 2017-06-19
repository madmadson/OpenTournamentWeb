import { Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';

import {
  MyGameAddedAction, MyGameChangedAction, MyGameDeletedAction,

  MyGamesClearAction,
  MyRegistrationAddedAction, MyRegistrationChangedAction, MyRegistrationDeletedAction,
  MyRegistrationsClearAction
} from 'app/store/actions/my-site-actions';
import {Registration} from '../../../shared/model/registration';
import {TournamentGame} from '../../../shared/model/tournament-game';
import * as firebase from 'firebase';

@Injectable()
export class MySiteService {

  private myRegistrationsRef: firebase.database.Reference;
  private myGamesRef: firebase.database.Reference;


  constructor(protected store: Store<ApplicationState>) {

  }


  subscribeOnMySite(playerId: string) {

    console.log('subscribe on mySite');

    this.subscribeOnMyRegistrations(playerId);
    this.subscribeOnMyGames(playerId);

  }

  private subscribeOnMyRegistrations(playerId: string) {

    console.log('subscribeOnMyRegistrations');

    const that = this;

    this.store.dispatch(new MyRegistrationsClearAction());

    this.myRegistrationsRef = firebase.database().ref('players-registrations/' + playerId);

    this.myRegistrationsRef.on('child_added', function (snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new MyRegistrationAddedAction(registration));

    });

    this.myRegistrationsRef.on('child_changed', function (snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new MyRegistrationChangedAction(registration));

    });

    this.myRegistrationsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new MyRegistrationDeletedAction(snapshot.key));

    });
  }

  private subscribeOnMyGames(playerId: string) {

    console.log('subscribeOnMyGames');

    const that = this;

    this.store.dispatch(new MyGamesClearAction());

    this.myGamesRef = firebase.database().ref('players-games/' + playerId);

    this.myGamesRef.on('child_added', function (snapshot) {

      const game: TournamentGame = TournamentGame.fromJson(snapshot.val());
      game.id = snapshot.key;

      that.store.dispatch(new MyGameAddedAction(game));

    });

    this.myGamesRef.on('child_changed', function (snapshot) {

      const game: TournamentGame = TournamentGame.fromJson(snapshot.val());
      game.id = snapshot.key;

      that.store.dispatch(new MyGameChangedAction(game));

    });

    this.myGamesRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new MyGameDeletedAction(snapshot.key));

    });
  }

}
