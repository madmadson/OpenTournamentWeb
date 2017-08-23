import {Action} from '@ngrx/store';

import * as _ from 'lodash';
import {
  TOURNAMENT_ADDED_ACTION, TOURNAMENT_CHANGED_ACTION, TOURNAMENT_DELETED_ACTION,
  TOURNAMENTS_CLEAR_ACTION
} from '../actions/tournaments-actions';
import {Tournament} from '../../../../shared/model/tournament';



export interface TournamentsState {
  tournaments: Tournament[];
}

const initialState: TournamentsState = {

  tournaments: []
};

export function tournamentsReducer(state: TournamentsState = initialState, action): TournamentsState {

  switch (action.type) {

    case TOURNAMENTS_CLEAR_ACTION:
      return handleTournamentClearData(state, action);

    case TOURNAMENT_ADDED_ACTION:
      return handleTournamentAddedData(state, action);

    case TOURNAMENT_CHANGED_ACTION:
      return handleTournamentChangedData(state, action);

    case TOURNAMENT_DELETED_ACTION:
      return handleTournamentDeletedData(state, action);

    default:
      return state;

  }
}


function handleTournamentClearData(state: TournamentsState, action): TournamentsState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.tournaments = [];

  return newStoreState;
}

function handleTournamentAddedData(state: TournamentsState, action): TournamentsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.tournaments.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentChangedData(state: TournamentsState, action): TournamentsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.tournaments, ['id', action.payload.id]);
    newStoreState.tournaments[indexOfSearchedTournament] = action.payload;
  }
  return newStoreState;
}

function handleTournamentDeletedData(state: TournamentsState, action): TournamentsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.tournaments, ['id', action.payload]);
    newStoreState.tournaments.splice(indexOfSearchedTournament, 1);
  }
  return newStoreState;
}

