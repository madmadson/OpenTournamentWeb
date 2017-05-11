import {Action} from '@ngrx/store';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';



export const TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION = 'TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION';

export class SubscribeTournamentTeamRankingsAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION = 'TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION';

export class ClearTeamRankingsAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_RANKINGS_CLEAR_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_TEAM_RANKING_ADDED_ACTION = 'TOURNAMENT_TEAM_RANKING_ADDED_ACTION';

export class AddTournamentTeamRankingAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_RANKING_ADDED_ACTION';

  constructor(public payload: TournamentRanking) {
  }
}

export const TOURNAMENT_TEAM_RANKING_DELETED_ACTION = 'TOURNAMENT_TEAM_RANKING_DELETED_ACTION';

export class DeleteTournamentTeamRankingAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_RANKING_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_RANKING_CHANGED_ACTION = 'TOURNAMENT_TEAM_RANKING_CHANGED_ACTION';

export class ChangeTournamentTeamRankingAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_RANKING_CHANGED_ACTION';

  constructor(public payload: TournamentRanking) {
  }
}
