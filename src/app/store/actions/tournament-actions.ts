import {Action} from "@ngrx/store";
import {Tournament} from "../../../../shared/model/tournament";
import {RegistrationVM} from "../../tournament/registration.vm";


export const TOURNAMENT_SUBSCRIBE_ACTION = 'TOURNAMENT_SUBSCRIBE_ACTION';

export class TournamentSubscribeAction implements Action {

  readonly type = 'TOURNAMENT_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const SET_ACTUAL_TOURNAMENT_ACTION = 'SET_ACTUAL_TOURNAMENT_ACTION';

export class SetActualTournamentAction implements Action {

  readonly type = 'SET_ACTUAL_TOURNAMENT_ACTION';

  constructor(public payload: Tournament) {
  }
}

export const REGISTRATION_PUSH_ACTION = 'REGISTRATION_PUSH_ACTION';

export class RegistrationPushAction implements Action {

  readonly type = 'REGISTRATION_PUSH_ACTION';

  constructor(public payload: RegistrationVM) {
  }
}



