import {Action} from '@ngrx/store';

import * as _ from 'lodash';

import {TournamentGame} from '../../../../shared/model/tournament-game';


import {
  TOURNAMENT_TEAM_GAME_ADDED_ACTION,
  TOURNAMENT_TEAM_GAME_CHANGED_ACTION,
  TOURNAMENT_TEAM_GAME_DELETED_ACTION,
  TOURNAMENT_TEAM_GAMES_CLEAR_ACTION
} from '../actions/tournament-team-games-actions';


export interface ActualTournamentTeamGamesStoreData {
  actualTournamentTeamGames: TournamentGame[];
}

const INITIAL_STATE: ActualTournamentTeamGamesStoreData = {

  actualTournamentTeamGames: []
};


export function TournamentTeamGameReducer(
  state: ActualTournamentTeamGamesStoreData = INITIAL_STATE, action): ActualTournamentTeamGamesStoreData {


  switch (action.type) {

    case TOURNAMENT_TEAM_GAMES_CLEAR_ACTION:

      return handleTournamentTeamGameClearAction(state, action);

    case TOURNAMENT_TEAM_GAME_ADDED_ACTION:

      return handleTournamentTeamGameAddedAction(state, action);

    case TOURNAMENT_TEAM_GAME_DELETED_ACTION:

      return handleTournamentTeamGameDeletedAction(state, action);

    case TOURNAMENT_TEAM_GAME_CHANGED_ACTION:

      return handleTournamentTeamGameChangedData(state, action);



    default:
      return state;

  }
}

function handleTournamentTeamGameClearAction(
  state: ActualTournamentTeamGamesStoreData, action): ActualTournamentTeamGamesStoreData {

  const gamesStoreData: ActualTournamentTeamGamesStoreData = _.cloneDeep(state);

  gamesStoreData.actualTournamentTeamGames = [];

  return gamesStoreData;
}



function handleTournamentTeamGameAddedAction(
  state: ActualTournamentTeamGamesStoreData, action): ActualTournamentTeamGamesStoreData {


  const newTournamentData: ActualTournamentTeamGamesStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentTeamGames === undefined) {
      newTournamentData.actualTournamentTeamGames = [];
    }
    newTournamentData.actualTournamentTeamGames.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentTeamGameDeletedAction(
  state: ActualTournamentTeamGamesStoreData, action): ActualTournamentTeamGamesStoreData {
  const newStoreState: ActualTournamentTeamGamesStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamGame = _.findIndex(newStoreState.actualTournamentTeamGames, ['id', action.payload]);
    newStoreState.actualTournamentTeamGames.splice(indexOfSearchedTeamGame, 1);
  }
  return newStoreState;
}


function handleTournamentTeamGameChangedData(
  state: ActualTournamentTeamGamesStoreData, action): ActualTournamentTeamGamesStoreData {
  const newStoreState: ActualTournamentTeamGamesStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamGame = _.findIndex(newStoreState.actualTournamentTeamGames, ['id', action.payload.id]);

    newStoreState.actualTournamentTeamGames[indexOfSearchedTeamGame] = action.payload;
  }
  return newStoreState;
}
