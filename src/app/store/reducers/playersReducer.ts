import * as _ from 'lodash';
import {
  PLAYER_ADDED_ACTION, PLAYER_CHANGED_ACTION, PLAYER_DELETED_ACTION,
  PLAYERS_CLEAR_ACTION
} from '../actions/players-actions';
import {Player} from '../../../../shared/model/player';

export interface PlayersState {
  players: Player[];
}

const initialState: PlayersState = {

  players: []
};


export function playersReducer(state = initialState, action): PlayersState {


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
  state: PlayersState, action): PlayersState {

  const playersStoreData: PlayersState = _.cloneDeep(state);

  playersStoreData.players = [];

  return playersStoreData;
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

