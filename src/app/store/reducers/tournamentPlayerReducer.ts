import {Action} from '@ngrx/store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from '../tournament-data';
import {
  ARMY_LIST_ADDED_ACTION, ARMY_LIST_DELETED_ACTION,
  CLEAR_ARMY_LISTS_ACTION,
  CLEAR_TOURNAMENT_PLAYER_ACTION,
  CLEAR_TOURNAMENT_REGISTRATION_ACTION, TOURNAMENT_PLAYER_ADDED, TOURNAMENT_PLAYER_CHANGED, TOURNAMENT_PLAYER_DELETED,
  TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import * as _ from 'lodash';


export function TournamentPlayerReducer(state: TournamentData = INITIAL_TOURNAMENT_DATA, action: Action): TournamentData {


  switch (action.type) {


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

