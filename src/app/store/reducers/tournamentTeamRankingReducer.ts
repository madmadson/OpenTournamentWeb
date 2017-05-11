import {Action} from '@ngrx/store';

import * as _ from 'lodash';

import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {
  TOURNAMENT_TEAM_RANKING_ADDED_ACTION,
  TOURNAMENT_TEAM_RANKING_CHANGED_ACTION,
  TOURNAMENT_TEAM_RANKING_DELETED_ACTION,
  TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION
} from '../actions/tournament-team-rankings-actions';


export interface ActualTournamentTeamRankingsStoreData {
  actualTournamentTeamRankings: TournamentRanking[];
}

const INITIAL_STATE: ActualTournamentTeamRankingsStoreData = {

  actualTournamentTeamRankings: []
};


export function TournamentTeamRankingReducer(
  state: ActualTournamentTeamRankingsStoreData = INITIAL_STATE, action: Action): ActualTournamentTeamRankingsStoreData {


  switch (action.type) {

    case TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION:

      return handleTournamentTeamRankingClearAction(state, action);

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

function handleTournamentTeamRankingClearAction(
  state: ActualTournamentTeamRankingsStoreData, action: Action): ActualTournamentTeamRankingsStoreData {

  const gamesStoreData: ActualTournamentTeamRankingsStoreData = _.cloneDeep(state);

  gamesStoreData.actualTournamentTeamRankings = [];

  return gamesStoreData;
}



function handleTournamentTeamRankingAddedAction(
  state: ActualTournamentTeamRankingsStoreData, action: Action): ActualTournamentTeamRankingsStoreData {


  const newTournamentData: ActualTournamentTeamRankingsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentTeamRankings === undefined) {
      newTournamentData.actualTournamentTeamRankings = [];
    }
    newTournamentData.actualTournamentTeamRankings.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentTeamRankingDeletedAction(
  state: ActualTournamentTeamRankingsStoreData, action: Action): ActualTournamentTeamRankingsStoreData {
  const newStoreState: ActualTournamentTeamRankingsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRanking = _.findIndex(newStoreState.actualTournamentTeamRankings, ['id', action.payload]);
    newStoreState.actualTournamentTeamRankings.splice(indexOfSearchedTeamRanking, 1);
  }
  return newStoreState;
}


function handleTournamentTeamRankingChangedData(
  state: ActualTournamentTeamRankingsStoreData, action: Action): ActualTournamentTeamRankingsStoreData {
  const newStoreState: ActualTournamentTeamRankingsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedTeamRanking = _.findIndex(newStoreState.actualTournamentTeamRankings, ['id', action.payload.id]);

    newStoreState.actualTournamentTeamRankings[indexOfSearchedTeamRanking] = action.payload;
  }
  return newStoreState;
}
