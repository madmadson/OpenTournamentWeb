import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {AppState} from '../../store/reducers/index';

import {Registration} from '../../../../shared/model/registration';
import {
  ADD_ALL_MY_REGISTRATIONS_ACTION,
  ADD_MY_REGISTRATION_ACTION,
  CHANGE_MY_REGISTRATION_ACTION,
  CLEAR_ALL_MY_REGISTRATIONS_ACTION,
  LOAD_MY_REGISTRATIONS_FINISHED_ACTION,
  REMOVE_MY_REGISTRATION_ACTION
} from './my-registrations-actions';


@Injectable()
export class MyRegistrationsService {

  private playerRegistrationsRef: firebase.database.Reference;
  private playerId: string;


  constructor(protected store: Store<AppState>) {
  }

  unsubscribeOnFirebaseMyRegistrations(): void {
    if (this.playerRegistrationsRef) {
      this.playerRegistrationsRef.off();
    }
    this.store.dispatch({type: CLEAR_ALL_MY_REGISTRATIONS_ACTION});
  }


  subscribeOnFirebaseMyRegistrations(playerId: string) {

    this.playerId = playerId;

    const that = this;
    const allRegistrations: Registration[] = [];
    let newItems = false;

    this.playerRegistrationsRef = firebase.database().ref('players-registrations/' + this.playerId);

    this.playerRegistrationsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const reg: Registration = Registration.fromJson(snapshot.val());
      reg.id = snapshot.key;

      that.store.dispatch({type: ADD_MY_REGISTRATION_ACTION, payload: reg});

    });

    this.playerRegistrationsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch({type: CHANGE_MY_REGISTRATION_ACTION, payload: registration});

    });

    this.playerRegistrationsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_MY_REGISTRATION_ACTION, payload: snapshot.key});

    });

    this.playerRegistrationsRef.once('value', function (snapshot) {

      snapshot.forEach(function (registrationSnapshot) {

        const registration: Registration = Registration.fromJson(registrationSnapshot.val());
        registration.id = registrationSnapshot.key;
        allRegistrations.push(registration);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_MY_REGISTRATIONS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_MY_REGISTRATIONS_ACTION, payload: allRegistrations});
      newItems = true;
    });
  }


}

