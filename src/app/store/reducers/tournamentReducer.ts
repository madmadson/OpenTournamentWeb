import {Action} from '@ngrx/store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from '../tournament-data';

import * as _ from 'lodash';
import {
  TOURNAMENT_ADDED_ACTION, TOURNAMENT_CHANGED_ACTION, TOURNAMENT_DELETED_ACTION,
  TOURNAMENTS_CLEAR_ACTION
} from "../actions/tournaments-actions";
import {SET_ACTUAL_TOURNAMENT_ACTION} from "../actions/tournament-actions";


export function TournamentReducer(state: TournamentData = INITIAL_TOURNAMENT_DATA, action: Action): TournamentData {


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


    default:
      return state;

  }
}


function handleTournamentClearData(state: TournamentData, action: Action): TournamentData {
  const newStoreState = _.cloneDeep(state);

  newStoreState.tournaments = [];

  return newStoreState;
}

function handleTournamentAddedData(state: TournamentData, action: Action): TournamentData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.tournaments.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentChangedData(state: TournamentData, action: Action): TournamentData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.tournaments, ['id', action.payload.id]);
    newStoreState.tournaments[indexOfSearchedTournament] = action.payload;
  }
  return newStoreState;
}

function handleTournamentDeletedData(state: TournamentData, action: Action): TournamentData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.tournaments, ['id', action.payload]);
    newStoreState.tournaments.splice(indexOfSearchedTournament, 1);
  }
  return newStoreState;
}


function handleSetTournament(state: TournamentData, action: Action): TournamentData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.actualTournament = action.payload;
  }
  return newStoreState;
}

