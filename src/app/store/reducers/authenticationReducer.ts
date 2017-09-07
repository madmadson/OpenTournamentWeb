import {
  ADD_REDIRECT_LOGIN_ACTION,
  DELETE_USER_PLAYER_DATA_ACTION,
  LOGOUT_ACTION,
  SAVE_USER_PLAYER_DATA_ACTION,
  SAVE_USERDATA_ACTION
} from '../actions/auth-actions';

import * as _ from 'lodash';


import {UserData} from '../../../../shared/model/user-data';
import {Player} from '../../../../shared/model/player';


export interface AuthenticationState {
  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  currentUserEmail: string;
  loggedIn: boolean;
  redirectUrl: string;

  userData:  UserData;
  userPlayerData: Player;
}

const initialState: AuthenticationState = {

  currentUserId: undefined,
  currentUserName: undefined,
  currentUserImage: undefined,
  currentUserEmail: undefined,
  loggedIn: false,
  redirectUrl: undefined,

  userData:  undefined,
  userPlayerData: undefined
};

export function authenticationReducer(state = initialState, action): AuthenticationState {

  switch (action.type) {

    case SAVE_USERDATA_ACTION:

      return handleSaveUserData(state, action);

    case LOGOUT_ACTION:

      return handleLogout(state);

    case ADD_REDIRECT_LOGIN_ACTION:

      return handleAddRedirectLoginAction(state, action);

    case SAVE_USER_PLAYER_DATA_ACTION:

      return handleSaveUserPlayerData(state, action);

    case DELETE_USER_PLAYER_DATA_ACTION:

      return handleDeleteUserPlayerData(state);

    default:
      return state;

  }
}

function handleSaveUserData(state: AuthenticationState, action): AuthenticationState {
  const newState = Object.assign({}, state);

  newState.currentUserName = action.payload.displayName;
  newState.currentUserImage = action.payload.photoURL;
  newState.currentUserId = action.payload.uid;
  newState.currentUserEmail = action.payload.email;
  newState.loggedIn = true;

  return newState;
}


function handleLogout(state: AuthenticationState): AuthenticationState{

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

function handleAddRedirectLoginAction(state: AuthenticationState, action): AuthenticationState{

  const newState = Object.assign({}, state);

  newState.redirectUrl = action.payload;

  return newState;
}

function handleSaveUserPlayerData(state: AuthenticationState, action): AuthenticationState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.userPlayerData = action.payload;

  }
  return newStoreState;
}

function handleDeleteUserPlayerData(state: AuthenticationState): AuthenticationState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.userPlayerData = undefined;

  return newStoreState;
}

