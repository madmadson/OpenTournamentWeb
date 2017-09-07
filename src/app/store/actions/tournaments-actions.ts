import {Action} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';
import {CoOrganizatorPush} from '../../../../shared/dto/co-organizator-push';


export const TOURNAMENT_PUSH_ACTION = 'TOURNAMENT_PUSH_ACTION';
export class TournamentPushAction implements Action {

  readonly type = 'TOURNAMENT_PUSH_ACTION';
  constructor(public payload: Tournament) {
  }
}

export const TOURNAMENT_SET_ACTION = 'TOURNAMENT_SET_ACTION';
export class TournamentSetAction implements Action {

  readonly type = 'TOURNAMENT_SET_ACTION';
  constructor(public payload: Tournament) {
  }
}

export const CO_ORGANIZER_ADD_ACTION = 'CO_ORGANIZER_ADD_ACTION';
export class CoOrganizatorAddAction implements Action {

  readonly type = 'CO_ORGANIZER_ADD_ACTION';
  constructor(public payload: CoOrganizatorPush) {
  }
}

export const CO_ORGANIZER_DELETE_ACTION = 'CO_ORGANIZER_DELETE_ACTION';
export class CoOrganizatorDeleteAction implements Action {

  readonly type = 'CO_ORGANIZER_DELETE_ACTION';
  constructor(public payload: CoOrganizatorPush) {
  }
}
