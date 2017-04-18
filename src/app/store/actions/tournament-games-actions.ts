import {Action} from '@ngrx/store';
import {TournamentGame} from '../../../../shared/model/tournament-game';



export const TOURNAMENT_GAMES_SUBSCRIBE_ACTION = 'TOURNAMENT_GAMES_SUBSCRIBE_ACTION';

export class SubscribeTournamentGamesAction implements Action {

  readonly type = 'TOURNAMENT_GAMES_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_GAMES_CLEAR_ACTION = 'TOURNAMENT_GAMES_CLEAR_ACTION';

export class ClearTournamentGamesAction implements Action {

  readonly type = 'TOURNAMENT_GAMES_CLEAR_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_GAME_ADDED_ACTION = 'TOURNAMENT_GAME_ADDED_ACTION';

export class AddTournamentGameAction implements Action {

  readonly type = 'TOURNAMENT_GAME_ADDED_ACTION';

  constructor(public payload: TournamentGame) {
  }
}

export const TOURNAMENT_GAME_DELETED_ACTION = 'TOURNAMENT_GAME_DELETED_ACTION';

export class DeleteTournamentGameAction implements Action {

  readonly type = 'TOURNAMENT_GAME_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_GAME_CHANGED_ACTION = 'TOURNAMENT_GAME_CHANGED_ACTION';

export class ChangeTournamentGameAction implements Action {

  readonly type = 'TOURNAMENT_GAME_CHANGED_ACTION';

  constructor(public payload: TournamentGame) {
  }
}
