import { Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {Tournament} from '../../../shared/model/tournament';
import {MdSnackBar} from '@angular/material';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {CoOrganizatorPush} from '../../../shared/dto/co-organizator-push';

import * as _ from 'lodash';
import {AppState} from '../store/reducers/index';
import {
  ADD_ALL_TOURNAMENTS_ACTION, ADD_TOURNAMENT_ACTION, CHANGE_TOURNAMENT_ACTION,
  CLEAR_ALL_TOURNAMENTS_ACTION, REMOVE_TOURNAMENT_ACTION, LOAD_TOURNAMENTS_FINISHED_ACTION
} from './tournaments-actions';

@Injectable()
export class TournamentsService  {

  private tournamentsRef: firebase.database.Reference;


  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private snackBar: MdSnackBar) {
  }

  unsubscribeOnFirebaseTournaments(): void {
    if (this.tournamentsRef) {
      this.tournamentsRef.off();
    }
    this.store.dispatch({type: CLEAR_ALL_TOURNAMENTS_ACTION});
  }


  subscribeOnFirebaseTournaments() {

    const that = this;
    const allTournaments: Tournament[] = [];
    let newItems = false;

    this.tournamentsRef = firebase.database().ref('tournaments');

    this.tournamentsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch({type: ADD_TOURNAMENT_ACTION, payload: tournament});

    });

    this.tournamentsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch({type: CHANGE_TOURNAMENT_ACTION, payload: tournament});
    });

    this.tournamentsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_TOURNAMENT_ACTION, payload: snapshot.key});
    });

    this.tournamentsRef.once('value', function (snapshot) {

      snapshot.forEach(function (tournamentSnapshot) {

        const tournament: Tournament = Tournament.fromJson(tournamentSnapshot.val());
        tournament.id = tournamentSnapshot.key;
        allTournaments.push(tournament);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENTS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_TOURNAMENTS_ACTION, payload: allTournaments});
      newItems = true;
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

