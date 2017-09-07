import {
  ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION,
  CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION,
  LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION
} from './tournament-actions';


import * as _ from 'lodash';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';

export interface ActualTournamentPlayersState {

  players: TournamentPlayer[];

  loadPlayers: boolean;
  playersSearchField: string;
}

const initialState = {

  players: [],
  loadPlayers: true,

  playersSearchField: ''
};


export function playersReducer(state = initialState, action): ActualTournamentPlayersState {

  switch (action.type) {


    // TournamentPlayer
    case ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION:
      return handleAddTournamentTournamentPlayerAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION:
      return handleChangeTournamentTournamentPlayerAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION:
      return handleRemoveTournamentTournamentPlayerAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION:
      return handleClearTournamentTournamentPlayerAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION:
      return handleAddAllTournamentTournamentPlayerAction(state, action);

    case LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION:
      return handleLoadTournamentPlayersFinishedAction(state);

    case CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION:
      return handleSearchFieldTournamentPlayersAction(state, action);



    default:
      return state;
  }
}


// TournamentPlayers

function handleAddTournamentTournamentPlayerAction(state: ActualTournamentPlayersState, action): ActualTournamentPlayersState {

  const newTournamentData: ActualTournamentPlayersState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.players.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentTournamentPlayerAction(state: ActualTournamentPlayersState, action): ActualTournamentPlayersState {
  const newStoreState: ActualTournamentPlayersState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournamentPlayer = _.findIndex(newStoreState.players, ['id', action.payload.id]);

    newStoreState.players[indexOfSearchedTournamentPlayer] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentTournamentPlayerAction(state: ActualTournamentPlayersState, action): ActualTournamentPlayersState {
  const newStoreState: ActualTournamentPlayersState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournamentPlayer = _.findIndex(newStoreState.players, ['id', action.payload]);
    newStoreState.players.splice(indexOfSearchedTournamentPlayer, 1);
  }
  return newStoreState;
}


function handleClearTournamentTournamentPlayerAction(state: ActualTournamentPlayersState): ActualTournamentPlayersState {

  const newTournamentData: ActualTournamentPlayersState = _.cloneDeep(state);

  newTournamentData.players = [];

  return newTournamentData;
}

function handleAddAllTournamentTournamentPlayerAction(state: ActualTournamentPlayersState, action): ActualTournamentPlayersState {

  const newStoreState: ActualTournamentPlayersState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.players = action.payload;
  }
  return newStoreState;
}


function handleLoadTournamentPlayersFinishedAction(state: ActualTournamentPlayersState): ActualTournamentPlayersState {

  const newStoreState: ActualTournamentPlayersState = _.cloneDeep(state);

  newStoreState.loadPlayers = false;

  return newStoreState;
}

function handleSearchFieldTournamentPlayersAction(state: ActualTournamentPlayersState, action): ActualTournamentPlayersState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.playersSearchField = action.payload;
  }
  return newStoreState;
}


