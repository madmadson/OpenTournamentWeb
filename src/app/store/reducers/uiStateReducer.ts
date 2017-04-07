import {INITIAL_UI_STATE, UiState} from '../ui-state';
import {Action} from '@ngrx/store';
import {
  ADD_REDIRECT_LOGIN_ACTION, LOGOUT_ACTION,
  STORE_USERDATA_ACTION
} from '../actions/auth-actions';


export function uiState(state: UiState = INITIAL_UI_STATE, action: Action) : UiState {

  switch (action.type)  {

    case STORE_USERDATA_ACTION:

      return handleStoreUserData(state, action);


    case LOGOUT_ACTION:

      return handleLogout(state, action);

    case ADD_REDIRECT_LOGIN_ACTION:

      return handleAddRedirectLoginAction(state, action);

    default:
      return state;

  }
}

function handleStoreUserData(state: UiState, action: Action): UiState {
  const newState = Object.assign({}, state);

  newState.currentUserName = action.payload.displayName;
  newState.currentUserImage = action.payload.photoURL;
  newState.currentUserId = action.payload.uid;
  newState.loggedIn = true;

  return newState;
}



function handleLogout(state: UiState, action: Action) {

  const newState = Object.assign({}, state);

  newState.currentUserName = undefined;
  newState.currentUserId = undefined;
  newState.currentUserImage = undefined;
  newState.loggedIn = false;
  newState.redirectUrl = undefined;

  return newState;
}

function handleAddRedirectLoginAction(state: UiState, action: Action) {

  const newState = Object.assign({}, state);

  console.log('redirect action: ' + JSON.stringify(action.payload));

  newState.redirectUrl = action.payload;

  return newState;
}
