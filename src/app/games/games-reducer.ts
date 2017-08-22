import {ADD_GAME_ACTION, CLEAR_GAMES_ACTION} from './games-actions';
import {TournamentGame} from '../../../shared/model/tournament-game';
import * as _ from 'lodash';

export interface GamesState {
  games: TournamentGame[];
}

const initialState: GamesState = {
  games: [],
};


export function gamesReducer(state = initialState, action): GamesState {
  switch (action.type) {
    case ADD_GAME_ACTION:
      return addGame(state, action);

    case CLEAR_GAMES_ACTION:
      return clearGames(state);
    default:
      return state;
  }
};

function addGame(state, action): GamesState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.tournaments.push(action.payload);
  }
  return newStoreState;
}

function clearGames(state): GamesState {
  const newState = _.cloneDeep(state);

  newState.games = [];

  return newState;
}



