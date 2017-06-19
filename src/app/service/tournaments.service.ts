import { Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import * as firebase from 'firebase';

import {
  TournamentAddedAction,
  TournamentChangedAction,
  TournamentDeletedAction,
  TournamentsClearAction
} from '../store/actions/tournaments-actions';
import {Tournament} from '../../../shared/model/tournament';
import {MdSnackBar} from '@angular/material';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';

@Injectable()
export class TournamentsService  {

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<ApplicationState>,
              private snackBar: MdSnackBar) {
  }


  subscribeOnTournaments() {

    console.log('subscribe on tournaments');
    this.store.dispatch(new TournamentsClearAction());

    const that = this;

    const tournamentsReference = firebase.database().ref('tournaments').orderByChild('beginDate');

    tournamentsReference.on('child_added', function (snapshot) {

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch(new TournamentAddedAction(tournament));

    });

    tournamentsReference.on('child_changed', function (snapshot) {

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch(new TournamentChangedAction(tournament));
    });

    tournamentsReference.on('child_removed', function (snapshot) {

      that.store.dispatch(new TournamentDeletedAction(snapshot.key));
    });

  }

  pushTournament(newTournament: Tournament) {

    const tournaments = this.afoDatabase.list('tournaments');
    tournaments.push(newTournament);

    this.snackBar.open('Tournament saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  setTournament(tournament: Tournament) {
    const tournamentRef = this.afoDatabase.object('tournaments/' + tournament.id);
    tournamentRef.set(tournament);

    this.snackBar.open('Tournament edited successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}

