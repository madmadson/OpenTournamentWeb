import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {AppState} from '../../store/reducers/index';
import {Tournament} from '../../../../shared/model/tournament';
import {
  ADD_ALL_MY_TOURNAMENTS_ACTION,
  ADD_MY_TOURNAMENT_ACTION, CHANGE_MY_TOURNAMENT_ACTION,
  CLEAR_ALL_MY_TOURNAMENTS_ACTION, LOAD_MY_TOURNAMENTS_FINISHED_ACTION, REMOVE_MY_TOURNAMENT_ACTION
} from './my-tournaments-actions';


@Injectable()
export class MyTournamentsService  {

  private tournamentsRef: firebase.database.Reference;
  private userUid: string;


  constructor(protected store: Store<AppState>) {}

  unsubscribeOnFirebaseMyTournaments(): void {
    if (this.tournamentsRef) {
      this.tournamentsRef.off();
    }
    this.store.dispatch({type: CLEAR_ALL_MY_TOURNAMENTS_ACTION});
  }


  subscribeOnFirebaseMyTournaments(userUid: string) {

    this.userUid = userUid;

    const that = this;
    const allTournaments: Tournament[] = [];
    let newItems = false;

    this.tournamentsRef = firebase.database().ref('tournaments');

    this.tournamentsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }
      if (that.userUid === snapshot.val().creatorUid) {
        const tournament: Tournament = Tournament.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch({type: ADD_MY_TOURNAMENT_ACTION, payload: tournament});
      }
    });

    this.tournamentsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }
      if (that.userUid === snapshot.val().creatorUid) {
        const tournament: Tournament = Tournament.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch({type: CHANGE_MY_TOURNAMENT_ACTION, payload: tournament});
      }
    });

    this.tournamentsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      if (that.userUid === snapshot.val().creatorUid) {
        that.store.dispatch({type: REMOVE_MY_TOURNAMENT_ACTION, payload: snapshot.key});
      }
    });

    this.tournamentsRef.once('value', function (snapshot) {

      snapshot.forEach(function (tournamentSnapshot) {
        if (that.userUid === tournamentSnapshot.val().creatorUid) {
          const tournament: Tournament = Tournament.fromJson(tournamentSnapshot.val());
          tournament.id = tournamentSnapshot.key;
          allTournaments.push(tournament);
        }

        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_MY_TOURNAMENTS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_MY_TOURNAMENTS_ACTION, payload: allTournaments});
      newItems = true;
    });
  }


}

