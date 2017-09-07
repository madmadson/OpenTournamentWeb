import * as _ from 'lodash';
import {Registration} from '../../../../shared/model/registration';
import {
  MY_GAMES_ADDED_ACTION,
  MY_GAMES_CHANGED_ACTION,
  MY_GAMES_CLEAR_ACTION,
  MY_GAMES_DELETED_ACTION,
  MY_REGISTRATION_ADDED_ACTION,
  MY_REGISTRATION_CHANGED_ACTION,
  MY_REGISTRATION_DELETED_ACTION,
  MY_REGISTRATIONS_CLEAR_ACTION
} from '../actions/my-site-actions';
import {TournamentGame} from '../../../../shared/model/tournament-game';


export interface MySiteState {
  myRegistrations: Registration[];
  myGames: TournamentGame[];
}

const initialState: MySiteState = {

  myRegistrations: [],
  myGames: []
};


export function mySiteReducer(state = initialState, action): MySiteState {


  switch (action.type) {


    case MY_REGISTRATION_ADDED_ACTION:

      return handleMyRegistrationAddedAction(state, action);

    case MY_REGISTRATIONS_CLEAR_ACTION:

      return handleMyRegistrationClearAction(state, action);

    case MY_REGISTRATION_CHANGED_ACTION:

      return handleMyRegistrationChangedData(state, action);

    case MY_REGISTRATION_DELETED_ACTION:

      return handleMyRegistrationDeletedAction(state, action);

    case MY_GAMES_ADDED_ACTION:

      return handleMyGameAddedAction(state, action);

    case MY_GAMES_CLEAR_ACTION:

      return handleMyGameClearAction(state, action);

    case MY_GAMES_CHANGED_ACTION:

      return handleMyGameChangedData(state, action);

    case MY_GAMES_DELETED_ACTION:

      return handleMyGameDeletedAction(state, action);


    default:
      return state;

  }
}

function handleMyRegistrationAddedAction(
  state: MySiteState, action): MySiteState {


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
  state: MySiteState, action): MySiteState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.myRegistrations, ['id', action.payload]);
    newStoreState.myRegistrations.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleMyRegistrationChangedData(
  state: MySiteState, action): MySiteState {
  const mySiteStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(mySiteStoreData.myRegistrations, ['id', action.payload.id]);

    mySiteStoreData.myRegistrations[indexOfSearchedRegistration] = action.payload;
  }
  return mySiteStoreData;
}

function handleMyRegistrationClearAction(
  state: MySiteState, action): MySiteState {

  const mySiteStoreData = _.cloneDeep(state);

  mySiteStoreData.myRegistrations = [];

  return mySiteStoreData;
}


function handleMyGameAddedAction(
  state: MySiteState, action): MySiteState {


  const newMySiteStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newMySiteStoreData.myGames === undefined) {
      newMySiteStoreData.myGames = [];
    }
    newMySiteStoreData.myGames.push(action.payload);
  }
  return newMySiteStoreData;
}

function handleMyGameDeletedAction(
  state: MySiteState, action): MySiteState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.myGames, ['id', action.payload]);
    newStoreState.myGames.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleMyGameChangedData(
  state: MySiteState, action): MySiteState {
  const mySiteStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(mySiteStoreData.myGames, ['id', action.payload.id]);

    mySiteStoreData.myGames[indexOfSearched] = action.payload;
  }
  return mySiteStoreData;
}

function handleMyGameClearAction(
  state: MySiteState, action): MySiteState {

  const mySiteStoreData = _.cloneDeep(state);

  mySiteStoreData.myGames = [];

  return mySiteStoreData;
}
