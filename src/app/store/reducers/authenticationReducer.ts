import {Action} from '@ngrx/store';
import {
  ADD_REDIRECT_LOGIN_ACTION, DELETE_USER_PLAYER_DATA_ACTION, LOGOUT_ACTION,
  SAVE_USER_PLAYER_DATA_ACTION,
  SAVE_USERDATA_ACTION
} from '../actions/auth-actions';

import * as _ from 'lodash';
import {GlobalData, INITIAL_GLOBAL_DATA} from '../global-store-data';

export function AuthenticationReducer(state: GlobalData = INITIAL_GLOBAL_DATA, action: Action): GlobalData {

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

function handleSaveUserData(state: GlobalData, action: Action): GlobalData {
  const newState = Object.assign({}, state);

  newState.currentUserName = action.payload.displayName;
  newState.currentUserImage = action.payload.photoURL;
  newState.currentUserId = action.payload.uid;
  newState.currentUserEmail = action.payload.email;
  newState.loggedIn = true;

  return newState;
}


function handleLogout(state: GlobalData, action: Action): GlobalData{

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

function handleAddRedirectLoginAction(state: GlobalData, action: Action): GlobalData{

  const newState = Object.assign({}, state);

  newState.redirectUrl = action.payload;

  return newState;
}

function handleSaveUserPlayerData(state: GlobalData, action: Action): GlobalData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.userPlayerData = action.payload;

  }
  return newStoreState;
}

function handleDeleteUserPlayerData(state: GlobalData, action: Action): GlobalData {
  const newStoreState = _.cloneDeep(state);

  newStoreState.userPlayerData = undefined;

  return newStoreState;
}

