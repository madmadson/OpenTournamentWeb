import * as _ from 'lodash';
import {Player} from '../../../shared/model/player';
import {
  ADD_ALL_PLAYERS_ACTION, ADD_PLAYER_ACTION, CHANGE_PLAYER_ACTION, CHANGE_SEARCH_FIELD_PLAYERS_ACTION,
  CLEAR_ALL_PLAYERS_ACTION, LOAD_PLAYERS_FINISHED_ACTION, REMOVE_PLAYER_ACTION
} from './players-actions';

export interface PlayersState {
  players: Player[];

  loadPlayers: boolean;
  searchField: string;
}

const initialState: PlayersState = {

  players: [],
  loadPlayers: true,
  searchField: ''
};

export function playersReducer(state: PlayersState = initialState, action): PlayersState {

  switch (action.type) {

    case ADD_ALL_PLAYERS_ACTION:
      return addAllPlayers(state, action);

    case CLEAR_ALL_PLAYERS_ACTION:
      return handlePlayerClearData(state);

    case ADD_PLAYER_ACTION:
      return handlePlayerAddedData(state, action);

    case CHANGE_PLAYER_ACTION:
      return handlePlayerChangedData(state, action);

    case REMOVE_PLAYER_ACTION:
      return handlePlayerDeletedData(state, action);

    case LOAD_PLAYERS_FINISHED_ACTION:
      return handleLoadFinishedPlayers(state);


    case CHANGE_SEARCH_FIELD_PLAYERS_ACTION:
      return handleSearchFieldPlayers(state, action);

    default:
      return state;

  }
}

function addAllPlayers(state: PlayersState, action): PlayersState {

  const newStoreState: PlayersState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.players = action.payload;

  }
  return newStoreState;
}


function handlePlayerClearData(state: PlayersState): PlayersState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.players = [];

  return newStoreState;
}

function handlePlayerAddedData(state: PlayersState, action): PlayersState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.players.push(action.payload);
  }
  return newStoreState;
}

function handlePlayerChangedData(state: PlayersState, action): PlayersState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload.id]);
    newStoreState.players[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handlePlayerDeletedData(state: PlayersState, action): PlayersState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload]);
    newStoreState.players.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}

function handleLoadFinishedPlayers(state: PlayersState): PlayersState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.loadPlayers = false;

  return newStoreState;
}


function handleSearchFieldPlayers(state: PlayersState, action): PlayersState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.searchField = action.payload;
  }
  return newStoreState;
}
