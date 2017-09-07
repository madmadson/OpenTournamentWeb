import {
  ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION
} from './tournament-actions';


import * as _ from 'lodash';
import {ArmyList} from '../../../../shared/model/armyList';

export interface ActualTournamentArmyListsState {

  armyLists: ArmyList[];

}

const initialState = {


  armyLists: [],

};


export function actualTournamentArmyListsReducer(state = initialState, action): ActualTournamentArmyListsState {

  switch (action.type) {


    // ArmyLists
    case ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION:
      return handleAddTournamentArmyListAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION:
      return handleChangeTournamentArmyListAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION:
      return handleRemoveTournamentArmyListAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION:
      return handleClearTournamentArmyListAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION:
      return handleAddAllTournamentArmyListAction(state, action);


    default:
      return state;
  }
}



// ArmyLists

function handleAddTournamentArmyListAction(state: ActualTournamentArmyListsState, action): ActualTournamentArmyListsState {

  const newTournamentData: ActualTournamentArmyListsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.armyLists.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentArmyListAction(state: ActualTournamentArmyListsState, action): ActualTournamentArmyListsState {
  const newStoreState: ActualTournamentArmyListsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedArmyList = _.findIndex(newStoreState.armyLists, ['id', action.payload.id]);

    newStoreState.armyLists[indexOfSearchedArmyList] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentArmyListAction(state: ActualTournamentArmyListsState, action): ActualTournamentArmyListsState {
  const newStoreState: ActualTournamentArmyListsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedArmyList = _.findIndex(newStoreState.armyLists, ['id', action.payload]);
    newStoreState.armyLists.splice(indexOfSearchedArmyList, 1);
  }
  return newStoreState;
}


function handleClearTournamentArmyListAction(state: ActualTournamentArmyListsState): ActualTournamentArmyListsState {

  const newTournamentData: ActualTournamentArmyListsState = _.cloneDeep(state);

  newTournamentData.armyLists = [];

  return newTournamentData;
}

function handleAddAllTournamentArmyListAction(state: ActualTournamentArmyListsState, action): ActualTournamentArmyListsState {

  const newStoreState: ActualTournamentArmyListsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.armyLists = action.payload;

  }
  return newStoreState;
}
