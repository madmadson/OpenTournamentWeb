import {Action} from '@ngrx/store';

import * as _ from 'lodash';
import {
  TOURNAMENT_RANKING_ADDED_ACTION, TOURNAMENT_RANKING_CHANGED_ACTION,
  TOURNAMENT_RANKING_DELETED_ACTION
} from '../actions/tournament-rankings-actions';

import {TournamentRanking} from '../../../../shared/model/tournament-ranking';

export interface ActualTournamentRankingsStoreData {
  actualTournamentRankings: TournamentRanking[];
}

const INITIAL_STATE: ActualTournamentRankingsStoreData = {

  actualTournamentRankings: []
};


export function TournamentRankingReducer(
  state: ActualTournamentRankingsStoreData = INITIAL_STATE, action: Action): ActualTournamentRankingsStoreData {


  switch (action.type) {


    case TOURNAMENT_RANKING_ADDED_ACTION:

      return handleTournamentRankingAddedAction(state, action);

    case TOURNAMENT_RANKING_DELETED_ACTION:

      return handleTournamentRankingDeletedAction(state, action);

    case TOURNAMENT_RANKING_CHANGED_ACTION:

      return handleTournamentRankingChangedData(state, action);



    default:
      return state;

  }
}


function handleTournamentRankingAddedAction(
  state: ActualTournamentRankingsStoreData, action: Action): ActualTournamentRankingsStoreData {


  const newTournamentData: ActualTournamentRankingsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentRankings === undefined) {
      newTournamentData.actualTournamentRankings = [];
    }
    newTournamentData.actualTournamentRankings.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentRankingDeletedAction(
  state: ActualTournamentRankingsStoreData, action: Action): ActualTournamentRankingsStoreData {
  const newStoreState: ActualTournamentRankingsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.actualTournamentRankings, ['id', action.payload]);
    newStoreState.actualTournamentRankings.splice(indexOfSearchedRanking, 1);
  }
  return newStoreState;
}


function handleTournamentRankingChangedData(
  state: ActualTournamentRankingsStoreData, action: Action): ActualTournamentRankingsStoreData {
  const newStoreState: ActualTournamentRankingsStoreData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.actualTournamentRankings, ['id', action.payload.id]);

    newStoreState.actualTournamentRankings[indexOfSearchedRanking] = action.payload;
  }
  return newStoreState;
}
