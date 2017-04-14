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
import {GlobalData, INITIAL_GLOBAL_DATA} from "../global-store-data";
import {PLAYER_ADDED_ACTION, PLAYER_CHANGED_ACTION, PLAYER_DELETED_ACTION} from "../actions/players-actions";
import {Player} from "../../../../shared/model/player";


export interface PlayerStoreData {
  players: Player[];
}

const INITIAL_STATE: PlayerStoreData = {

  players: []
};


export function PlayersReducer(state: PlayerStoreData = INITIAL_STATE, action: Action): PlayerStoreData {


  switch (action.type) {

    case PLAYER_ADDED_ACTION:

      return handlePlayerAddedData(state, action);

    case PLAYER_CHANGED_ACTION:

      return handlePlayerChangedData(state, action);

    case PLAYER_DELETED_ACTION:

      return handlePlayerDeletedData(state, action);

    default:
      return state;

  }
}

function handlePlayerAddedData(state: PlayerStoreData, action: Action): PlayerStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.players.push(action.payload);
  }
  return newStoreState;
}

function handlePlayerChangedData(state: PlayerStoreData, action: Action): PlayerStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload.id]);
    newStoreState.players[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handlePlayerDeletedData(state: PlayerStoreData, action: Action): PlayerStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload]);
    newStoreState.players.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}

