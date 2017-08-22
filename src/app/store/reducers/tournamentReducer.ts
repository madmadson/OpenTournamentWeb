import {Action} from '@ngrx/store';


import {SET_ACTUAL_TOURNAMENT_ACTION} from '../actions/tournament-actions';
import {Tournament} from '../../../../shared/model/tournament';

import * as _ from 'lodash';

export interface ActualTournamentStoreData {
  actualTournament: Tournament;
}

const INITIAL_STATE: ActualTournamentStoreData = {

  actualTournament: undefined
};


export function TournamentReducer(state: ActualTournamentStoreData = INITIAL_STATE, action): ActualTournamentStoreData {


  switch (action.type) {


    case SET_ACTUAL_TOURNAMENT_ACTION:

      return handleSetTournament(state, action);


    default:
      return state;

  }
}


function handleSetTournament(state: ActualTournamentStoreData, action): ActualTournamentStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.actualTournament = action.payload;
  }
  return newStoreState;
}

