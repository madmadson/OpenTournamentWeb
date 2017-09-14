import {
  ADD_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  CHANGE_SEARCH_FIELD_TEAM_GAMES_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION,
  LOAD_TOURNAMENT_TEAM_GAMES_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  SHOW_ONLY_MY_TEAM_GAME_ACTION
} from './tournament-actions';


import * as _ from 'lodash';
import {TournamentGame} from '../../../../shared/model/tournament-game';


export interface ActualTournamentTeamGamesState {

  teamGames: TournamentGame[];
  loadTeamGames: boolean;

  teamGamesSearch: string;
  onlyMyGameFilter: boolean;
}

const initialState = {

  teamGames: [],
  loadTeamGames: true,

  teamGamesSearch: '',
  onlyMyGameFilter: false
};


export function actualTournamentTeamGamesReducer(state = initialState, action): ActualTournamentTeamGamesState {

  switch (action.type) {


    // TeamGames
    case ADD_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION:
      return handleAddTournamentTeamGameAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION:
      return handleChangeTournamentTeamGameAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION:
      return handleRemoveTournamentTeamGameAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION:
      return handleClearTournamentTeamGameAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION:
      return handleAddAllTournamentTeamGameAction(state, action);
    case LOAD_TOURNAMENT_TEAM_GAMES_FINISHED_ACTION:
      return handleLoadTournamentTeamGamesFinishedAction(state);

    case CHANGE_SEARCH_FIELD_TEAM_GAMES_ACTION:
      return handleSearchFieldTournamentTeamGamesAction(state, action);

    case SHOW_ONLY_MY_TEAM_GAME_ACTION:
      return handleShowOnlyMyGameAction(state, action);

    default:
      return state;
  }
}


// Games

function handleAddTournamentTeamGameAction(state: ActualTournamentTeamGamesState, action): ActualTournamentTeamGamesState {

  const newTournamentData: ActualTournamentTeamGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.teamGames.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentTeamGameAction(state: ActualTournamentTeamGamesState, action): ActualTournamentTeamGamesState {
  const newStoreState: ActualTournamentTeamGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.teamGames, ['id', action.payload.id]);

    newStoreState.teamGames[indexOfSearchedGame] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentTeamGameAction(state: ActualTournamentTeamGamesState, action): ActualTournamentTeamGamesState {
  const newStoreState: ActualTournamentTeamGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.teamGames, ['id', action.payload]);
    newStoreState.teamGames.splice(indexOfSearchedGame, 1);
  }
  return newStoreState;
}


function handleClearTournamentTeamGameAction(state: ActualTournamentTeamGamesState): ActualTournamentTeamGamesState {

  const newTournamentData: ActualTournamentTeamGamesState = _.cloneDeep(state);

  newTournamentData.teamGames = [];

  return newTournamentData;
}

function handleAddAllTournamentTeamGameAction(state: ActualTournamentTeamGamesState, action): ActualTournamentTeamGamesState {

  const newStoreState: ActualTournamentTeamGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.teamGames = action.payload;

  }
  return newStoreState;
}

function handleLoadTournamentTeamGamesFinishedAction(state: ActualTournamentTeamGamesState): ActualTournamentTeamGamesState {

  const newStoreState: ActualTournamentTeamGamesState = _.cloneDeep(state);

  newStoreState.loadTeamGames = false;

  return newStoreState;
}

function handleSearchFieldTournamentTeamGamesAction(state: ActualTournamentTeamGamesState, action): ActualTournamentTeamGamesState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    console.log('new action: ' + action.payload);
    newStoreState.teamGamesSearch = action.payload;
  }
  return newStoreState;
}


function handleShowOnlyMyGameAction(state: ActualTournamentTeamGamesState, action): ActualTournamentTeamGamesState {

  const newStoreState: ActualTournamentTeamGamesState = _.cloneDeep(state);

  newStoreState.onlyMyGameFilter = action.payload;

  return newStoreState;
}
