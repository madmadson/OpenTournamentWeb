import * as _ from 'lodash';

import {Registration} from '../../../../shared/model/registration';
import {
  ADD_ALL_MY_REGISTRATIONS_ACTION, ADD_MY_REGISTRATION_ACTION, CHANGE_MY_REGISTRATION_ACTION,
  CLEAR_ALL_MY_REGISTRATIONS_ACTION, LOAD_MY_REGISTRATIONS_FINISHED_ACTION, REMOVE_MY_REGISTRATION_ACTION
} from "./my-registrations-actions";

export interface MyRegistrationsState {
  myRegistrations: Registration[];

  loadMyRegistrations: boolean;

  filter: string;
  searchField: string;
}

const initialState: MyRegistrationsState = {

  myRegistrations: [],
  loadMyRegistrations: true,
  filter: 'UPCOMING',
  searchField: ''
};

export function myRegistrationsReducer(state: MyRegistrationsState = initialState, action): MyRegistrationsState {

  switch (action.type) {

    case ADD_ALL_MY_REGISTRATIONS_ACTION:
      return addAllMyRegistrations(state, action);

    case CLEAR_ALL_MY_REGISTRATIONS_ACTION:
      return handleMyRegistrationClearData(state);

    case ADD_MY_REGISTRATION_ACTION:
      return handleMyRegistrationAddedData(state, action);

    case CHANGE_MY_REGISTRATION_ACTION:
      return handleMyRegistrationChangedData(state, action);

    case REMOVE_MY_REGISTRATION_ACTION:
      return handleMyRegistrationDeletedData(state, action);

    case LOAD_MY_REGISTRATIONS_FINISHED_ACTION:
      return handleLoadFinishedMyRegistrations(state);


    default:
      return state;

  }
}

function addAllMyRegistrations(state: MyRegistrationsState, action): MyRegistrationsState {
  const newStoreState: MyRegistrationsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.myRegistrations = action.payload;
  }
  return newStoreState;
}


function handleMyRegistrationClearData(state: MyRegistrationsState): MyRegistrationsState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.myRegistrations = [];

  return newStoreState;
}

function handleMyRegistrationAddedData(state: MyRegistrationsState, action): MyRegistrationsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.myRegistrations.push(action.payload);
  }
  return newStoreState;
}

function handleMyRegistrationChangedData(state: MyRegistrationsState, action): MyRegistrationsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.myRegistrations, ['id', action.payload.id]);
    newStoreState.myRegistrations[indexOfSearchedRegistration] = action.payload;
  }
  return newStoreState;
}

function handleMyRegistrationDeletedData(state: MyRegistrationsState, action): MyRegistrationsState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.myRegistrations, ['id', action.payload]);
    newStoreState.myRegistrations.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}

function handleLoadFinishedMyRegistrations(state: MyRegistrationsState): MyRegistrationsState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.loadMyRegistrations = false;

  return newStoreState;
}


