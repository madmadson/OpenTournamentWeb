import { Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {
  TournamentAddedAction,
  TournamentChangedAction,
  TournamentDeletedAction,
  TournamentsClearAction
} from '../store/actions/tournaments-actions';
import {Tournament} from '../../../shared/model/tournament';
import {MdSnackBar} from '@angular/material';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {CoOrganizatorPush} from '../../../shared/dto/co-organizator-push';

import * as _ from 'lodash';
import {AppState} from '../store/reducers/index';

@Injectable()
export class TournamentsService  {

  private tournamentsReference: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private snackBar: MdSnackBar) {
  }


  subscribeOnTournaments() {


    this.store.dispatch(new TournamentsClearAction());

    const that = this;

    if (this.tournamentsReference) {
      this.tournamentsReference.off();
    }

    this.tournamentsReference = firebase.database().ref('tournaments');

    this.tournamentsReference.on('child_added', function (snapshot) {

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch(new TournamentAddedAction(tournament));

    });

    this.tournamentsReference.on('child_changed', function (snapshot) {

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch(new TournamentChangedAction(tournament));
    });

    this.tournamentsReference.on('child_removed', function (snapshot) {

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

  addCoOrganizer(coOrganizer: CoOrganizatorPush) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + coOrganizer.tournament.id);

    if (coOrganizer.tournament.coOrganizators) {
      coOrganizer.tournament.coOrganizators.push(coOrganizer.coOrganizatorEmail);
    } else {
      coOrganizer.tournament.coOrganizators = [coOrganizer.coOrganizatorEmail];
    }

    tournamentRef.set(coOrganizer.tournament);

    this.snackBar.open('Co-Organizer added successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  deleteCoOrganizer(coOrganizer: CoOrganizatorPush) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + coOrganizer.tournament.id);

    if (coOrganizer.tournament.coOrganizators) {
      const indexOfSearchedEmail = _.findIndex(coOrganizer.tournament.coOrganizators, function (email) {
        return email === coOrganizer.coOrganizatorEmail;
      });
      coOrganizer.tournament.coOrganizators.splice(indexOfSearchedEmail, 1);
    }

    tournamentRef.set(coOrganizer.tournament);
    this.snackBar.open('Co-Organizer deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}

