import {Action} from '@ngrx/store';

import * as _ from 'lodash';

import {TournamentGame} from '../../../../shared/model/tournament-game';
import {
  TOURNAMENT_GAME_ADDED_ACTION, TOURNAMENT_GAME_CHANGED_ACTION,
  TOURNAMENT_GAME_DELETED_ACTION, TOURNAMENT_GAMES_CLEAR_ACTION
} from '../actions/tournament-games-actions';


export interface ActualTournamentGamesStoreData {
  actualTournamentGames: TournamentGame[];
}

const INITIAL_STATE: ActualTournamentGamesStoreData = {

  actualTournamentGames: []
};


export function TournamentGameReducer(
  state: ActualTournamentGamesStoreData = INITIAL_STATE, action: Action): ActualTournamentGamesStoreData {


  switch (action.type) {

    case TOURNAMENT_GAMES_CLEAR_ACTION:

      return handleTournamentGameClearAction(state, action);

    case TOURNAMENT_GAME_ADDED_ACTION:

      return handleTournamentGameAddedAction(state, action);

    case TOURNAMENT_GAME_DELETED_ACTION:

      return handleTournamentGameDeletedAction(state, action);

    case TOURNAMENT_GAME_CHANGED_ACTION:

      return handleTournamentGameChangedData(state, action);



    default:
      return state;

  }
}

function handleTournamentGameClearAction(
  state: ActualTournamentGamesStoreData, action: Action): ActualTournamentGamesStoreData {

  const gamesStoreData: ActualTournamentGamesStoreData = _.cloneDeep(state);

  gamesStoreData.actualTournamentGames = [];

  return gamesStoreData;
}



function handleTournamentGameAddedAction(
  state: ActualTournamentGamesStoreData, action: Action): ActualTournamentGamesStoreData {


  const newTournamentData: ActualTournamentGamesStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentGames === undefined) {
      newTournamentData.actualTournamentGames = [];
    }
    newTournamentData.actualTournamentGames.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentGameDeletedAction(
  state: ActualTournamentGamesStoreData, action: Action): ActualTournamentGamesStoreData {
  const newStoreState: ActualTournamentGamesStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.actualTournamentGames, ['id', action.payload]);
    newStoreState.actualTournamentGames.splice(indexOfSearchedGame, 1);
  }
  return newStoreState;
}


function handleTournamentGameChangedData(
  state: ActualTournamentGamesStoreData, action: Action): ActualTournamentGamesStoreData {
  const newStoreState: ActualTournamentGamesStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.actualTournamentGames, ['id', action.payload.id]);

    newStoreState.actualTournamentGames[indexOfSearchedGame] = action.payload;
  }
  return newStoreState;
}
