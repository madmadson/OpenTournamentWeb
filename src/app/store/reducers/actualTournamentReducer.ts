import {SET_ACTUAL_TOURNAMENT_ACTION} from '../actions/tournament-actions';
import {
  ARMY_LIST_ADDED_ACTION, ARMY_LIST_DELETED_ACTION,
  CLEAR_ARMY_LISTS_ACTION,

} from '../actions/tournament-actions';
import {Tournament} from '../../../../shared/model/tournament';
import {
  TOURNAMENT_GAME_ADDED_ACTION, TOURNAMENT_GAME_CHANGED_ACTION,
  TOURNAMENT_GAME_DELETED_ACTION, TOURNAMENT_GAMES_CLEAR_ACTION
} from '../actions/tournament-games-actions';
import {

  CLEAR_TOURNAMENT_PLAYER_ACTION,
  TOURNAMENT_PLAYER_ADDED, TOURNAMENT_PLAYER_CHANGED, TOURNAMENT_PLAYER_DELETED,

} from '../actions/tournament-actions';
import {
  TOURNAMENT_RANKING_ADDED_ACTION, TOURNAMENT_RANKING_CHANGED_ACTION,
  TOURNAMENT_RANKING_DELETED_ACTION, TOURNAMENT_RANKINGS_CLEAR_ACTION
} from '../actions/tournament-rankings-actions';
import {
  CLEAR_TOURNAMENT_REGISTRATION_ACTION, TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import {
  TOURNAMENT_TEAM_ADDED_ACTION, TOURNAMENT_TEAM_CHANGED_ACTION, TOURNAMENT_TEAM_DELETED_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION, TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION,
  TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION,
  TOURNAMENT_TEAMS_CLEAR_ACTION
} from '../actions/tournament-teams-actions';

import {
  TOURNAMENT_TEAM_GAME_ADDED_ACTION,
  TOURNAMENT_TEAM_GAME_CHANGED_ACTION,
  TOURNAMENT_TEAM_GAME_DELETED_ACTION,
  TOURNAMENT_TEAM_GAMES_CLEAR_ACTION
} from '../actions/tournament-team-games-actions';

import {
  TOURNAMENT_TEAM_RANKING_ADDED_ACTION,
  TOURNAMENT_TEAM_RANKING_CHANGED_ACTION,
  TOURNAMENT_TEAM_RANKING_DELETED_ACTION,
  TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION
} from '../actions/tournament-team-rankings-actions';


import * as _ from 'lodash';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Registration} from '../../../../shared/model/registration';
import {TournamentTeam} from '../../../../shared/model/tournament-team';

export interface ActualTournamentState {
  actualTournament: Tournament;
  actualTournamentArmyLists: ArmyList[];
  actualTournamentPlayers: TournamentPlayer[];
  actualTournamentGames: TournamentGame[];
  actualTournamentRankings: TournamentRanking[];
  actualTournamentRegisteredPlayers: Registration[];

  // only for team tournament
  actualTournamentTeams: TournamentTeam[];
  actualTournamentRegisteredTeams: TournamentTeam[];
  actualTournamentTeamGames: TournamentGame[];
  actualTournamentTeamRankings: TournamentRanking[];
}

const initialState = {

  actualTournament: undefined,
  actualTournamentArmyLists: [],
  actualTournamentPlayers: [],
  actualTournamentGames: [],
  actualTournamentRankings: [],
  actualTournamentRegisteredPlayers: [],

  // only for team tournament
  actualTournamentTeams: [],
  actualTournamentRegisteredTeams: [],
  actualTournamentTeamGames: [],
  actualTournamentTeamRankings: []
};

export function actualTournamentReducer(state = initialState, action): ActualTournamentState {

  switch (action.type) {

    case SET_ACTUAL_TOURNAMENT_ACTION:
      return handleSetTournament(state, action);

    case ARMY_LIST_ADDED_ACTION:
      return handleArmyListAddedAction(state, action);

    case ARMY_LIST_DELETED_ACTION:
      return handleArmyListDeletedAction(state, action);

    case CLEAR_ARMY_LISTS_ACTION:
      return handleClearArmyListsAction(state);

    case TOURNAMENT_GAMES_CLEAR_ACTION:
      return handleTournamentGameClearAction(state);

    case TOURNAMENT_GAME_ADDED_ACTION:
      return handleTournamentGameAddedAction(state, action);

    case TOURNAMENT_GAME_DELETED_ACTION:
      return handleTournamentGameDeletedAction(state, action);

    case TOURNAMENT_GAME_CHANGED_ACTION:
      return handleTournamentGameChangedData(state, action);

    case TOURNAMENT_PLAYER_ADDED:
      return handleTournamentPlayerAddedAction(state, action);

    case TOURNAMENT_PLAYER_DELETED:
      return handleTournamentPlayerDeletedAction(state, action);

    case TOURNAMENT_PLAYER_CHANGED:
      return handleTournamentPlayerChangedData(state, action);

    case CLEAR_TOURNAMENT_PLAYER_ACTION:
      return handleClearTournamentPlayerAction(state);

    case TOURNAMENT_RANKINGS_CLEAR_ACTION:
      return handleTournamentRankingClearAction(state);

    case TOURNAMENT_RANKING_ADDED_ACTION:
      return handleTournamentRankingAddedAction(state, action);

    case TOURNAMENT_RANKING_DELETED_ACTION:
      return handleTournamentRankingDeletedAction(state, action);

    case TOURNAMENT_RANKING_CHANGED_ACTION:
      return handleTournamentRankingChangedData(state, action);

    case TOURNAMENT_REGISTRATION_ADDED:
      return handleTournamentRegistrationAddedAction(state, action);

    case TOURNAMENT_REGISTRATION_DELETED:
      return handleTournamentRegistrationDeletedAction(state, action);

    case TOURNAMENT_REGISTRATION_CHANGED:
      return handleRegistrationChangedData(state, action);

    case CLEAR_TOURNAMENT_REGISTRATION_ACTION:
      return handleClearRegistrationAction(state);

    case TOURNAMENT_TEAMS_CLEAR_ACTION:
      return handleTournamentTeamsClearAction(state);

    case TOURNAMENT_TEAM_ADDED_ACTION:
      return handleTournamentTeamAddedAction(state, action);

    case TOURNAMENT_TEAM_DELETED_ACTION:
      return handleTournamentTeamDeletedAction(state, action);

    case TOURNAMENT_TEAM_CHANGED_ACTION:
      return handleTournamentTeamChangedData(state, action);

    case TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION:
      return handleTournamentTeamRegistrationClearAction(state);

    case TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION:
      return handleTournamentTeamRegistrationAddedAction(state, action);

    case TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION:
      return handleTournamentTeamRegistrationDeletedAction(state, action);

    case TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION:
      return handleTournamentTeamRegistrationChangedData(state, action);

    case TOURNAMENT_TEAM_GAMES_CLEAR_ACTION:
      return handleTournamentTeamGameClearAction(state);

    case TOURNAMENT_TEAM_GAME_ADDED_ACTION:
      return handleTournamentTeamGameAddedAction(state, action);

    case TOURNAMENT_TEAM_GAME_DELETED_ACTION:
      return handleTournamentTeamGameDeletedAction(state, action);

    case TOURNAMENT_TEAM_GAME_CHANGED_ACTION:
      return handleTournamentTeamGameChangedData(state, action);

    case TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION:
      return handleTournamentTeamRankingClearAction(state);

    case TOURNAMENT_TEAM_RANKING_ADDED_ACTION:
      return handleTournamentTeamRankingAddedAction(state, action);

    case TOURNAMENT_TEAM_RANKING_DELETED_ACTION:
      return handleTournamentTeamRankingDeletedAction(state, action);

    case TOURNAMENT_TEAM_RANKING_CHANGED_ACTION:
      return handleTournamentTeamRankingChangedData(state, action);

    default:
      return state;
  }
}

// Tournament itself

function handleSetTournament(state, action): ActualTournamentState {
  const newState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newState.actualTournament = action.payload;
  }
  return newState;
}

// ArmyLists

function handleArmyListAddedAction(
  state, action): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentArmyLists === undefined) {
      newTournamentData.actualTournamentArmyLists = [];
    }
    newTournamentData.actualTournamentArmyLists.push(action.payload);
  }
  return newTournamentData;
}


function handleArmyListDeletedAction(
  state, action): ActualTournamentState {

  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedArmyList = _.findIndex(newStoreState.actualTournamentArmyLists, ['id', action.payload]);
    newStoreState.actualTournamentArmyLists.splice(indexOfSearchedArmyList, 1);
  }
  return newStoreState;
}

function handleClearArmyListsAction(
  state): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  newTournamentData.actualTournamentArmyLists = [];

  return newTournamentData;
}

// GAMES

function handleTournamentGameClearAction(
  state): ActualTournamentState {

  const gamesStoreData: ActualTournamentState = _.cloneDeep(state);

  gamesStoreData.actualTournamentGames = [];

  return gamesStoreData;
}



function handleTournamentGameAddedAction(
  state, action): ActualTournamentState {


  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentGames === undefined) {
      newTournamentData.actualTournamentGames = [];
    }
    newTournamentData.actualTournamentGames.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentGameDeletedAction(
  state, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.actualTournamentGames, ['id', action.payload]);
    newStoreState.actualTournamentGames.splice(indexOfSearchedGame, 1);
  }
  return newStoreState;
}


function handleTournamentGameChangedData(
  state, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.actualTournamentGames, ['id', action.payload.id]);

    newStoreState.actualTournamentGames[indexOfSearchedGame] = action.payload;
  }
  return newStoreState;
}

// TournamentPlayer

function handleTournamentPlayerAddedAction(
  state, action): ActualTournamentState {


  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentPlayers === undefined) {
      newTournamentData.actualTournamentPlayers = [];
    }
    newTournamentData.actualTournamentPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleTournamentPlayerDeletedAction(state, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload]);
    newStoreState.actualTournamentPlayers.splice(indexOfSearchedPlayer, 1);
  }
  return newStoreState;
}


function handleTournamentPlayerChangedData(state, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload.id]);

    newStoreState.actualTournamentPlayers[indexOfSearchedPlayer] = action.payload;
  }
  return newStoreState;
}

function handleClearTournamentPlayerAction(
  state): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  newTournamentData.actualTournamentPlayers = [];

  return newTournamentData;
}

// TournamentRanking

function handleTournamentRankingClearAction(
  state: ActualTournamentState): ActualTournamentState {

  const rankingData: ActualTournamentState = _.cloneDeep(state);

  rankingData.actualTournamentRankings = [];

  return rankingData;
}

function handleTournamentRankingAddedAction(
  state: ActualTournamentState, action): ActualTournamentState {


  const rankingsStoreData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (rankingsStoreData.actualTournamentRankings === undefined) {
      rankingsStoreData.actualTournamentRankings = [];
    }
    rankingsStoreData.actualTournamentRankings.push(action.payload);
  }
  return rankingsStoreData;
}


function handleTournamentRankingDeletedAction(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.actualTournamentRankings, ['id', action.payload]);
    newStoreState.actualTournamentRankings.splice(indexOfSearchedRanking, 1);
  }
  return newStoreState;
}


function handleTournamentRankingChangedData(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.actualTournamentRankings, ['id', action.payload.id]);

    newStoreState.actualTournamentRankings[indexOfSearchedRanking] = action.payload;
  }
  return newStoreState;
}

// TournamentPlayerRegistration

function handleTournamentRegistrationAddedAction(
  state: ActualTournamentState, action): ActualTournamentState {


  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentRegisteredPlayers === undefined) {
      newTournamentData.actualTournamentRegisteredPlayers = [];
    }
    newTournamentData.actualTournamentRegisteredPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleTournamentRegistrationDeletedAction(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload]);
    newStoreState.actualTournamentRegisteredPlayers.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleRegistrationChangedData(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload.id]);

    newStoreState.actualTournamentRegisteredPlayers[indexOfSearchedRegistration] = action.payload;
  }
  return newStoreState;
}

function handleClearRegistrationAction(
  state: ActualTournamentState): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  newTournamentData.actualTournamentRegisteredPlayers = [];

  return newTournamentData;
}

// TournamentTeam

function handleTournamentTeamsClearAction(state: ActualTournamentState): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  newStoreState.actualTournamentTeams = [];

  return newStoreState;
}

function handleTournamentTeamAddedAction(state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.actualTournamentTeams.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentTeamChangedData(state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.actualTournamentTeams, ['id', action.payload.id]);
    newStoreState.actualTournamentTeams[indexOfSearched] = action.payload;
  }
  return newStoreState;
}

function handleTournamentTeamDeletedAction(state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.actualTournamentTeams, ['id', action.payload]);
    newStoreState.actualTournamentTeams.splice(indexOfSearched, 1);
  }
  return newStoreState;
}

// Team Registration

function handleTournamentTeamRegistrationClearAction(state: ActualTournamentState): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  newStoreState.actualTournamentRegisteredTeams = [];

  return newStoreState;
}

function handleTournamentTeamRegistrationAddedAction(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.actualTournamentRegisteredTeams.push(action.payload);
  }
  return newStoreState;
}

function handleTournamentTeamRegistrationChangedData(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.actualTournamentRegisteredTeams, ['id', action.payload.id]);
    newStoreState.actualTournamentRegisteredTeams[indexOfSearched] = action.payload;
  }
  return newStoreState;
}

function handleTournamentTeamRegistrationDeletedAction(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearched = _.findIndex(newStoreState.actualTournamentRegisteredTeams, ['id', action.payload]);
    newStoreState.actualTournamentRegisteredTeams.splice(indexOfSearched, 1);
  }
  return newStoreState;
}

// Team Games

function handleTournamentTeamGameClearAction(
  state: ActualTournamentState): ActualTournamentState {

  const gamesStoreData: ActualTournamentState = _.cloneDeep(state);

  gamesStoreData.actualTournamentTeamGames = [];

  return gamesStoreData;
}



function handleTournamentTeamGameAddedAction(
  state: ActualTournamentState, action): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentTeamGames === undefined) {
      newTournamentData.actualTournamentTeamGames = [];
    }
    newTournamentData.actualTournamentTeamGames.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentTeamGameDeletedAction(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamGame = _.findIndex(newStoreState.actualTournamentTeamGames, ['id', action.payload]);
    newStoreState.actualTournamentTeamGames.splice(indexOfSearchedTeamGame, 1);
  }
  return newStoreState;
}


function handleTournamentTeamGameChangedData(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamGame = _.findIndex(newStoreState.actualTournamentTeamGames, ['id', action.payload.id]);

    newStoreState.actualTournamentTeamGames[indexOfSearchedTeamGame] = action.payload;
  }
  return newStoreState;
}

// TeamRanking

function handleTournamentTeamRankingClearAction(
  state: ActualTournamentState): ActualTournamentState {

  const gamesStoreData: ActualTournamentState = _.cloneDeep(state);

  gamesStoreData.actualTournamentTeamRankings = [];

  return gamesStoreData;
}



function handleTournamentTeamRankingAddedAction(
  state: ActualTournamentState, action): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentTeamRankings === undefined) {
      newTournamentData.actualTournamentTeamRankings = [];
    }
    newTournamentData.actualTournamentTeamRankings.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentTeamRankingDeletedAction(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRanking = _.findIndex(newStoreState.actualTournamentTeamRankings, ['id', action.payload]);
    newStoreState.actualTournamentTeamRankings.splice(indexOfSearchedTeamRanking, 1);
  }
  return newStoreState;
}


function handleTournamentTeamRankingChangedData(
  state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRanking = _.findIndex(newStoreState.actualTournamentTeamRankings, ['id', action.payload.id]);

    newStoreState.actualTournamentTeamRankings[indexOfSearchedTeamRanking] = action.payload;
  }
  return newStoreState;
}

