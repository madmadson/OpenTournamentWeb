import {Action} from '@ngrx/store';
import * as _ from 'lodash';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {
  GAME_ADDED_ACTION, GAMES_CLEAR_ACTION
} from '../actions/games-actions';


export interface GamesStoreData {
  games: TournamentGame[];
}

const INITIAL_STATE: GamesStoreData = {

  games: []
};


export function GamesReducer(state: GamesStoreData = INITIAL_STATE, action: Action): GamesStoreData {


  switch (action.type) {

    case GAMES_CLEAR_ACTION:

      return handleGamesClearAction(state, action);

    case GAME_ADDED_ACTION:

      return handleGameAddedData(state, action);

    default:
      return state;

  }
}

function handleGamesClearAction(
  state: GamesStoreData, action: Action): GamesStoreData {

  const playersStoreData: GamesStoreData = _.cloneDeep(state);

  playersStoreData.games = [];

  return playersStoreData;
}

function handleGameAddedData(state: GamesStoreData, action: Action): GamesStoreData {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.games.push(action.payload);
  }
  return newStoreState;
}


