import {Action} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';
import {RegistrationVM} from '../../tournament/registration.vm';
import {Registration} from '../../../../shared/model/registration';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';


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

export const REGISTRATION_ERASE_ACTION = 'REGISTRATION_ERASE_ACTION';

export class RegistrationEraseAction implements Action {

  readonly type = 'REGISTRATION_ERASE_ACTION';

  constructor(public payload: Registration) {
  }
}

export const CLEAR_TOURNAMENT_REGISTRATION_ACTION = 'CLEAR_TOURNAMENT_REGISTRATION_ACTION';

export class ClearRegistrationAction implements Action {

  readonly type = 'CLEAR_TOURNAMENT_REGISTRATION_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_PLAYER_ADDED = 'TOURNAMENT_PLAYER_ADDED';

export class TournamentPlayerAdded implements Action {

  readonly type = 'TOURNAMENT_PLAYER_ADDED';

  constructor(public payload: TournamentPlayer) {
  }
}

export const TOURNAMENT_PLAYER_CHANGED = 'TOURNAMENT_PLAYER_CHANGED';

export class TournamentPlayerChanged implements Action {

  readonly type = 'TOURNAMENT_PLAYER_CHANGED';

  constructor(public payload: TournamentPlayer) {
  }
}

export const TOURNAMENT_PLAYER_DELETED = 'TOURNAMENT_PLAYER_DELETED';

export class TournamentPlayerDeleted implements Action {

  readonly type = 'TOURNAMENT_PLAYER_DELETED';

  constructor(public payload: string) {
  }
}

export const CLEAR_TOURNAMENT_PLAYER_ACTION = 'CLEAR_TOURNAMENT_PLAYER_ACTION';

export class ClearTournamentPlayerAction implements Action {

  readonly type = 'CLEAR_TOURNAMENT_PLAYER_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_PLAYER_PUSH_ACTION = 'TOURNAMENT_PLAYER_PUSH_ACTION';

export class TournamentPlayerPushAction implements Action {

  readonly type = 'TOURNAMENT_PLAYER_PUSH_ACTION';

  constructor(public payload: Registration) {
  }
}

export const TOURNAMENT_PLAYER_ERASE_ACTION = 'TOURNAMENT_PLAYER_ERASE_ACTION';

export class TournamentPlayerEraseAction implements Action {

  readonly type = 'TOURNAMENT_PLAYER_ERASE_ACTION';

  constructor(public payload: TournamentPlayer) {
  }
}

