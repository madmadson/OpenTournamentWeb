import {Action} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';


export const TOURNAMENTS_SUBSCRIBE_ACTION = 'TOURNAMENTS_SUBSCRIBE_ACTION';

export class TournamentsSubscribeAction implements Action {

  readonly type = 'TOURNAMENTS_SUBSCRIBE_ACTION';

  constructor() {
  }
}

export const TOURNAMENTS_CLEAR_ACTION = 'TOURNAMENTS_CLEAR_ACTION';

export class TournamentsClearAction implements Action {

  readonly type = 'TOURNAMENTS_CLEAR_ACTION';

  constructor() {
  }
}

export const TOURNAMENTS_UNSUBSCRIBE_ACTION = 'TOURNAMENTS_UNSUBSCRIBE_ACTION';

export class TournamentsUnsubscribeAction implements Action {

  readonly type = 'TOURNAMENTS_UNSUBSCRIBE_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_ADDED_ACTION = 'TOURNAMENT_ADDED_ACTION';

export class TournamentAddedAction implements Action {

  readonly type = 'TOURNAMENT_ADDED_ACTION';

  constructor(public payload: Tournament) {
  }
}

export const TOURNAMENT_CHANGED_ACTION = 'TOURNAMENT_CHANGED_ACTION';

export class TournamentChangedAction implements Action {

  readonly type = 'TOURNAMENT_CHANGED_ACTION';

  constructor(public payload: Tournament) {
  }
}
export const TOURNAMENT_DELETED_ACTION = 'TOURNAMENT_DELETED_ACTION';

export class TournamentDeletedAction implements Action {

  readonly type = 'TOURNAMENT_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_PUSH_ACTION = 'TOURNAMENT_PUSH_ACTION';

export class TournamentPushAction implements Action {

  readonly type = 'TOURNAMENT_PUSH_ACTION';

  constructor(public payload: Tournament) {
  }
}


