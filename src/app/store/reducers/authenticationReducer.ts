import {Action} from '@ngrx/store';
import {
  ADD_REDIRECT_LOGIN_ACTION, DELETE_USER_PLAYER_DATA_ACTION, LOGOUT_ACTION,
  SAVE_USER_PLAYER_DATA_ACTION,
  SAVE_USERDATA_ACTION
} from '../actions/auth-actions';

import * as _ from 'lodash';

import {Player} from '../../../../shared/model/player';
import {UserData} from '../../../../shared/model/userData';

export interface AuthenticationStoreData {
  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  currentUserEmail: string;
  loggedIn: boolean;
  redirectUrl: string;

  userData:  UserData;
  userPlayerData: Player;
}

 const INITIAL_STATE: AuthenticationStoreData = {

  currentUserId: undefined,
  currentUserName: undefined,
  currentUserImage: undefined,
  currentUserEmail: undefined,
  loggedIn: false,
  redirectUrl: undefined,

  userData:  undefined,
  userPlayerData: undefined
};

export function AuthenticationReducer(state: AuthenticationStoreData = INITIAL_STATE, action: Action): AuthenticationStoreData {

  switch (action.type) {

    case SAVE_USERDATA_ACTION:

      return handleSaveUserData(state, action);

    case LOGOUT_ACTION:

      return handleLogout(state, action);

    case ADD_REDIRECT_LOGIN_ACTION:

      return handleAddRedirectLoginAction(state, action);

    case SAVE_USER_PLAYER_DATA_ACTION:

      return handleSaveUserPlayerData(state, action);

    case DELETE_USER_PLAYER_DATA_ACTION:

      return handleDeleteUserPlayerData(state, action);

    default:
      return state;

  }
}

function handleSaveUserData(state: AuthenticationStoreData, action: Action): AuthenticationStoreData {
  const newState = Object.assign({}, state);

  newState.currentUserName = action.payload.displayName;
  newState.currentUserImage = action.payload.photoURL;
  newState.currentUserId = action.payload.uid;
  newState.currentUserEmail = action.payload.email;
  newState.loggedIn = true;

  return newState;
}


function handleLogout(state: AuthenticationStoreData, action: Action): AuthenticationStoreData{

  const newState = Object.assign({}, state);

  newState.currentUserName = undefined;
  newState.currentUserId = undefined;
  newState.currentUserImage = undefined;
  newState.currentUserEmail = undefined;

  newState.redirectUrl = undefined;
  newState.loggedIn = false;

  newState.userPlayerData = undefined;

  return newState;
}

function handleAddRedirectLoginAction(state: AuthenticationStoreData, action: Action): AuthenticationStoreData{

  const newState = Object.assign({}, state);

  newState.redirectUrl = action.payload;

  return newState;
}

function handleSaveUserPlayerData(state: AuthenticationStoreData, action: Action): AuthenticationStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.userPlayerData = action.payload;

  }
  return newStoreState;
}

function handleDeleteUserPlayerData(state: AuthenticationStoreData, action: Action): AuthenticationStoreData {
  const newStoreState = _.cloneDeep(state);

  newStoreState.userPlayerData = undefined;

  return newStoreState;
}

