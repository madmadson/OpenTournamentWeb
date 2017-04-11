import {Action} from '@ngrx/store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from '../tournament-data';
import {
  CLEAR_TOURNAMENT_PLAYER_ACTION,
  CLEAR_TOURNAMENT_REGISTRATION_ACTION, TOURNAMENT_PLAYER_ADDED, TOURNAMENT_PLAYER_CHANGED, TOURNAMENT_PLAYER_DELETED,
  TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import * as _ from 'lodash';


export function tournamentData(state: TournamentData = INITIAL_TOURNAMENT_DATA, action: Action): TournamentData {


  switch (action.type) {

    case TOURNAMENT_REGISTRATION_ADDED:

      return handleTournamentRegistrationAddedAction(state, action);

    case TOURNAMENT_REGISTRATION_DELETED:

      return handleTournamentRegistrationDeletedAction(state, action);

    case TOURNAMENT_REGISTRATION_CHANGED:

      return handleRegistrationChangedData(state, action);

    case CLEAR_TOURNAMENT_REGISTRATION_ACTION:

      return handleClearRegistrationAction(state, action);

    case TOURNAMENT_PLAYER_ADDED:

      return handleTournamentPlayerAddedAction(state, action);

    case TOURNAMENT_PLAYER_DELETED:

      return handleTournamentPlayerDeletedAction(state, action);

    case TOURNAMENT_PLAYER_CHANGED:

      return handleTournamentPlayerChangedData(state, action);

    case CLEAR_TOURNAMENT_PLAYER_ACTION:

      return handleClearTournamentPlayerAction(state, action);

    default:
      return state;

  }
}


function handleTournamentRegistrationAddedAction(state: TournamentData, action: Action): TournamentData {


  const newTournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentRegisteredPlayers === undefined) {
      newTournamentData.actualTournamentRegisteredPlayers = [];
    }
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

function handleClearRegistrationAction(state: TournamentData, action: Action): TournamentData {

  const newTournamentData = _.cloneDeep(state);

  newTournamentData.actualTournamentRegisteredPlayers = [];

  return newTournamentData;
}

function handleTournamentPlayerAddedAction(state: TournamentData, action: Action): TournamentData {


  const newTournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentPlayers === undefined) {
      newTournamentData.actualTournamentPlayers = [];
    }
    newTournamentData.actualTournamentPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleTournamentPlayerDeletedAction(state: TournamentData, action: Action): TournamentData {
  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload]);
    newStoreState.actualTournamentPlayers.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}


function handleTournamentPlayerChangedData(state: TournamentData, action: Action): TournamentData {
  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload.id]);

    newStoreState.actualTournamentPlayers[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handleClearTournamentPlayerAction(state: TournamentData, action: Action): TournamentData {

  const newTournamentData = _.cloneDeep(state);

  newTournamentData.actualTournamentPlayers = [];

  return newTournamentData;
}
