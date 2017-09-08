import {
  ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  LOAD_REGISTRATIONS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
} from './tournament-actions';


import * as _ from 'lodash';

import {Registration} from '../../../../shared/model/registration';


export interface ActualTournamentRegistrationsState {

  registrations: Registration[];

  loadRegistrations: boolean;
}

const initialState = {

  registrations: [],

  loadRegistrations: true,

};


export function actualTournamentRegistrationsReducer(state = initialState, action): ActualTournamentRegistrationsState {

  switch (action.type) {


    // Registrations
    case ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION:
      return handleAddTournamentRegistrationAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION:
      return handleChangeTournamentRegistrationAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION:
      return handleRemoveTournamentRegistrationAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION:
      return handleClearTournamentRegistrationAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION:
      return handleAddAllTournamentRegistrationAction(state, action);

    case LOAD_REGISTRATIONS_FINISHED_ACTION:
      return handleLoadRegistrationsFinishedAction(state);


    default:
      return state;
  }
}


// Registrations

function handleAddTournamentRegistrationAction(state: ActualTournamentRegistrationsState, action): ActualTournamentRegistrationsState {

  const newTournamentData: ActualTournamentRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.registrations.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentRegistrationAction(state: ActualTournamentRegistrationsState, action): ActualTournamentRegistrationsState {
  const newStoreState: ActualTournamentRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.registrations, ['id', action.payload.id]);

    newStoreState.registrations[indexOfSearchedRegistration] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentRegistrationAction(state: ActualTournamentRegistrationsState, action): ActualTournamentRegistrationsState {
  const newStoreState: ActualTournamentRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.registrations, ['id', action.payload]);
    newStoreState.registrations.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleClearTournamentRegistrationAction(state: ActualTournamentRegistrationsState): ActualTournamentRegistrationsState {

  const newTournamentData: ActualTournamentRegistrationsState = _.cloneDeep(state);

  newTournamentData.registrations = [];

  return newTournamentData;
}

function handleAddAllTournamentRegistrationAction(state: ActualTournamentRegistrationsState, action): ActualTournamentRegistrationsState {

  const newStoreState: ActualTournamentRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.registrations = action.payload;

  }
  return newStoreState;
}

function handleLoadRegistrationsFinishedAction(state: ActualTournamentRegistrationsState): ActualTournamentRegistrationsState {
  const newStoreState: ActualTournamentRegistrationsState = _.cloneDeep(state);

  newStoreState.loadRegistrations = false;

  return newStoreState;
}

