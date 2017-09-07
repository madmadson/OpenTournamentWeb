import {
  ADD_ACTUAL_TOURNAMENT_RANKING_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION,
  LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION
} from './tournament-actions';


import * as _ from 'lodash';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';

export interface ActualTournamentRankingsState {

  rankings: TournamentRanking[];
  loadRankings: boolean;

}

const initialState = {


  rankings: [],

  loadRankings: true,
};


export function actualTournamentRankiongsReducer(state = initialState, action): ActualTournamentRankingsState {

  switch (action.type) {


    // Rankings
    case ADD_ACTUAL_TOURNAMENT_RANKING_ACTION:
      return handleAddTournamentRankingAction(state, action);
    case CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION:
      return handleChangeTournamentRankingAction(state, action);
    case REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION:
      return handleRemoveTournamentRankingAction(state, action);
    case CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION:
      return handleClearTournamentRankingAction(state);
    case ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION:
      return handleAddAllTournamentRankingAction(state, action);
    case LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION:
      return handleLoadTournamentRankingsFinishedAction(state);



    default:
      return state;
  }
}

// Ranking

function handleAddTournamentRankingAction(state: ActualTournamentRankingsState, action): ActualTournamentRankingsState {

  const newTournamentData: ActualTournamentRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newTournamentData.rankings.push(action.payload);
  }
  return newTournamentData;
}

function handleChangeTournamentRankingAction(state: ActualTournamentRankingsState, action): ActualTournamentRankingsState {
  const newStoreState: ActualTournamentRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.rankings, ['id', action.payload.id]);

    newStoreState.rankings[indexOfSearchedRanking] = action.payload;
  }
  return newStoreState;
}

function handleRemoveTournamentRankingAction(state: ActualTournamentRankingsState, action): ActualTournamentRankingsState {
  const newStoreState: ActualTournamentRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.rankings, ['id', action.payload]);
    newStoreState.rankings.splice(indexOfSearchedRanking, 1);
  }
  return newStoreState;
}


function handleClearTournamentRankingAction(state: ActualTournamentRankingsState): ActualTournamentRankingsState {

  const newTournamentData: ActualTournamentRankingsState = _.cloneDeep(state);

  newTournamentData.rankings = [];

  return newTournamentData;
}

function handleAddAllTournamentRankingAction(state: ActualTournamentRankingsState, action): ActualTournamentRankingsState {

  const newStoreState: ActualTournamentRankingsState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.rankings = action.payload;

  }
  return newStoreState;
}

function handleLoadTournamentRankingsFinishedAction(state: ActualTournamentRankingsState): ActualTournamentRankingsState {

  const newStoreState: ActualTournamentRankingsState = _.cloneDeep(state);

  newStoreState.loadRankings = false;

  return newStoreState;
}

