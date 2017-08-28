


import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';
import {
  ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION, REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION
} from './tournament-actions';
import {Registration} from '../../../shared/model/registration';

@Injectable()
export class ActualTournamentRegistrationService  {

  private tournamentRegistrationsRef: firebase.database.Reference;

  constructor(protected store: Store<AppState>) {

  }


  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION});
    if (this.tournamentRegistrationsRef) {
      this.tournamentRegistrationsRef.off();
    }
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allRegistrations: Registration[] = [];
    let newItems = false;

    this.tournamentRegistrationsRef = firebase.database().ref('tournament-registrations/' + tournamentId);

    this.tournamentRegistrationsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION, payload: registration});

    });

    this.tournamentRegistrationsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION, payload: registration});
    });

    this.tournamentRegistrationsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION, payload: snapshot.key});
    });

    this.tournamentRegistrationsRef.once('value', function (snapshot) {

      snapshot.forEach(function (regSnapshot) {

        const reg: Registration = Registration.fromJson(regSnapshot.val());
        reg.id = regSnapshot.key;
        allRegistrations.push(reg);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION, payload: allRegistrations});
      newItems = true;
    });
  }


}
