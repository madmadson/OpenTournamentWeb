import {Action} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';
import {Registration} from '../../../../shared/model/registration';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentRanking} from "../../../../shared/model/tournament-ranking";



export const RANKING_SUBSCRIBE_ACTION = 'RANKING_SUBSCRIBE_ACTION';

export class SubscribeRankingAction implements Action {

  readonly type = 'RANKING_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_RANKING_ADDED = 'TOURNAMENT_RANKING_ADDED';

export class AddTournamentRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKING_ADDED';

  constructor(public payload: TournamentRanking) {
  }
}

export const TOURNAMENT_RANKING_DELETED = 'TOURNAMENT_RANKING_DELETED';

export class DeleteTournamentRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKING_DELETED';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_RANKING_CHANGED = 'TOURNAMENT_RANKING_CHANGED';

export class ChangeTournamentRankingAction implements Action {

  readonly type = 'TOURNAMENT_RANKING_CHANGED';

  constructor(public payload: TournamentRanking) {
  }
}
