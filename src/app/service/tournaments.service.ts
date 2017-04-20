import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';
import {
  TournamentAddedAction,
  TournamentChangedAction,
  TournamentDeletedAction,
  TournamentsClearAction
} from '../store/actions/tournaments-actions';
import {Tournament} from '../../../shared/model/tournament';
import {MdSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Injectable()
export class TournamentsService implements OnDestroy {

  private tournamentsReference: firebase.database.Reference;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb,
              private router: Router,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {
    this.tournamentsReference.off();
  }


  subscribeOnTournaments() {

    if (!this.tournamentsReference) {
      console.log('subscribe on tournaments');
      this.store.dispatch(new TournamentsClearAction());

      const that = this;

      this.tournamentsReference = this.fb.database().ref('tournaments').orderByChild('beginDate');

      this.tournamentsReference.on('child_added', function(snapshot) {

        const tournament: Tournament = Tournament.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch(new TournamentAddedAction(tournament));

      });

      this.tournamentsReference.on('child_changed', function(snapshot) {

        const tournament: Tournament = Tournament.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch(new TournamentChangedAction(tournament));
        });

      this.tournamentsReference.on('child_removed', function(snapshot) {

        that.store.dispatch(new TournamentDeletedAction(snapshot.key));
      });
    }

  }

  unsubscribeOnTournaments() {

    this.tournamentsReference.off();
  }


  pushTournaments(newTournament: Tournament) {


    const tournaments = this.afService.database.list('tournaments');
    tournaments.push(newTournament);

    this.snackBar.open('Tournament saved successfuly', '', {
      duration: 5000
    });

    this.router.navigate(['/my-tournaments']);
  }
}

