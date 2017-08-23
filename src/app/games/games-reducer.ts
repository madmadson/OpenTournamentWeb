import {ADD_GAME_ACTION, CLEAR_GAMES_ACTION, ADD_ALL_GAMES_ACTION, ADD_TO_FILTER_GAME_ACTION} from './games-actions';
import {TournamentGame} from '../../../shared/model/tournament-game';
import * as _ from 'lodash';

export interface GamesState {
  allGames: TournamentGame[];

}

const initialState: GamesState = {
  allGames: []
};


export function gamesReducer(state: GamesState = initialState, action): GamesState {
  switch (action.type) {
    case ADD_ALL_GAMES_ACTION:
      return addAllGames(state, action);

    case ADD_GAME_ACTION:
      return addGame(state, action);


    case CLEAR_GAMES_ACTION:
      return clearGames(state);
    default:
      return state;
  }
}

function addAllGames(state: GamesState, action): GamesState {


  const newStoreState: GamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.allGames = action.payload;

  }
  return newStoreState;
}

function addGame(state: GamesState, action): GamesState {

  const newStoreState: GamesState = _.cloneDeep(state);

  if (action.payload !== undefined ) {
    newStoreState.allGames.push(action.payload);
  }

  return newStoreState;
}


function clearGames(state: GamesState): GamesState {
  const newState: GamesState = _.cloneDeep(state);

  newState.allGames = [];


  return newState;
}



