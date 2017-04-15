import {Action} from '@ngrx/store';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';



export const TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION = 'TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION';

export class SubscribeRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_RANKING_ADDED_ACTION = 'TOURNAMENT_RANKING_ADDED_ACTION';

export class AddTournamentRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKING_ADDED_ACTION';

  constructor(public payload: TournamentRanking) {
  }
}

export const TOURNAMENT_RANKING_DELETED_ACTION = 'TOURNAMENT_RANKING_DELETED_ACTION';

export class DeleteTournamentRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKING_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_RANKING_CHANGED_ACTION = 'TOURNAMENT_RANKING_CHANGED_ACTION';

export class ChangeTournamentRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKING_CHANGED_ACTION';

  constructor(public payload: TournamentRanking) {
  }
}
