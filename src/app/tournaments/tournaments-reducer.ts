
import * as _ from 'lodash';

import {
  ADD_ALL_TOURNAMENTS_ACTION, ADD_TOURNAMENT_ACTION, CHANGE_TOURNAMENT_ACTION,
  CLEAR_ALL_TOURNAMENTS_ACTION, REMOVE_TOURNAMENT_ACTION
} from './tournaments-actions';
import {Tournament} from '../../../shared/model/tournament';



export interface TournamentsState {
  tournaments: Tournament[];
}

const initialState: TournamentsState = {

  tournaments: []
};

export function tournamentsReducer(state: TournamentsState = initialState, action): TournamentsState {

  switch (action.type) {

    case ADD_ALL_TOURNAMENTS_ACTION:
      return addAllTournaments(state, action);

    case CLEAR_ALL_TOURNAMENTS_ACTION:
      return handleTournamentClearData(state);

    case ADD_TOURNAMENT_ACTION:
      return handleTournamentAddedData(state, action);

    case CHANGE_TOURNAMENT_ACTION:
      return handleTournamentChangedData(state, action);

    case REMOVE_TOURNAMENT_ACTION:
      return handleTournamentDeletedData(state, action);

    default:
      return state;

  }
}

function addAllTournaments(state: TournamentsState, action): TournamentsState {

  const newStoreState: TournamentsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.tournaments = action.payload;

  }
  return newStoreState;
}


function handleTournamentClearData(state: TournamentsState): TournamentsState {
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

