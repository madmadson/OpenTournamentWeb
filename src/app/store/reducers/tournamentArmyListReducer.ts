import {Action} from '@ngrx/store';
import {
  ARMY_LIST_ADDED_ACTION, ARMY_LIST_DELETED_ACTION,
  CLEAR_ARMY_LISTS_ACTION,

} from '../actions/tournament-actions';

import * as _ from 'lodash';
import {ArmyList} from '../../../../shared/model/armyList';

export interface ActualTournamentArmyListsStoreData {
  actualTournamentArmyLists: ArmyList[];
}

const INITIAL_STATE: ActualTournamentArmyListsStoreData = {

  actualTournamentArmyLists: []
};


export function TournamentArmyListReducer(
  state: ActualTournamentArmyListsStoreData = INITIAL_STATE, action: Action): ActualTournamentArmyListsStoreData {


  switch (action.type) {


    case ARMY_LIST_ADDED_ACTION:

      return handleArmyListAddedAction(state, action);

    case ARMY_LIST_DELETED_ACTION:

      return handleArmyListDeletedAction(state, action);

    case CLEAR_ARMY_LISTS_ACTION:

      return handleClearArmyListsAction(state, action);


    default:
      return state;

  }
}


function handleArmyListAddedAction(
  state: ActualTournamentArmyListsStoreData, action: Action): ActualTournamentArmyListsStoreData {

  const newTournamentData: ActualTournamentArmyListsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentArmyLists === undefined) {
      newTournamentData.actualTournamentArmyLists = [];
    }
    newTournamentData.actualTournamentArmyLists.push(action.payload);
  }
  return newTournamentData;
}


function handleArmyListDeletedAction(
  state: ActualTournamentArmyListsStoreData, action: Action): ActualTournamentArmyListsStoreData {

  const newStoreState: ActualTournamentArmyListsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedArmyList = _.findIndex(newStoreState.actualTournamentArmyLists, ['id', action.payload]);
    newStoreState.actualTournamentArmyLists.splice(indexOfSearchedArmyList, 1);
  }
  return newStoreState;
}

function handleClearArmyListsAction(
  state: ActualTournamentArmyListsStoreData, action: Action): ActualTournamentArmyListsStoreData {

  const newTournamentData: ActualTournamentArmyListsStoreData = _.cloneDeep(state);

  newTournamentData.actualTournamentArmyLists = [];

  return newTournamentData;
}

