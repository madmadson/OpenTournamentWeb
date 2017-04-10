import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';

import {
  ClearRegistrationAction,
  SetActualTournamentAction, TournamentRegistrationAdded, TournamentRegistrationChanged,
  TournamentRegistrationDeleted
} from '../store/actions/tournament-actions';
import {Registration} from '../../../shared/model/registration';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';


@Injectable()
export class TournamentService implements OnDestroy{

  private tournamentRegistrationsRef: firebase.database.Reference;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb,
              private router: Router,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy  TournamentService');
    this.tournamentRegistrationsRef.off();
    this.store.dispatch(new ClearRegistrationAction());
  }


  subscribeOnTournament(tournamentId: string) {

    const that = this;

    console.log('subscribe on tournament with id: ' + tournamentId);

    this.afService.database.object('tournaments/' + tournamentId).subscribe(
      tournament => {
        tournament.id = tournamentId;
        this.store.dispatch(new SetActualTournamentAction(tournament));

      }
    );

    this.tournamentRegistrationsRef = this.fb.database().ref('tournament-registration/' + tournamentId);

    this.tournamentRegistrationsRef.on('child_added', function(snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new TournamentRegistrationAdded(registration));

    });

    this.tournamentRegistrationsRef.on('child_changed', function(snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;
      console.log('new reducer!' + JSON.stringify(registration));

      that.store.dispatch(new TournamentRegistrationChanged(registration));

    });

    this.tournamentRegistrationsRef.on('child_removed', function(snapshot) {

      that.store.dispatch(new TournamentRegistrationDeleted(snapshot.key));

    });
  }

  pushRegistration(payload: Registration) {

    const newRegistration = Registration.fromRegistrationVM(payload);

    const registrations = this.afService.database.list('tournament-registration/' + newRegistration.tournamentId );
    registrations.push(newRegistration);

    this.snackBar.open('Registration saved successfuly', '', {
      duration: 5000
    });
  }

  unsubscribeOnTournament() {
    this.tournamentRegistrationsRef.off();
    this.store.dispatch(new ClearRegistrationAction());
  }
}
