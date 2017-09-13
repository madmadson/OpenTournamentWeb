import {
  ADD_ACTUAL_TOURNAMENT_GAME_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION,
  CHANGE_SCENARIO_ACTION,
  CHANGE_SEARCH_FIELD_GAMES_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION,
  LOAD_TOURNAMENT_GAMES_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION,
  SHOW_ONLY_MY_GAME_ACTION
} from './tournament-actions';


import * as _ from 'lodash';
import {TournamentGame} from '../../../../shared/model/tournament-game';


export interface ActualTournamentGamesState {

  games: TournamentGame[];
  loadGames: boolean;

  scenario: string;
  gamesSearch: string;
  onlyMyGameFilter: boolean;
}

const initialState = {

  games: [],
  loadGames: true,

  scenario: '',
  gamesSearch: '',
  onlyMyGameFilter: false
};


export function actualTournamentGamesReducer(state = initialState, action): ActualTournamentGamesState {

  switch (action.type) {


    // Games
    case ADD_ACTUAL_TOURNAMENT_GAME_ACTION:
      return handleAddTournamentGameAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION:
      return handleChangeTournamentGameAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION:
      return handleRemoveTournamentGameAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION:
      return handleClearTournamentGameAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION:
      return handleAddAllTournamentGameAction(state, action);
    case LOAD_TOURNAMENT_GAMES_FINISHED_ACTION:
      return handleLoadTournamentGamesFinishedAction(state);

    case CHANGE_SEARCH_FIELD_GAMES_ACTION:
      return handleSearchFieldTournamentGamesAction(state, action);
    case CHANGE_SCENARIO_ACTION:
      return handleSetScenarioAction(state, action);
    case SHOW_ONLY_MY_GAME_ACTION:
      return handleShowOnlyMyGameAction(state, action);

    default:
      return state;
  }
}


// Games

function handleAddTournamentGameAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {

  const newTournamentData: ActualTournamentGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.games.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentGameAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {
  const newStoreState: ActualTournamentGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.games, ['id', action.payload.id]);

    newStoreState.games[indexOfSearchedGame] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentGameAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {
  const newStoreState: ActualTournamentGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.games, ['id', action.payload]);
    newStoreState.games.splice(indexOfSearchedGame, 1);
  }
  return newStoreState;
}


function handleClearTournamentGameAction(state: ActualTournamentGamesState): ActualTournamentGamesState {

  const newTournamentData: ActualTournamentGamesState = _.cloneDeep(state);

  newTournamentData.games = [];

  return newTournamentData;
}

function handleAddAllTournamentGameAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {

  const newStoreState: ActualTournamentGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.games = action.payload;

  }
  return newStoreState;
}

function handleLoadTournamentGamesFinishedAction(state: ActualTournamentGamesState): ActualTournamentGamesState {

  const newStoreState: ActualTournamentGamesState = _.cloneDeep(state);

  newStoreState.loadGames = false;

  return newStoreState;
}

function handleSearchFieldTournamentGamesAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    console.log('new action: ' + action.payload);
    newStoreState.gamesSearch = action.payload;
  }
  return newStoreState;
}

function handleSetScenarioAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {

  const newStoreState: ActualTournamentGamesState = _.cloneDeep(state);

  newStoreState.scenario = action.payload;

  return newStoreState;
}

function handleShowOnlyMyGameAction(state: ActualTournamentGamesState, action): ActualTournamentGamesState {

  const newStoreState: ActualTournamentGamesState = _.cloneDeep(state);

  newStoreState.onlyMyGameFilter = action.payload;

  return newStoreState;
}
