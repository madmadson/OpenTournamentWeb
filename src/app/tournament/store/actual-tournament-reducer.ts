import {SET_ACTUAL_TOURNAMENT_ACTION, UNSET_ACTUAL_TOURNAMENT_ACTION} from './tournament-actions';
import {Tournament} from '../../../../shared/model/tournament';

import * as _ from 'lodash';

export interface ActualTournamentState {
  actualTournament: Tournament;
}

const initialState = {

  actualTournament: undefined,
};

export function actualTournamentReducer(state = initialState, action): ActualTournamentState {

  switch (action.type) {

    case SET_ACTUAL_TOURNAMENT_ACTION:
      return handleSetTournamentAction(state, action);
    case UNSET_ACTUAL_TOURNAMENT_ACTION:
      return handleUnsetTournamentAction(state);

    default:
      return state;
  }
}

// Tournament itself

function handleSetTournamentAction(state, action): ActualTournamentState {
  const newState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    console.log('new Tournament: ' + JSON.stringify(action.payload));

    newState.actualTournament = action.payload;
  }
  return newState;
}

function handleUnsetTournamentAction(state): ActualTournamentState {
  const newState: ActualTournamentState = _.cloneDeep(state);

  newState.actualTournament = undefined;

  return newState;
}
