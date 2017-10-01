import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';
import {
  ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION
} from './store/tournament-actions';

import {AngularFireOfflineDatabase} from 'angularfire2-offline';

import * as firebase from 'firebase';
import {ArmyList} from '../../../shared/model/armyList';
import {ArmyListRegistrationPush} from '../../../shared/dto/armyList-registration-push';
import {TournamentTeam} from '../../../shared/model/tournament-team';

import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';


@Injectable()
export class ActualTournamentArmyListService {

  private armyListRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private store: Store<AppState>) {}

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION});
    if (this.armyListRef) {
      this.armyListRef.off();
    }

    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  public subscribeOnOfflineFirebase(tournamentId: string) {

    const that = this;
    const allArmyLists: ArmyList[] = [];
    let firstLoad = true;

    this.offlineSub = this.afoDatabase.list('tournament-armyLists/' + tournamentId)
      .subscribe((armyLists) => {

        if (firstLoad) {
          _.forEach(armyLists, function (list) {
            const armyList: ArmyList = ArmyList.fromJson(list);
            armyList.id = list.$key;
            allArmyLists.push(armyList);
          });

          that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION, payload: allArmyLists});
          firstLoad = false;
        } else {

          _.forEach(armyLists, function (list) {
            const armyList: ArmyList = ArmyList.fromJson(list);
            armyList.id = list.$key;

            if (!_.find(allArmyLists, _.matches(armyList))) {
              that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION, payload: armyList});
            }
          });
        }
      });
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allArmyLists: ArmyList[] = [];
    let newItems = false;

    this.armyListRef = firebase.database().ref('tournament-armyLists/' + tournamentId);

    this.armyListRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const armyList: ArmyList = ArmyList.fromJson(snapshot.val());
      armyList.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION, payload: armyList});

    });

    this.armyListRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const armyList: ArmyList = ArmyList.fromJson(snapshot.val());
      armyList.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION, payload: armyList});
    });

    this.armyListRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION, payload: snapshot.key});
    });

    this.armyListRef.once('value', function (snapshot) {

      snapshot.forEach(function (armyListSnapshot) {

        const reg: ArmyList = ArmyList.fromJson(armyListSnapshot.val());
        reg.id = armyListSnapshot.key;
        allArmyLists.push(reg);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION, payload: allArmyLists});
      newItems = true;
    });
  }


  pushArmyListForRegistration(armyListRegistrationPush: ArmyListRegistrationPush) {

    const tournamentArmyListRef = this.afoDatabase.list('tournament-armyLists/' + armyListRegistrationPush.armyList.tournamentId);
    tournamentArmyListRef.push(armyListRegistrationPush.armyList);

    const registrationRef = this.afoDatabase.object('tournament-registrations/' +
      armyListRegistrationPush.registration.tournamentId + '/' + armyListRegistrationPush.registration.id);
    registrationRef.update({
      playerUploadedArmyLists: true,
      armyListsChecked: false
    });
  }

  pushArmyListForTournamentPlayer(armyList: ArmyList) {

    const tournamentArmyListRef = this.afoDatabase.list('tournament-armyLists/' + armyList.tournamentId);
    tournamentArmyListRef.push(armyList);
  }

  killArmyList(armyList: ArmyList) {
    const armyListRef = this.afoDatabase
      .list('tournament-armyLists/' + armyList.tournamentId + '/' + armyList.id);
    armyListRef.remove();
  }

  setTeamArmyListStatus(team: TournamentTeam) {
    const registrationRef = this.afoDatabase.object('tournament-team-registrations/' +
      team.tournamentId + '/' + team.id);
    registrationRef.update({
      playerUploadedArmyLists: true,
      armyListsChecked: false
    });
  }
}
