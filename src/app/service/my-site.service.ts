import {Inject, Injectable, OnDestroy} from '@angular/core';
import {FirebaseRef} from 'angularfire2';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';

import {Player} from '../../../shared/model/player';

import {
  MyRegistrationAddedAction, MyRegistrationChangedAction, MyRegistrationDeletedAction,
  MyRegistrationsClearAction
} from 'app/store/actions/my-site-actions';
import {Registration} from '../../../shared/model/registration';


@Injectable()
export class MySiteService implements OnDestroy {

  private myRegistrationsRef: firebase.database.Reference;


  constructor(protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

  }

  ngOnDestroy(): void {

    if (this.myRegistrationsRef) {
      this.myRegistrationsRef.off();
    }

  }

  subscribeOnMySite(playerId: string) {

    console.log('subscribe on mySite');

    this.subscribeOnMyRegistrations(playerId);

  }

  private subscribeOnMyRegistrations(playerId: string) {

    const that = this;

    this.store.dispatch(new MyRegistrationsClearAction());
    if (this.myRegistrationsRef) {
      this.myRegistrationsRef.off();
    }

    this.myRegistrationsRef = this.fb.database().ref('players-registrations/' + playerId);

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

}
