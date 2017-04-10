import {INITIAL_UI_STATE, AuthenticationState} from '../authentication-state';
import {Action} from '@ngrx/store';
import {
  ADD_REDIRECT_LOGIN_ACTION, DELETE_USER_PLAYER_DATA_ACTION, LOGOUT_ACTION,
  SAVE_USER_PLAYER_DATA_ACTION,
  SAVE_USERDATA_ACTION
} from '../actions/auth-actions';

import * as _ from 'lodash';

export function authenticationState(state: AuthenticationState = INITIAL_UI_STATE, action: Action): AuthenticationState {

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

function handleSaveUserData(state: AuthenticationState, action: Action): AuthenticationState {
  const newState = Object.assign({}, state);

  newState.currentUserName = action.payload.displayName;
  newState.currentUserImage = action.payload.photoURL;
  newState.currentUserId = action.payload.uid;
  newState.loggedIn = true;

  return newState;
}


function handleLogout(state: AuthenticationState, action: Action) {

  const newState = Object.assign({}, state);

  newState.currentUserName = undefined;
  newState.currentUserId = undefined;
  newState.currentUserImage = undefined;
  newState.loggedIn = false;
  newState.redirectUrl = undefined;

  newState.userPlayerData = undefined;

  return newState;
}

function handleAddRedirectLoginAction(state: AuthenticationState, action: Action) {

  const newState = Object.assign({}, state);

  newState.redirectUrl = action.payload;

  return newState;
}

function handleSaveUserPlayerData(state: AuthenticationState, action: Action): AuthenticationState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.userPlayerData = action.payload;

  }
  return newStoreState;
}

function handleDeleteUserPlayerData(state: AuthenticationState, action: Action): AuthenticationState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.userPlayerData = undefined;

  return newStoreState;
}

