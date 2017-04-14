import {Action} from '@ngrx/store';

import * as _ from 'lodash';

import {SET_ACTUAL_TOURNAMENT_ACTION} from '../actions/tournament-actions';

export interface ActualTournamentStoreData {
  actualTournament: string;
}

const INITIAL_STATE: ActualTournamentStoreData = {

  actualTournament: undefined
};


export function TournamentReducer(state: ActualTournamentStoreData = INITIAL_STATE, action: Action): ActualTournamentStoreData {


  switch (action.type) {


    case SET_ACTUAL_TOURNAMENT_ACTION:

      return handleSetTournament(state, action);


    default:
      return state;

  }
}


function handleSetTournament(state: ActualTournamentStoreData, action: Action): ActualTournamentStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.actualTournament = action.payload;
  }
  return newStoreState;
}

