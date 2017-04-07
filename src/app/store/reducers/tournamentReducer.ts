


import {Action} from '@ngrx/store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from '../tournament-data';
import {
  TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import * as _ from 'lodash';


export function tournamentData(state: TournamentData = INITIAL_TOURNAMENT_DATA, action: Action): TournamentData {


  switch (action.type)  {

    case TOURNAMENT_REGISTRATION_ADDED:

      return handleTournamentRegistrationAddedAction(state, action);

    case TOURNAMENT_REGISTRATION_DELETED:

      return handleTournamentRegistrationDeletedAction(state, action);

    case TOURNAMENT_REGISTRATION_CHANGED:

      return handleRegistrationChangedData(state, action);

    default:
      return state;

  }
}


function handleTournamentRegistrationAddedAction(state: TournamentData, action: Action): TournamentData {


  const newTournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.actualTournamentRegisteredPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleTournamentRegistrationDeletedAction(state: TournamentData, action: Action): TournamentData {
  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload]);
    newStoreState.actualTournamentRegisteredPlayers.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleRegistrationChangedData(state: TournamentData, action: Action): TournamentData {
  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    console.log('new reducer!' + JSON.stringify(action.payload));
    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload.id]);
    console.log('index!' + indexOfSearchedRegistration);
    newStoreState.actualTournamentRegisteredPlayers[indexOfSearchedRegistration] = action.payload;
  }
  return newStoreState;
}
