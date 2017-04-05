import {StoreData} from "../store-data";
import {Action} from "@ngrx/store";
import {
  TOURNAMENT_ADDED_ACTION,
  TOURNAMENT_CHANGED_ACTION,
  TOURNAMENT_DELETED_ACTION,
  TOURNAMENTS_CLEAR_ACTION
} from "../actions/tournaments-actions";
import * as _ from "lodash";
import {SET_ACTUAL_TOURNAMENT_ACTION} from "../actions/tournament-actions";
import {PLAYER_ADDED_ACTION, PLAYER_CHANGED_ACTION, PLAYER_DELETED_ACTION} from "../actions/players-actions";

export function storeData(state: StoreData, action: Action): StoreData {
  switch (action.type) {

    case TOURNAMENTS_CLEAR_ACTION:

      return handleTournamentClearData(state, action);

    case TOURNAMENT_ADDED_ACTION:

      return handleTournamentAddedData(state, action);

    case TOURNAMENT_CHANGED_ACTION:

      return handleTournamentChangedData(state, action);

    case TOURNAMENT_DELETED_ACTION:

      return handleTournamentDeletedData(state, action);

    case SET_ACTUAL_TOURNAMENT_ACTION:

      return handleSetTournament(state, action);

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

function handleTournamentClearData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  newStoreState.tournaments = [];

  return newStoreState;
}

function handleTournamentAddedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.tournaments.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentChangedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.tournaments, ['id', action.payload.id]);
    newStoreState.tournaments[indexOfSearchedTournament] = action.payload;
  }
  return newStoreState;
}

function handleTournamentDeletedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.tournaments, ['id', action.payload]);
    newStoreState.tournaments.splice(indexOfSearchedTournament, 1);
  }
  return newStoreState;
}


function handleSetTournament(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    console.log('set tournament: ' + JSON.stringify(action.payload));
      newStoreState.actualTournament = action.payload;
  }
  return newStoreState;
}

function handlePlayerAddedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.players.push(action.payload);
  }
  return newStoreState;
}

function handlePlayerChangedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload.id]);
    newStoreState.players[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handlePlayerDeletedData(state: StoreData, action: Action): StoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.players, ['id', action.payload]);
    newStoreState.players.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}


