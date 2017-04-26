import {Action} from '@ngrx/store';

import * as _ from 'lodash';
import {Registration} from '../../../../shared/model/registration';
import {
  MY_REGISTRATION_ADDED_ACTION, MY_REGISTRATION_CHANGED_ACTION, MY_REGISTRATION_DELETED_ACTION,
  MY_REGISTRATIONS_CLEAR_ACTION
} from '../actions/my-site-actions';


export interface MySiteStoreData {
  myRegistrations: Registration[];
}

const INITIAL_STATE: MySiteStoreData = {

  myRegistrations: []
};


export function MySiteReducer(
  state: MySiteStoreData = INITIAL_STATE, action: Action): MySiteStoreData {


  switch (action.type) {


    case MY_REGISTRATION_ADDED_ACTION:

      return handleMyRegistrationAddedAction(state, action);

    case MY_REGISTRATIONS_CLEAR_ACTION:

      return handleMyRegistrationClearAction(state, action);

    case MY_REGISTRATION_CHANGED_ACTION:

      return handleMyRegistrationChangedData(state, action);

    case MY_REGISTRATION_DELETED_ACTION:

      return handleMyRegistrationDeletedAction(state, action);


    default:
      return state;

  }
}

function handleMyRegistrationAddedAction(
  state: MySiteStoreData, action: Action): MySiteStoreData {


  const newMySiteStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newMySiteStoreData.myRegistrations === undefined) {
      newMySiteStoreData.myRegistrations = [];
    }
    newMySiteStoreData.myRegistrations.push(action.payload);
  }
  return newMySiteStoreData;
}

function handleMyRegistrationDeletedAction(
  state: MySiteStoreData, action: Action): MySiteStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.myRegistrations, ['id', action.payload]);
    newStoreState.myRegistrations.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleMyRegistrationChangedData(
  state: MySiteStoreData, action: Action): MySiteStoreData {
  const mySiteStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(mySiteStoreData.myRegistrations, ['id', action.payload.id]);

    mySiteStoreData.myRegistrations[indexOfSearchedRegistration] = action.payload;
  }
  return mySiteStoreData;
}

function handleMyRegistrationClearAction(
  state: MySiteStoreData, action: Action): MySiteStoreData {

  const mySiteStoreData = _.cloneDeep(state);

  mySiteStoreData.myRegistrations = [];

  return mySiteStoreData;
}
