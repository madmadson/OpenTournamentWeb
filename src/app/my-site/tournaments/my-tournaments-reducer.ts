import * as _ from 'lodash';
import {Tournament} from '../../../../shared/model/tournament';
import {
  ADD_ALL_MY_TOURNAMENTS_ACTION, ADD_MY_TOURNAMENT_ACTION, CHANGE_MY_TOURNAMENT_ACTION, CLEAR_ALL_MY_TOURNAMENTS_ACTION,
  LOAD_MY_TOURNAMENTS_FINISHED_ACTION, REMOVE_MY_TOURNAMENT_ACTION
} from './my-tournaments-actions';

export interface MyTournamentsState {
  myTournaments: Tournament[];

  loadMyTournaments: boolean;

  filter: string;
  searchField: string;
}

const initialState: MyTournamentsState = {

  myTournaments: [],
  loadMyTournaments: true,
  filter: 'UPCOMING',
  searchField: ''
};

export function myTournamentsReducer(state: MyTournamentsState = initialState, action): MyTournamentsState {

  switch (action.type) {

    case ADD_ALL_MY_TOURNAMENTS_ACTION:
      return addAllMyTournaments(state, action);

    case CLEAR_ALL_MY_TOURNAMENTS_ACTION:
      return handleMyTournamentClearData(state);

    case ADD_MY_TOURNAMENT_ACTION:
      return handleMyTournamentAddedData(state, action);

    case CHANGE_MY_TOURNAMENT_ACTION:
      return handleMyTournamentChangedData(state, action);

    case REMOVE_MY_TOURNAMENT_ACTION:
      return handleMyTournamentDeletedData(state, action);

    case LOAD_MY_TOURNAMENTS_FINISHED_ACTION:
      return handleLoadFinishedMyTournaments(state);


    default:
      return state;

  }
}

function addAllMyTournaments(state: MyTournamentsState, action): MyTournamentsState {
  const newStoreState: MyTournamentsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.myTournaments = action.payload;
  }
  return newStoreState;
}


function handleMyTournamentClearData(state: MyTournamentsState): MyTournamentsState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.myTournaments = [];

  return newStoreState;
}

function handleMyTournamentAddedData(state: MyTournamentsState, action): MyTournamentsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.myTournaments.push(action.payload);
  }
  return newStoreState;
}

function handleMyTournamentChangedData(state: MyTournamentsState, action): MyTournamentsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.myTournaments, ['id', action.payload.id]);
    newStoreState.myTournaments[indexOfSearchedTournament] = action.payload;
  }
  return newStoreState;
}

function handleMyTournamentDeletedData(state: MyTournamentsState, action): MyTournamentsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTournament = _.findIndex(newStoreState.myTournaments, ['id', action.payload]);
    newStoreState.myTournaments.splice(indexOfSearchedTournament, 1);
  }
  return newStoreState;
}

function handleLoadFinishedMyTournaments(state: MyTournamentsState): MyTournamentsState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.loadMyTournaments = false;

  return newStoreState;
}


