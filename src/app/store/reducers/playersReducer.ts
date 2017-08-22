import {Action} from '@ngrx/store';


import * as _ from 'lodash';
import {
  PLAYER_ADDED_ACTION, PLAYER_CHANGED_ACTION, PLAYER_DELETED_ACTION,
  PLAYERS_CLEAR_ACTION
} from '../actions/players-actions';
import {Player} from '../../../../shared/model/player';

export interface PlayerStoreData {
  players: Player[];
}

const INITIAL_STATE: PlayerStoreData = {

  players: []
};


export function PlayersReducer(state: PlayerStoreData = INITIAL_STATE, action): PlayerStoreData {


  switch (action.type) {

    case PLAYERS_CLEAR_ACTION:

      return handlePlayersClearAction(state, action);

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

function handlePlayersClearAction(
  state: PlayerStoreData, action): PlayerStoreData {

  const playersStoreData: PlayerStoreData = _.cloneDeep(state);

  playersStoreData.players = [];

  return playersStoreData;
}

function handlePlayerAddedData(state: PlayerStoreData, action): PlayerStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.players.push(action.payload);
  }
  return newStoreState;
}

function handlePlayerChangedData(state: PlayerStoreData, action): PlayerStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload.id]);
    newStoreState.players[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handlePlayerDeletedData(state: PlayerStoreData, action): PlayerStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload]);
    newStoreState.players.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}

