import {Action} from '@ngrx/store';
import {

  CLEAR_TOURNAMENT_PLAYER_ACTION,
  TOURNAMENT_PLAYER_ADDED, TOURNAMENT_PLAYER_CHANGED, TOURNAMENT_PLAYER_DELETED,

} from '../actions/tournament-actions';

import * as _ from 'lodash';

import {TournamentPlayer} from '../../../../shared/model/tournament-player';

export interface ActualTournamentPlayersStoreData {
  actualTournamentPlayers: TournamentPlayer[];
}

const INITIAL_STATE: ActualTournamentPlayersStoreData = {

  actualTournamentPlayers: []
};


export function TournamentPlayerReducer(
  state: ActualTournamentPlayersStoreData = INITIAL_STATE, action: Action): ActualTournamentPlayersStoreData {


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


function handleTournamentPlayerAddedAction(
  state: ActualTournamentPlayersStoreData, action: Action): ActualTournamentPlayersStoreData {


  const newTournamentData: ActualTournamentPlayersStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentPlayers === undefined) {
      newTournamentData.actualTournamentPlayers = [];
    }
    newTournamentData.actualTournamentPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleTournamentPlayerDeletedAction(
  state: ActualTournamentPlayersStoreData, action: Action): ActualTournamentPlayersStoreData {
  const newStoreState: ActualTournamentPlayersStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload]);
    newStoreState.actualTournamentPlayers.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}


function handleTournamentPlayerChangedData(
  state: ActualTournamentPlayersStoreData, action: Action): ActualTournamentPlayersStoreData {
  const newStoreState: ActualTournamentPlayersStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload.id]);

    newStoreState.actualTournamentPlayers[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handleClearTournamentPlayerAction(
  state: ActualTournamentPlayersStoreData, action: Action): ActualTournamentPlayersStoreData {

  const newTournamentData: ActualTournamentPlayersStoreData = _.cloneDeep(state);

  newTournamentData.actualTournamentPlayers = [];

  return newTournamentData;
}

