import {
  ADD_ACTUAL_TOURNAMENT_RANKING_ACTION, ADD_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION, ADD_ALL_ACTUAL_TOURNAMENT_TEAM_RANKINGS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION, CHANGE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION, CLEAR_ACTUAL_TOURNAMENT_TEAM_RANKINGS_ACTION,
  LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION, LOAD_TOURNAMENT_TEAM_RANKINGS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION, REMOVE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION
} from './tournament-actions';


import * as _ from 'lodash';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';

export interface ActualTournamentTeamRankingsState {

  teamRankings: TournamentRanking[];
  loadTeamRankings: boolean;
}

const initialState = {
  teamRankings: [],
  loadTeamRankings: true,
};


export function actualTournamentRankingsReducer(state = initialState, action): ActualTournamentTeamRankingsState {

  switch (action.type) {

    // Team Rankings
    case ADD_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION:
      return handleAddTournamentTeamRankingAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION:
      return handleChangeTournamentTeamRankingAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_TEAM_RANKING_ACTION:
      return handleRemoveTournamentTeamRankingAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_TEAM_RANKINGS_ACTION:
      return handleClearTournamentTeamRankingAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_TEAM_RANKINGS_ACTION:
      return handleAddAllTournamentTeamRankingAction(state, action);
    case LOAD_TOURNAMENT_TEAM_RANKINGS_FINISHED_ACTION:
      return handleLoadTournamentTeamRankingsFinishedAction(state);

    default:
      return state;
  }
}

// TeamRanking

function handleAddTournamentTeamRankingAction(state: ActualTournamentTeamRankingsState, action): ActualTournamentTeamRankingsState {

  const newTournamentData: ActualTournamentTeamRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.teamRankings.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentTeamRankingAction(state: ActualTournamentTeamRankingsState, action): ActualTournamentTeamRankingsState {
  const newStoreState: ActualTournamentTeamRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.teamRankings, ['id', action.payload.id]);

    newStoreState.teamRankings[indexOfSearchedRanking] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentTeamRankingAction(state: ActualTournamentTeamRankingsState, action): ActualTournamentTeamRankingsState {
  const newStoreState: ActualTournamentTeamRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.teamRankings, ['id', action.payload]);
    newStoreState.teamRankings.splice(indexOfSearchedRanking, 1);
  }
  return newStoreState;
}


function handleClearTournamentTeamRankingAction(state: ActualTournamentTeamRankingsState): ActualTournamentTeamRankingsState {

  const newTournamentData: ActualTournamentTeamRankingsState = _.cloneDeep(state);

  newTournamentData.teamRankings = [];

  return newTournamentData;
}

function handleAddAllTournamentTeamRankingAction(state: ActualTournamentTeamRankingsState, action): ActualTournamentTeamRankingsState {

  const newStoreState: ActualTournamentTeamRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.teamRankings = action.payload;

  }
  return newStoreState;
}

function handleLoadTournamentTeamRankingsFinishedAction(state: ActualTournamentTeamRankingsState): ActualTournamentTeamRankingsState {

  const newStoreState: ActualTournamentTeamRankingsState = _.cloneDeep(state);

  newStoreState.loadTeamRankings = false;

  return newStoreState;
}

