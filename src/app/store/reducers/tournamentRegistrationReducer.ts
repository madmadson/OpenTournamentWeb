import {Action} from '@ngrx/store';
import {
  CLEAR_TOURNAMENT_REGISTRATION_ACTION, TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import * as _ from 'lodash';
import {Registration} from '../../../../shared/model/registration';


export interface ActualTournamentRegistrationsStoreData {
  actualTournamentRegisteredPlayers: Registration[];
}

const INITIAL_STATE: ActualTournamentRegistrationsStoreData = {

  actualTournamentRegisteredPlayers: []
};


export function TournamentRegistrationReducer(
  state: ActualTournamentRegistrationsStoreData = INITIAL_STATE,
  action: Action): ActualTournamentRegistrationsStoreData {


  switch (action.type) {


    case TOURNAMENT_REGISTRATION_ADDED:

      return handleTournamentRegistrationAddedAction(state, action);

    case TOURNAMENT_REGISTRATION_DELETED:

      return handleTournamentRegistrationDeletedAction(state, action);

    case TOURNAMENT_REGISTRATION_CHANGED:

      return handleRegistrationChangedData(state, action);

    case CLEAR_TOURNAMENT_REGISTRATION_ACTION:

      return handleClearRegistrationAction(state, action);


    default:
      return state;

  }
}

function handleTournamentRegistrationAddedAction(
  state: ActualTournamentRegistrationsStoreData, action: Action): ActualTournamentRegistrationsStoreData {


  const newTournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentRegisteredPlayers === undefined) {
      newTournamentData.actualTournamentRegisteredPlayers = [];
    }
    newTournamentData.actualTournamentRegisteredPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleTournamentRegistrationDeletedAction(
  state: ActualTournamentRegistrationsStoreData, action: Action): ActualTournamentRegistrationsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload]);
    newStoreState.actualTournamentRegisteredPlayers.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleRegistrationChangedData(
  state: ActualTournamentRegistrationsStoreData, action: Action): ActualTournamentRegistrationsStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload.id]);

    newStoreState.actualTournamentRegisteredPlayers[indexOfSearchedRegistration] = action.payload;
  }
  return newStoreState;
}

function handleClearRegistrationAction(
  state: ActualTournamentRegistrationsStoreData, action: Action): ActualTournamentRegistrationsStoreData {

  const newTournamentData = _.cloneDeep(state);

  newTournamentData.actualTournamentRegisteredPlayers = [];

  return newTournamentData;
}
