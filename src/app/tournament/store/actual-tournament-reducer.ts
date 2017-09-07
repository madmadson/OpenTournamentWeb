import {
  ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION,
  LOAD_REGISTRATIONS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION,
  SET_ACTUAL_TOURNAMENT_ACTION,
  UNSET_ACTUAL_TOURNAMENT_ACTION
} from './tournament-actions';
import {Tournament} from '../../../../shared/model/tournament';


import * as _ from 'lodash';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Registration} from '../../../../shared/model/registration';
import {TournamentTeam} from '../../../../shared/model/tournament-team';

export interface ActualTournamentState {
  actualTournament: Tournament;
  // actualTournamentArmyLists: ArmyList[];
  // actualTournamentPlayers: TournamentPlayer[];
  // games: TournamentGame[];
  // actualTournamentRankings: TournamentRanking[];
  actualTournamentRegisteredPlayers: Registration[];

  // only for team tournament
  actualTournamentTeams: TournamentTeam[];
  actualTournamentRegisteredTeams: TournamentTeam[];
  actualTournamentTeamGames: TournamentGame[];
  actualTournamentTeamRankings: TournamentRanking[];

  loadRegistrations: boolean;
  // loadPlayers: boolean;
  // loadRankings: boolean;
  // loadGames: boolean;

  // playersSearchField: string;
}

const initialState = {

  actualTournament: undefined,
  // actualTournamentArmyLists: [],
  // actualTournamentPlayers: [],
  // actualTournamentGames: [],
  // rankings: [],
  actualTournamentRegisteredPlayers: [],

  // only for team tournament
  actualTournamentTeams: [],
  actualTournamentRegisteredTeams: [],
  actualTournamentTeamGames: [],
  actualTournamentTeamRankings: [],

  loadRegistrations: true,
  // loadPlayers: true,
  // loadRankings: true,
  // loadGames: true,
  //
  // playersSearchField: ''
};


export function actualTournamentReducer(state = initialState, action): ActualTournamentState {

  switch (action.type) {

    case SET_ACTUAL_TOURNAMENT_ACTION:
      return handleSetTournamentAction(state, action);
    case UNSET_ACTUAL_TOURNAMENT_ACTION:
      return handleUnsetTournamentAction(state);

    // Registrations
    case ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION:
      return handleAddTournamentRegistrationAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION:
      return handleChangeTournamentRegistrationAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION:
      return handleRemoveTournamentRegistrationAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION:
      return handleClearTournamentRegistrationAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION:
      return handleAddAllTournamentRegistrationAction(state, action);

    case LOAD_REGISTRATIONS_FINISHED_ACTION:
      return handleLoadRegistrationsFinishedAction(state);

    // TournamentPlayer
    // case ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION:
    //   return handleAddTournamentTournamentPlayerAction(state, action);
    // case CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION:
    //   return handleChangeTournamentTournamentPlayerAction(state, action);
    // case REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION:
    //   return handleRemoveTournamentTournamentPlayerAction(state, action);
    // case CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION:
    //   return handleClearTournamentTournamentPlayerAction(state);
    // case ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION:
    //   return handleAddAllTournamentTournamentPlayerAction(state, action);
    //
    // case LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION:
    //   return handleLoadTournamentPlayersFinishedAction(state);
    //
    // case CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION:
    //   return handleSearchFieldTournamentPlayersAction(state, action);

    // ArmyLists
    // case ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION:
    //   return handleAddTournamentArmyListAction(state, action);
    // case CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION:
    //   return handleChangeTournamentArmyListAction(state, action);
    // case REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION:
    //   return handleRemoveTournamentArmyListAction(state, action);
    // case CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION:
    //   return handleClearTournamentArmyListAction(state);
    // case ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION:
    //   return handleAddAllTournamentArmyListAction(state, action);

    // // Rankings
    // case ADD_ACTUAL_TOURNAMENT_RANKING_ACTION:
    //   return handleAddTournamentRankingAction(state, action);
    // case CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION:
    //   return handleChangeTournamentRankingAction(state, action);
    // case REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION:
    //   return handleRemoveTournamentRankingAction(state, action);
    // case CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION:
    //   return handleClearTournamentRankingAction(state);
    // case ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION:
    //   return handleAddAllTournamentRankingAction(state, action);
    // case LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION:
    //   return handleLoadTournamentRankingsFinishedAction(state);

    // Games
    // case ADD_ACTUAL_TOURNAMENT_GAME_ACTION:
    //   return handleAddTournamentGameAction(state, action);
    // case CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION:
    //   return handleChangeTournamentGameAction(state, action);
    // case REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION:
    //   return handleRemoveTournamentGameAction(state, action);
    // case CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION:
    //   return handleClearTournamentGameAction(state);
    // case ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION:
    //   return handleAddAllTournamentGameAction(state, action);
    // case LOAD_TOURNAMENT_GAMES_FINISHED_ACTION:
    //   return handleLoadTournamentGamesFinishedAction(state);


    // case TOURNAMENT_GAMES_CLEAR_ACTION:
    //   return handleTournamentGameClearAction(state);
    //
    // case TOURNAMENT_GAME_ADDED_ACTION:
    //   return handleTournamentGameAddedAction(state, action);
    //
    // case TOURNAMENT_GAME_DELETED_ACTION:
    //   return handleTournamentGameDeletedAction(state, action);
    //
    // case TOURNAMENT_GAME_CHANGED_ACTION:
    //   return handleTournamentGameChangedData(state, action);
    //
    //
    // case TOURNAMENT_RANKINGS_CLEAR_ACTION:
    //   return handleTournamentRankingClearAction(state);
    //
    // case TOURNAMENT_RANKING_ADDED_ACTION:
    //   return handleTournamentRankingAddedAction(state, action);
    //
    // case TOURNAMENT_RANKING_DELETED_ACTION:
    //   return handleTournamentRankingDeletedAction(state, action);
    //
    // case TOURNAMENT_RANKING_CHANGED_ACTION:
    //   return handleTournamentRankingChangedData(state, action);
    //
    //
    // case TOURNAMENT_TEAMS_CLEAR_ACTION:
    //   return handleTournamentTeamsClearAction(state);
    //
    // case TOURNAMENT_TEAM_ADDED_ACTION:
    //   return handleTournamentTeamAddedAction(state, action);
    //
    // case TOURNAMENT_TEAM_DELETED_ACTION:
    //   return handleTournamentTeamDeletedAction(state, action);
    //
    // case TOURNAMENT_TEAM_CHANGED_ACTION:
    //   return handleTournamentTeamChangedData(state, action);
    //
    // case TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION:
    //   return handleTournamentTeamRegistrationClearAction(state);
    //
    // case TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION:
    //   return handleTournamentTeamRegistrationAddedAction(state, action);
    //
    // case TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION:
    //   return handleTournamentTeamRegistrationDeletedAction(state, action);
    //
    // case TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION:
    //   return handleTournamentTeamRegistrationChangedData(state, action);
    //
    // case TOURNAMENT_TEAM_GAMES_CLEAR_ACTION:
    //   return handleTournamentTeamGameClearAction(state);
    //
    // case TOURNAMENT_TEAM_GAME_ADDED_ACTION:
    //   return handleTournamentTeamGameAddedAction(state, action);
    //
    // case TOURNAMENT_TEAM_GAME_DELETED_ACTION:
    //   return handleTournamentTeamGameDeletedAction(state, action);
    //
    // case TOURNAMENT_TEAM_GAME_CHANGED_ACTION:
    //   return handleTournamentTeamGameChangedData(state, action);
    //
    // case TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION:
    //   return handleTournamentTeamRankingClearAction(state);
    //
    // case TOURNAMENT_TEAM_RANKING_ADDED_ACTION:
    //   return handleTournamentTeamRankingAddedAction(state, action);
    //
    // case TOURNAMENT_TEAM_RANKING_DELETED_ACTION:
    //   return handleTournamentTeamRankingDeletedAction(state, action);
    //
    // case TOURNAMENT_TEAM_RANKING_CHANGED_ACTION:
    //   return handleTournamentTeamRankingChangedData(state, action);

    default:
      return state;
  }
}

// Tournament itself

function handleSetTournamentAction(state, action): ActualTournamentState {
  const newState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newState.actualTournament = action.payload;
  }
  return newState;
}

function handleUnsetTournamentAction(state): ActualTournamentState {
  const newState: ActualTournamentState = _.cloneDeep(state);

  newState.actualTournament = undefined;

  return newState;
}

// Registrations

function handleAddTournamentRegistrationAction(state: ActualTournamentState, action): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.actualTournamentRegisteredPlayers.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentRegistrationAction(state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload.id]);

    newStoreState.actualTournamentRegisteredPlayers[indexOfSearchedRegistration] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentRegistrationAction(state: ActualTournamentState, action): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRegistration = _.findIndex(newStoreState.actualTournamentRegisteredPlayers, ['id', action.payload]);
    newStoreState.actualTournamentRegisteredPlayers.splice(indexOfSearchedRegistration, 1);
  }
  return newStoreState;
}


function handleClearTournamentRegistrationAction(state: ActualTournamentState): ActualTournamentState {

  const newTournamentData: ActualTournamentState = _.cloneDeep(state);

  newTournamentData.actualTournamentRegisteredPlayers = [];

  return newTournamentData;
}

function handleAddAllTournamentRegistrationAction(state: ActualTournamentState, action): ActualTournamentState {

  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.actualTournamentRegisteredPlayers = action.payload;

  }
  return newStoreState;
}

function handleLoadRegistrationsFinishedAction(state: ActualTournamentState): ActualTournamentState {
  const newStoreState: ActualTournamentState = _.cloneDeep(state);

  newStoreState.loadRegistrations = false;

  return newStoreState;
}


// TournamentPlayers

// function handleAddTournamentTournamentPlayerAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     newTournamentData.actualTournamentPlayers.push(action.payload);
//   }
//   return newTournamentData;
// }
//
// function handleChangeTournamentTournamentPlayerAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedTournamentPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload.id]);
//
//     newStoreState.actualTournamentPlayers[indexOfSearchedTournamentPlayer] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleRemoveTournamentTournamentPlayerAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedTournamentPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload]);
//     newStoreState.actualTournamentPlayers.splice(indexOfSearchedTournamentPlayer, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleClearTournamentTournamentPlayerAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   newTournamentData.actualTournamentPlayers = [];
//
//   return newTournamentData;
// }
//
// function handleAddAllTournamentTournamentPlayerAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     newStoreState.actualTournamentPlayers = action.payload;
//   }
//   return newStoreState;
// }
//
//
// function handleLoadTournamentPlayersFinishedAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   newStoreState.loadPlayers = false;
//
//   return newStoreState;
// }
//
// function handleSearchFieldTournamentPlayersAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     newStoreState.playersSearchField = action.payload;
//   }
//   return newStoreState;
// }


// ArmyLists

// function handleAddTournamentArmyListAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     newTournamentData.actualTournamentArmyLists.push(action.payload);
//   }
//   return newTournamentData;
// }
//
// function handleChangeTournamentArmyListAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedArmyList = _.findIndex(newStoreState.actualTournamentArmyLists, ['id', action.payload.id]);
//
//     newStoreState.actualTournamentArmyLists[indexOfSearchedArmyList] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleRemoveTournamentArmyListAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedArmyList = _.findIndex(newStoreState.actualTournamentArmyLists, ['id', action.payload]);
//     newStoreState.actualTournamentArmyLists.splice(indexOfSearchedArmyList, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleClearTournamentArmyListAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   newTournamentData.actualTournamentArmyLists = [];
//
//   return newTournamentData;
// }
//
// function handleAddAllTournamentArmyListAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     newStoreState.actualTournamentArmyLists = action.payload;
//
//   }
//   return newStoreState;
// }

// Ranking

// function handleAddTournamentRankingAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     newTournamentData.rankings.push(action.payload);
//   }
//   return newTournamentData;
// }
//
// function handleChangeTournamentRankingAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedRanking = _.findIndex(newStoreState.rankings, ['id', action.payload.id]);
//
//     newStoreState.rankings[indexOfSearchedRanking] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleRemoveTournamentRankingAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedRanking = _.findIndex(newStoreState.rankings, ['id', action.payload]);
//     newStoreState.rankings.splice(indexOfSearchedRanking, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleClearTournamentRankingAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   newTournamentData.rankings = [];
//
//   return newTournamentData;
// }
//
// function handleAddAllTournamentRankingAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     newStoreState.rankings = action.payload;
//
//   }
//   return newStoreState;
// }
//
// function handleLoadTournamentRankingsFinishedAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   newStoreState.loadRankings = false;
//
//   return newStoreState;
// }


// Games

// function handleAddTournamentGameAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     newTournamentData.games.push(action.payload);
//   }
//   return newTournamentData;
// }
//
// function handleChangeTournamentGameAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedGame = _.findIndex(newStoreState.games, ['id', action.payload.id]);
//
//     newStoreState.games[indexOfSearchedGame] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleRemoveTournamentGameAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedGame = _.findIndex(newStoreState.games, ['id', action.payload]);
//     newStoreState.games.splice(indexOfSearchedGame, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleClearTournamentGameAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   newTournamentData.games = [];
//
//   return newTournamentData;
// }
//
// function handleAddAllTournamentGameAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     newStoreState.games = action.payload;
//
//   }
//   return newStoreState;
// }
//
// function handleLoadTournamentGamesFinishedAction(state: ActualTournamentState): ActualTournamentState {
//
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   newStoreState.loadGames = false;
//
//   return newStoreState;
// }



// // OLD-------------------------------------------------------
//
// function handleTournamentGameClearAction(state): ActualTournamentState {
//
//   const gamesStoreData: ActualTournamentState = _.cloneDeep(state);
//
//   gamesStoreData.games = [];
//
//   return gamesStoreData;
// }
//
//
// function handleTournamentGameAddedAction(state, action): ActualTournamentState {
//
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     if (newTournamentData.games === undefined) {
//       newTournamentData.games = [];
//     }
//     newTournamentData.games.push(action.payload);
//   }
//   return newTournamentData;
// }
//
//
// function handleTournamentGameDeletedAction(state, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedGame = _.findIndex(newStoreState.games, ['id', action.payload]);
//     newStoreState.games.splice(indexOfSearchedGame, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleTournamentGameChangedData(state, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedGame = _.findIndex(newStoreState.games, ['id', action.payload.id]);
//
//     newStoreState.games[indexOfSearchedGame] = action.payload;
//   }
//   return newStoreState;
// }
//
// // TournamentPlayer
//
// function handleTournamentPlayerAddedAction(state, action): ActualTournamentState {
//
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     if (newTournamentData.actualTournamentPlayers === undefined) {
//       newTournamentData.actualTournamentPlayers = [];
//     }
//     newTournamentData.actualTournamentPlayers.push(action.payload);
//   }
//   return newTournamentData;
// }
//
// function handleTournamentPlayerDeletedAction(state, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload]);
//     newStoreState.actualTournamentPlayers.splice(indexOfSearchedPlayer, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleTournamentPlayerChangedData(state, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedPlayer = _.findIndex(newStoreState.actualTournamentPlayers, ['id', action.payload.id]);
//
//     newStoreState.actualTournamentPlayers[indexOfSearchedPlayer] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleClearTournamentPlayerAction(state): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   newTournamentData.actualTournamentPlayers = [];
//
//   return newTournamentData;
// }
//
// // TournamentRanking
//
// function handleTournamentRankingClearAction(state: ActualTournamentState): ActualTournamentState {
//
//   const rankingData: ActualTournamentState = _.cloneDeep(state);
//
//   rankingData.rankings = [];
//
//   return rankingData;
// }
//
// function handleTournamentRankingAddedAction(state: ActualTournamentState, action): ActualTournamentState {
//
//
//   const rankingsStoreData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     if (rankingsStoreData.rankings === undefined) {
//       rankingsStoreData.rankings = [];
//     }
//     rankingsStoreData.rankings.push(action.payload);
//   }
//   return rankingsStoreData;
// }
//
//
// function handleTournamentRankingDeletedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedRanking = _.findIndex(newStoreState.rankings, ['id', action.payload]);
//     newStoreState.rankings.splice(indexOfSearchedRanking, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleTournamentRankingChangedData(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedRanking = _.findIndex(newStoreState.rankings, ['id', action.payload.id]);
//
//     newStoreState.rankings[indexOfSearchedRanking] = action.payload;
//   }
//   return newStoreState;
// }
//
//
// // TournamentTeam
//
// function handleTournamentTeamsClearAction(state: ActualTournamentState): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   newStoreState.actualTournamentTeams = [];
//
//   return newStoreState;
// }
//
// function handleTournamentTeamAddedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     newStoreState.actualTournamentTeams.push(action.payload);
//   }
//   return newStoreState;
// }
//
// function handleTournamentTeamChangedData(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearched = _.findIndex(newStoreState.actualTournamentTeams, ['id', action.payload.id]);
//     newStoreState.actualTournamentTeams[indexOfSearched] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleTournamentTeamDeletedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearched = _.findIndex(newStoreState.actualTournamentTeams, ['id', action.payload]);
//     newStoreState.actualTournamentTeams.splice(indexOfSearched, 1);
//   }
//   return newStoreState;
// }
//
// // Team Registration
//
// function handleTournamentTeamRegistrationClearAction(state: ActualTournamentState): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   newStoreState.actualTournamentRegisteredTeams = [];
//
//   return newStoreState;
// }
//
// function handleTournamentTeamRegistrationAddedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     newStoreState.actualTournamentRegisteredTeams.push(action.payload);
//   }
//   return newStoreState;
// }
//
// function handleTournamentTeamRegistrationChangedData(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearched = _.findIndex(newStoreState.actualTournamentRegisteredTeams, ['id', action.payload.id]);
//     newStoreState.actualTournamentRegisteredTeams[indexOfSearched] = action.payload;
//   }
//   return newStoreState;
// }
//
// function handleTournamentTeamRegistrationDeletedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearched = _.findIndex(newStoreState.actualTournamentRegisteredTeams, ['id', action.payload]);
//     newStoreState.actualTournamentRegisteredTeams.splice(indexOfSearched, 1);
//   }
//   return newStoreState;
// }
//
// // Team Games
//
// function handleTournamentTeamGameClearAction(state: ActualTournamentState): ActualTournamentState {
//
//   const gamesStoreData: ActualTournamentState = _.cloneDeep(state);
//
//   gamesStoreData.actualTournamentTeamGames = [];
//
//   return gamesStoreData;
// }
//
//
// function handleTournamentTeamGameAddedAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     if (newTournamentData.actualTournamentTeamGames === undefined) {
//       newTournamentData.actualTournamentTeamGames = [];
//     }
//     newTournamentData.actualTournamentTeamGames.push(action.payload);
//   }
//   return newTournamentData;
// }
//
//
// function handleTournamentTeamGameDeletedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedTeamGame = _.findIndex(newStoreState.actualTournamentTeamGames, ['id', action.payload]);
//     newStoreState.actualTournamentTeamGames.splice(indexOfSearchedTeamGame, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleTournamentTeamGameChangedData(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedTeamGame = _.findIndex(newStoreState.actualTournamentTeamGames, ['id', action.payload.id]);
//
//     newStoreState.actualTournamentTeamGames[indexOfSearchedTeamGame] = action.payload;
//   }
//   return newStoreState;
// }
//
// // TeamRanking
//
// function handleTournamentTeamRankingClearAction(state: ActualTournamentState): ActualTournamentState {
//
//   const gamesStoreData: ActualTournamentState = _.cloneDeep(state);
//
//   gamesStoreData.actualTournamentTeamRankings = [];
//
//   return gamesStoreData;
// }
//
//
// function handleTournamentTeamRankingAddedAction(state: ActualTournamentState, action): ActualTournamentState {
//
//   const newTournamentData: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//     if (newTournamentData.actualTournamentTeamRankings === undefined) {
//       newTournamentData.actualTournamentTeamRankings = [];
//     }
//     newTournamentData.actualTournamentTeamRankings.push(action.payload);
//   }
//   return newTournamentData;
// }
//
//
// function handleTournamentTeamRankingDeletedAction(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedTeamRanking = _.findIndex(newStoreState.actualTournamentTeamRankings, ['id', action.payload]);
//     newStoreState.actualTournamentTeamRankings.splice(indexOfSearchedTeamRanking, 1);
//   }
//   return newStoreState;
// }
//
//
// function handleTournamentTeamRankingChangedData(state: ActualTournamentState, action): ActualTournamentState {
//   const newStoreState: ActualTournamentState = _.cloneDeep(state);
//
//   if (action.payload !== undefined) {
//
//     const indexOfSearchedTeamRanking = _.findIndex(newStoreState.actualTournamentTeamRankings, ['id', action.payload.id]);
//
//     newStoreState.actualTournamentTeamRankings[indexOfSearchedTeamRanking] = action.payload;
//   }
//   return newStoreState;
// }

