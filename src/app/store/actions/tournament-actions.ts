import {Action} from "@ngrx/store";
import {Tournament} from "../../../../shared/model/tournament";
import {RegistrationVM} from "../../tournament/registration.vm";
import {Registration} from "../../../../shared/model/registration";


export const TOURNAMENT_SUBSCRIBE_ACTION = 'TOURNAMENT_SUBSCRIBE_ACTION';

export class TournamentSubscribeAction implements Action {

  readonly type = 'TOURNAMENT_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_UNSUBSCRIBE_ACTION = 'TOURNAMENT_UNSUBSCRIBE_ACTION';

export class TournamentUnsubscribeAction implements Action {

  readonly type = 'TOURNAMENT_UNSUBSCRIBE_ACTION';

  constructor() {
  }
}

export const SET_ACTUAL_TOURNAMENT_ACTION = 'SET_ACTUAL_TOURNAMENT_ACTION';

export class SetActualTournamentAction implements Action {

  readonly type = 'SET_ACTUAL_TOURNAMENT_ACTION';

  constructor(public payload: Tournament) {
  }
}

export const TOURNAMENT_REGISTRATION_ADDED = 'TOURNAMENT_REGISTRATION_ADDED';

export class TournamentRegistrationAdded implements Action {

  readonly type = 'TOURNAMENT_REGISTRATION_ADDED';

  constructor(public payload: Registration) {
  }
}

export const TOURNAMENT_REGISTRATION_CHANGED = 'TOURNAMENT_REGISTRATION_CHANGED';

export class TournamentRegistrationChanged implements Action {

  readonly type = 'TOURNAMENT_REGISTRATION_CHANGED';

  constructor(public payload: Registration) {
  }
}

export const TOURNAMENT_REGISTRATION_DELETED = 'TOURNAMENT_REGISTRATION_DELETED';

export class TournamentRegistrationDeleted implements Action {

  readonly type = 'TOURNAMENT_REGISTRATION_DELETED';

  constructor(public payload: string) {
  }
}

export const REGISTRATION_PUSH_ACTION = 'REGISTRATION_PUSH_ACTION';

export class RegistrationPushAction implements Action {

  readonly type = 'REGISTRATION_PUSH_ACTION';

  constructor(public payload: RegistrationVM) {
  }
}

export const CLEAR_TOURNAMENT_REGISTRATION_ACTION = 'CLEAR_TOURNAMENT_REGISTRATION_ACTION';

export class ClearRegistrationAction implements Action {

  readonly type = 'CLEAR_TOURNAMENT_REGISTRATION_ACTION';

  constructor() {
  }
}



