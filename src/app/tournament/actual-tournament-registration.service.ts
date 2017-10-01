import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';
import {
  ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  LOAD_REGISTRATIONS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION
} from './store/tournament-actions';
import {Registration} from '../../../shared/model/registration';


import {RegistrationPush} from '../../../shared/dto/registration-push';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';


import * as _ from 'lodash';
import * as firebase from 'firebase';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {PlayerRegistrationChange} from '../../../shared/dto/playerRegistration-change';
import {Subscription} from 'rxjs/Subscription';


@Injectable()
export class ActualTournamentRegistrationService {

  private tournamentRegistrationsRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private store: Store<AppState>) {}

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION});
    if (this.tournamentRegistrationsRef) {
      this.tournamentRegistrationsRef.off();
    }
    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  public subscribeOnOfflineFirebase(tournamentId: string) {

    const that = this;
    const allRegistrations: Registration[] = [];
    let firstLoad = true;

    this.offlineSub = this.afoDatabase.list('tournament-registrations/' + tournamentId)
      .subscribe((registrations) => {

        if (firstLoad) {
          _.forEach(registrations, function (registration) {
            const newReg: Registration = Registration.fromJson(registration);
            newReg.id = registration.$key;
            allRegistrations.push(newReg);
          });
          that.store.dispatch({type: LOAD_REGISTRATIONS_FINISHED_ACTION});
          that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION, payload: allRegistrations});
          firstLoad = false;
        } else {

          _.forEach(registrations, function (registration) {
            const newReg: Registration = Registration.fromJson(registration);
            newReg.id = registration.$key;

            if (!_.find(allRegistrations, _.matches(newReg))) {
              that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION, payload: registration});
            }
          });
        }
      });
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
      that.store.dispatch({type: LOAD_REGISTRATIONS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION, payload: allRegistrations});
      newItems = true;
    });
  }


  pushRegistration(registrationPush: RegistrationPush) {

    const tournamentRegRef = this.afoDatabase.list('tournament-registrations/' + registrationPush.tournament.id);
    const newRegistrationRef: firebase.database.Reference = tournamentRegRef.push(registrationPush.registration);

    const playerRegRef = this.afoDatabase.object('players-registrations/' + registrationPush.registration.playerId + '/' + newRegistrationRef.key);
    playerRegRef.set(registrationPush.registration);

    const tournamentRef = this.afoDatabase.object('tournaments/' + registrationPush.tournament.id);
    tournamentRef.update({actualParticipants: (registrationPush.tournament.actualParticipants + 1 )});

    if ( registrationPush.tournament.teamSize > 0) {

      let newListOfRegisteredTeamMembers = [];

      if (registrationPush.tournamentTeam.registeredPlayerIds) {
        newListOfRegisteredTeamMembers = _.cloneDeep(registrationPush.tournamentTeam.registeredPlayerIds);
      }

      newListOfRegisteredTeamMembers.push(registrationPush.registration.playerId);

      const tournamentTeamRef = this.afoDatabase.object(
        'tournament-team-registrations/' +
        registrationPush.tournament.id + '/' +
        registrationPush.tournamentTeam.id);
      tournamentTeamRef.update({registeredPlayerIds: newListOfRegisteredTeamMembers});
    }
  }

  killRegistration(regPush: RegistrationPush) {
    const regRef = this.afoDatabase.list('tournament-registrations/' + regPush.registration.tournamentId + '/' + regPush.registration.id);
    regRef.remove();

    const playerRegRef = this.afoDatabase
      .list('players-registrations/' + regPush.registration.playerId + '/' + regPush.registration.id);
    playerRegRef.remove();

    const tournamentRef = this.afoDatabase.object('tournaments/' + regPush.registration.tournamentId);
    tournamentRef.update({actualParticipants: (regPush.tournament.actualParticipants - 1 )});

    if ( regPush.tournament.teamSize > 0) {

      const newListOfRegisteredTeamMembers = _.cloneDeep(regPush.tournamentTeam.registeredPlayerIds);

      const index = newListOfRegisteredTeamMembers.indexOf(regPush.registration.playerId);
      newListOfRegisteredTeamMembers.splice(index, 1);

      const tournamentTeamRef = this.afoDatabase.object(
        'tournament-team-registrations/' +
        regPush.tournament.id + '/' +
        regPush.tournamentTeam.id);
      tournamentTeamRef.update({registeredPlayerIds: newListOfRegisteredTeamMembers});
    }
  }

  acceptRegistration(registration: Registration) {
    const tournamentPlayer = TournamentPlayer.fromRegistration(registration);

    const tournamentPlayers = this.afoDatabase.list('tournament-players/' + registration.tournamentId);
    tournamentPlayers.push(tournamentPlayer);

    const registrationRef = this.afoDatabase.object('tournament-registrations/' + registration.tournamentId + '/' + registration.id);
    registrationRef.update({isTournamentPlayer: true});

  }

  changeRegistration(regChange: PlayerRegistrationChange) {
    const registrationRef = this.afoDatabase.object('tournament-registrations/' +
      regChange.registration.tournamentId + '/' + regChange.registration.id);

    registrationRef.update({
      armyListsChecked: regChange.armyListsChecked,
      paymentChecked: regChange.paymentChecked,
      playerMarkedPayment: regChange.playerMarkedPayment,
      playerUploadedArmyLists: regChange.playerUploadedArmyLists
    });
  }

}
