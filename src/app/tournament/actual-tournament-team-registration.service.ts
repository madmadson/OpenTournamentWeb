import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';
import {
  ADD_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION,
  LOAD_TEAM_REGISTRATIONS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION
} from './store/tournament-actions';
import {Registration} from '../../../shared/model/registration';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';


import * as _ from 'lodash';
import * as firebase from 'firebase';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {TeamRegistrationPush} from '../../../shared/dto/team-registration-push';
import {TeamRegistrationChange} from '../../../shared/dto/team-registration-change';
import {Subscription} from 'rxjs/Subscription';


@Injectable()
export class ActualTournamentTeamRegistrationService {

  private tournamentTeamRegistrationsRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private store: Store<AppState>) {}

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION});
    if (this.tournamentTeamRegistrationsRef) {
      this.tournamentTeamRegistrationsRef.off();
    }
    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  public subscribeOnOfflineFirebase(tournamentId: string) {

    const that = this;
    const allRegistrations: TournamentTeam[] = [];
    let firstLoad = true;

    this.offlineSub = this.afoDatabase.list('tournament-team-registrations/' + tournamentId)
      .subscribe((registrations) => {

        if (firstLoad) {
          _.forEach(registrations, function (reg) {
            const newTeamReg: TournamentTeam = TournamentTeam.fromJson(reg);
            newTeamReg.id = reg.$key;
            allRegistrations.push(newTeamReg);
          });
          that.store.dispatch({type: LOAD_TEAM_REGISTRATIONS_FINISHED_ACTION});
          that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION, payload: allRegistrations});
          firstLoad = false;
        } else {

          _.forEach(registrations, function (reg) {
            const newTeamReg: TournamentTeam = TournamentTeam.fromJson(reg);
            newTeamReg.id = reg.$key;

            if (!_.find(allRegistrations, _.matches(newTeamReg))) {
              that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: newTeamReg});
            }
          });
        }
      });
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allRegistrations: TournamentTeam[] = [];
    let newItems = false;

    this.tournamentTeamRegistrationsRef = firebase.database().ref('tournament-team-registrations/' + tournamentId);

    this.tournamentTeamRegistrationsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const teamReg: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      teamReg.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: teamReg});

    });

    this.tournamentTeamRegistrationsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const teamReg: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      teamReg.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: teamReg});
    });

    this.tournamentTeamRegistrationsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: snapshot.key});
    });

    this.tournamentTeamRegistrationsRef.once('value', function (snapshot) {

      snapshot.forEach(function (regSnapshot) {

        const teamReg: TournamentTeam = TournamentTeam.fromJson(regSnapshot.val());
        teamReg.id = regSnapshot.key;
        allRegistrations.push(teamReg);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_TEAM_REGISTRATIONS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_TEAM_REGISTRATIONS_ACTION, payload: allRegistrations});
      newItems = true;
    });
  }

  pushTeamRegistration(teamRegPush: TeamRegistrationPush) {

    const tournamentTeamsRef = this.afoDatabase.list('tournament-team-registrations/' + teamRegPush.team.tournamentId);
    tournamentTeamsRef.push(teamRegPush.team);

    const tournamentRegRef = this.afoDatabase.list('tournament-registrations/' + teamRegPush.tournament.id);
    const newRegistrationRef: firebase.database.Reference = tournamentRegRef.push(teamRegPush.registrations[0]);

    const playerRegRef = this.afoDatabase.object('players-registrations/' + teamRegPush.registrations[0].playerId + '/' + newRegistrationRef.key);
    playerRegRef.set(teamRegPush.registrations[0]);

    const tournamentRef = this.afoDatabase.object('tournaments/' + teamRegPush.tournament.id);
    tournamentRef.update({actualParticipants: (teamRegPush.tournament.actualParticipants + 1 )});

  }


  killTeamRegistration(teamRegPush: TeamRegistrationPush) {

    const that = this;

    const tournamentTeamsRef = this.afoDatabase.list('tournament-team-registrations/' + teamRegPush.team.tournamentId + '/' + teamRegPush.team.id);
    tournamentTeamsRef.remove();

    _.forEach(teamRegPush.registrations, function (reg: Registration) {
      const regRef = that.afoDatabase.object('tournament-registrations/' + reg.tournamentId + '/' + reg.id);
      regRef.remove();

      const playerRegRef = that.afoDatabase.object('players-registrations/' + reg.playerId + '/' + reg.id);
      playerRegRef.remove();


    });

    const tournamentRef = this.afoDatabase.object('tournaments/' + teamRegPush.tournament.id);
    tournamentRef.update({
      actualParticipants: (teamRegPush.tournament.actualParticipants - teamRegPush.registrations.length)
    });


  }

  acceptTeamRegistration(teamRegistrationPush: TeamRegistrationPush) {
    const that = this;

    const tournamentTeamsRegRef = this.afoDatabase.
    object('tournament-teams/' + teamRegistrationPush.tournament.id + '/' + teamRegistrationPush.team.id);
    tournamentTeamsRegRef.set(teamRegistrationPush.team);

    const teamRegistrationRef = that.afoDatabase.
    object('tournament-team-registrations/' + teamRegistrationPush.tournament.id + '/' + teamRegistrationPush.team.id);
    teamRegistrationRef.update({isAcceptedTournamentTeam: true});

    _.forEach(teamRegistrationPush.registrations, function (registration: Registration) {
      const tournamentPlayer = TournamentPlayer.fromRegistration(registration);

      const tournamentPlayers = that.afoDatabase.list('tournament-players/' + registration.tournamentId);
      tournamentPlayers.push(tournamentPlayer);

      const registrationRef = that.afoDatabase.
      object('tournament-registrations/' + registration.tournamentId + '/' + registration.id);
      registrationRef.update({isTournamentPlayer: true});
    });
  }

  teamRegistrationChange(change: TeamRegistrationChange) {
    const registrationRef = this.afoDatabase.object('tournament-team-registrations/' +
      change.team.tournamentId + '/' + change.team.id);
    registrationRef.update({
      armyListsChecked: change.armyListsChecked,
      paymentChecked: change.paymentChecked,
      playerMarkedPayment: change.playerMarkedPayment,
      playerUploadedArmyLists: change.playerUploadedArmyLists
    });


  }
}
