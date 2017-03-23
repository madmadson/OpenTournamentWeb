import {UiState, INITIAL_UI_STATE} from "../ui-state";
import {Action} from "@ngrx/store";
import {STORE_USERDATA_ACTION, LOGOUT_ACTION} from "../actions";


export function uiState(state: UiState = INITIAL_UI_STATE, action: Action) : UiState {

  switch (action.type)  {

    case STORE_USERDATA_ACTION:

      return handleStoreData(state,action);


    case LOGOUT_ACTION:

      return handleLogout(state,action);

    default:
      return state;

  }
}

function handleStoreData(state:UiState, action: Action): UiState {
  const newState = Object.assign({}, state);


  console.log("login action: " + JSON.stringify(action.payload));

  if(action.payload.displayName !== null){
    newState.currentUserName = action.payload.displayName;
  }else{
    newState.currentUserName = "Anonymous";
  }
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

  return newState;
}
