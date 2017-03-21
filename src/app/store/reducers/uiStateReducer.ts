import {UiState, INITIAL_UI_STATE} from "../ui-state";
import {Action} from "@ngrx/store";
import {STORE_USERDATA_ACTION, DELETE_USERDATA_ACTION} from "../actions";


export function uiState(state: UiState = INITIAL_UI_STATE, action: Action) : UiState {

  switch (action.type)  {


    case STORE_USERDATA_ACTION:

      return handleAddUserData(state,action);

    case DELETE_USERDATA_ACTION:

      return handleDeleteUserData(state,action);

    default:
      return state;

  }
}

function handleAddUserData(state:UiState, action: Action): UiState {
  const newState = Object.assign({}, state);

  newState.currentUserName = action.payload.displayName;
  newState.currentUserId = action.payload.uid;

  return newState;
}

function handleDeleteUserData(state:UiState, action: Action): UiState {
  const newState = Object.assign({}, state);

  newState.currentUserName = undefined;
  newState.currentUserId = undefined;

  return newState;
}







