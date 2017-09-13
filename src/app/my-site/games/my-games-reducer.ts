import * as _ from 'lodash';
import {
  ADD_ALL_MY_GAMES_ACTION,
  ADD_MY_GAME_ACTION,
  CHANGE_MY_GAME_ACTION,
  CLEAR_ALL_MY_GAMES_ACTION,
  LOAD_MY_GAMES_FINISHED_ACTION,
  REMOVE_MY_GAME_ACTION
} from './my-games-actions';
import {TournamentGame} from '../../../../shared/model/tournament-game';


export interface MyGamesState {
  myGames: TournamentGame[];

  loadMyGames: boolean;

  filter: string;
  searchField: string;
}

const initialState: MyGamesState = {

  myGames: [],
  loadMyGames: true,
  filter: 'UPCOMING',
  searchField: ''
};

export function myGamesReducer(state: MyGamesState = initialState, action): MyGamesState {

  switch (action.type) {

    case ADD_ALL_MY_GAMES_ACTION:
      return addAllMyGames(state, action);

    case CLEAR_ALL_MY_GAMES_ACTION:
      return handleMyGameClearData(state);

    case ADD_MY_GAME_ACTION:
      return handleMyGameAddedData(state, action);

    case CHANGE_MY_GAME_ACTION:
      return handleMyGameChangedData(state, action);

    case REMOVE_MY_GAME_ACTION:
      return handleMyGameDeletedData(state, action);

    case LOAD_MY_GAMES_FINISHED_ACTION:
      return handleLoadFinishedMyGames(state);


    default:
      return state;

  }
}

function addAllMyGames(state: MyGamesState, action): MyGamesState {
  const newStoreState: MyGamesState = _.cloneDeep(state);

  if (action.payload !== undefined) {
    newStoreState.myGames = action.payload;
  }
  return newStoreState;
}


function handleMyGameClearData(state: MyGamesState): MyGamesState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.myGames = [];

  return newStoreState;
}

function handleMyGameAddedData(state: MyGamesState, action): MyGamesState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    newStoreState.myGames.push(action.payload);
  }
  return newStoreState;
}

function handleMyGameChangedData(state: MyGamesState, action): MyGamesState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.myGames, ['id', action.payload.id]);
    newStoreState.myGames[indexOfSearchedGame] = action.payload;
  }
  return newStoreState;
}

function handleMyGameDeletedData(state: MyGamesState, action): MyGamesState {
  const newStoreState = _.cloneDeep(state);

  if (action.payload !== undefined) {

    const indexOfSearchedGame = _.findIndex(newStoreState.myGames, ['id', action.payload]);
    newStoreState.myGames.splice(indexOfSearchedGame, 1);
  }
  return newStoreState;
}

function handleLoadFinishedMyGames(state: MyGamesState): MyGamesState {
  const newStoreState = _.cloneDeep(state);

  newStoreState.loadMyGames = false;

  return newStoreState;
}


