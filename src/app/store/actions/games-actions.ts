import {Action} from '@ngrx/store';
import {TournamentGame} from '../../../../shared/model/tournament-game';

export const GAMES_SUBSCRIBE_ACTION = 'GAMES_SUBSCRIBE_ACTION';
export class GamesSubscribeAction implements Action {

  readonly type = 'GAMES_SUBSCRIBE_ACTION';
  constructor() {
  }
}

export const GAMES_CLEAR_ACTION = 'GAMES_CLEAR_ACTION';
export class GamesClearAction implements Action {

  readonly type = 'GAMES_CLEAR_ACTION';
  constructor() {
  }
}

export const GAME_ADDED_ACTION = 'GAME_ADDED_ACTION';
export class GameAddedAction implements Action {

  readonly type = 'GAME_ADDED_ACTION';
  constructor(public payload: TournamentGame) {
  }
}


