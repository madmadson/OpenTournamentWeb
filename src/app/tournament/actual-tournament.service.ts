import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {SET_ACTUAL_TOURNAMENT_ACTION, UNSET_ACTUAL_TOURNAMENT_ACTION} from './store/tournament-actions';
import {MdSnackBar} from '@angular/material';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';

import {ScenarioSelectedModel} from '../../../shared/dto/scenario-selected-model';

import * as _ from 'lodash';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Tournament} from '../../../shared/model/tournament';
import {AppState} from '../store/reducers/index';
import {CoOrganizatorPush} from '../../../shared/dto/co-organizator-push';
import {Subscription} from 'rxjs/Subscription';


@Injectable()
export class TournamentService {

  private actualTournamentRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(protected afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private snackBar: MdSnackBar) {
  }


  unsubscribeOnFirebase() {

    this.store.dispatch({type: UNSET_ACTUAL_TOURNAMENT_ACTION});

    if (this.actualTournamentRef) {
      this.actualTournamentRef.off();
    }
    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  subscribeOnOfflineFirebase(tournamentId: string) {

    this.offlineSub = this.afoDatabase.object('tournaments/' + tournamentId)
      .subscribe((tour) => {
        const tournament: Tournament = Tournament.fromJson(tour);
        tournament.id = tour.$key;

        console.log('tournmanet: ' + JSON.stringify(tournament));

        this.store.dispatch({type: SET_ACTUAL_TOURNAMENT_ACTION, payload: tournament});
      });
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    this.actualTournamentRef = firebase.database().ref('tournaments/' + tournamentId);

    this.actualTournamentRef.on('value', function (snapshot) {

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch({type: SET_ACTUAL_TOURNAMENT_ACTION, payload: tournament});
    });
  }


  endTournament(tournament: Tournament) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + tournament.id);
    tournament.finished = true;
    tournament.visibleRound = tournament.actualRound;

    tournamentRef.set(tournament);
  }

  undoTournamentEnd(tournament: Tournament) {
    const tournamentRef = this.afoDatabase.object('tournaments/' + tournament.id);
    tournament.finished = false;

    tournamentRef.set(tournament);

  }

  uploadTournament(tournament: Tournament) {
    const tournamentRef = this.afoDatabase.object('tournaments/' +  tournament.id);

    tournament.uploaded = true;

    tournamentRef.set(tournament);
  }


  updateTournament(tournament: Tournament) {
    const tournamentRef = this.afoDatabase.object('tournaments/' + tournament.id);
    tournamentRef.set(tournament);

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

  startTournament(config: TournamentManagementConfiguration) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + config.tournament.id);

    const tournament = config.tournament;
    tournament.actualRound = config.round;
    tournament.visibleRound = (config.round - 1);

    tournamentRef.set(tournament);
  }

  newRound(config: TournamentManagementConfiguration) {
    const tournamentRef = this.afoDatabase.object('tournaments/' +  config.tournament.id);

    console.log('update tournament: ' + JSON.stringify(config));

    const tournament = config.tournament;
    tournament.actualRound = config.round;
    tournament.visibleRound = (config.round - 1);

    tournamentRef.set(tournament);
  }

  wholeRoundScenarioSelected(scenarioSelected: ScenarioSelectedModel) {
    const query = this.afoDatabase.list('tournament-games/' + scenarioSelected.tournamentId).take(1);

    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-games/' + scenarioSelected.tournamentId + '/' + game.$key).update({'scenario': scenarioSelected.scenario});
        }
      });
    });
  }
}
