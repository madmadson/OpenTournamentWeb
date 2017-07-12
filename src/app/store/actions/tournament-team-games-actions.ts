import {Action} from '@ngrx/store';
import {TournamentGame} from '../../../../shared/model/tournament-game';

export const TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION = 'TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION';
export class SubscribeTournamentTeamGamesAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION';
  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_GAMES_CLEAR_ACTION = 'TOURNAMENT_TEAM_TEAM_GAMES_CLEAR_ACTION';
export class ClearTournamentTeamGamesAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_TEAM_GAMES_CLEAR_ACTION';
  constructor() {
  }
}

export const TOURNAMENT_TEAM_GAME_ADDED_ACTION = 'TOURNAMENT_TEAM_GAME_ADDED_ACTION';
export class AddTournamentTeamGameAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_GAME_ADDED_ACTION';
  constructor(public payload: TournamentGame) {
  }
}

export const TOURNAMENT_TEAM_GAME_DELETED_ACTION = 'TOURNAMENT_TEAM_GAME_DELETED_ACTION';
export class DeleteTournamentTeamGameAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_GAME_DELETED_ACTION';
  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_GAME_CHANGED_ACTION = 'TOURNAMENT_TEAM_GAME_CHANGED_ACTION';
export class ChangeTournamentTeamGameAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_GAME_CHANGED_ACTION';
  constructor(public payload: TournamentGame) {
  }
}

export const CLEAR_TEAM_GAME_RESULT_ACTION = 'CLEAR_TEAM_GAME_RESULT_ACTION';
export class ClearTeamGameResultAction implements Action {

  readonly type = 'CLEAR_TEAM_GAME_RESULT_ACTION';
  constructor(public payload: TournamentGame) {
  }
}
