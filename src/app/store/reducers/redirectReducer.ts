export interface RedirectUrlState {

  redirectUrl: string;

}

const initialState: RedirectUrlState = {

  redirectUrl: undefined,

};

export const SET_REDIRECT_URL_ACTION = 'SET_REDIRECT_URL_ACTION';

export function redirectUrlReducer(state = initialState, action): RedirectUrlState {

  switch (action.type) {


    case SET_REDIRECT_URL_ACTION:

      return handleAddRedirectLoginAction(state, action);

    default:
      return state;

  }
}


function handleAddRedirectLoginAction(state: RedirectUrlState, action): RedirectUrlState{

  const newState = Object.assign({}, state);

  newState.redirectUrl = action.payload;

  return newState;
}

