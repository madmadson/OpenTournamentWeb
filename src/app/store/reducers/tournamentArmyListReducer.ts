import {Action} from '@ngrx/store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from '../tournament-data';
import {
  ARMY_LIST_ADDED_ACTION, ARMY_LIST_DELETED_ACTION,
  CLEAR_ARMY_LISTS_ACTION,
  CLEAR_TOURNAMENT_PLAYER_ACTION,
  CLEAR_TOURNAMENT_REGISTRATION_ACTION, TOURNAMENT_PLAYER_ADDED, TOURNAMENT_PLAYER_CHANGED, TOURNAMENT_PLAYER_DELETED,
  TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import * as _ from 'lodash';


export function TournamentArmyListReducer(state: TournamentData = INITIAL_TOURNAMENT_DATA, action: Action): TournamentData {


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


function handleArmyListAddedAction(state: TournamentData, action: Action): TournamentData {

  const newTournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentArmyLists === undefined) {
      newTournamentData.actualTournamentArmyLists = [];
    }
    newTournamentData.actualTournamentArmyLists.push(action.payload);
  }
  return newTournamentData;
}


function handleArmyListDeletedAction(state: TournamentData, action: Action): TournamentData {

  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedArmyList = _.findIndex(newStoreState.actualTournamentArmyLists, ['id', action.payload]);
    newStoreState.actualTournamentArmyLists.splice(indexOfSearchedArmyList, 1);
  }
  return newStoreState;
}

function handleClearArmyListsAction(state: TournamentData, action: Action): TournamentData {

  const newTournamentData = _.cloneDeep(state);

  newTournamentData.actualTournamentArmyLists = [];

  return newTournamentData;
}

