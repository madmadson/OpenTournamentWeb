import {Action} from '@ngrx/store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from '../tournament-data';
import {
  ARMY_LIST_ADDED_ACTION, ARMY_LIST_DELETED_ACTION,
  CLEAR_ARMY_LISTS_ACTION,
  CLEAR_TOURNAMENT_PLAYER_ACTION,
  CLEAR_TOURNAMENT_REGISTRATION_ACTION, TOURNAMENT_PLAYER_ADDED, TOURNAMENT_PLAYER_CHANGED, TOURNAMENT_PLAYER_DELETED,
  TOURNAMENT_REGISTRATION_ADDED, TOURNAMENT_REGISTRATION_CHANGED,
  TOURNAMENT_REGISTRATION_DELETED
} from '../actions/tournament-actions';

import * as _ from 'lodash';
import {
  TOURNAMENT_RANKING_ADDED, TOURNAMENT_RANKING_CHANGED,
  TOURNAMENT_RANKING_DELETED
} from '../actions/ranking-actions';


export function TournamentRankingReducer(state: TournamentData = INITIAL_TOURNAMENT_DATA, action: Action): TournamentData {


  switch (action.type) {


    case TOURNAMENT_RANKING_ADDED:

      return handleTournamentRankingAddedAction(state, action);

    case TOURNAMENT_RANKING_DELETED:

      return handleTournamentRankingDeletedAction(state, action);

    case TOURNAMENT_RANKING_CHANGED:

      return handleTournamentRankingChangedData(state, action);



    default:
      return state;

  }
}


function handleTournamentRankingAddedAction(state: TournamentData, action: Action): TournamentData {


  const newTournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {
    if (newTournamentData.actualTournamentRankings === undefined) {
      newTournamentData.actualTournamentRankings = [];
    }
    newTournamentData.actualTournamentRankings.push(action.payload);
  }
  return newTournamentData;
}


function handleTournamentRankingDeletedAction(state: TournamentData, action: Action): TournamentData {
  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.actualTournamentRankings, ['id', action.payload]);
    newStoreState.actualTournamentRankings.splice(indexOfSearchedRanking, 1);
  }
  return newStoreState;
}


function handleTournamentRankingChangedData(state: TournamentData, action: Action): TournamentData {
  const newStoreState: TournamentData = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedRanking = _.findIndex(newStoreState.actualTournamentRankings, ['id', action.payload.id]);

    newStoreState.actualTournamentRankings[indexOfSearchedRanking] = action.payload;
  }
  return newStoreState;
}
