import {Action} from '@ngrx/store';
import {Registration} from '../../../../shared/model/registration';
import {TournamentGame} from "../../../../shared/model/tournament-game";


export const MY_SITE_SUBSCRIBE_ACTION = 'MY_SITE_SUBSCRIBE_ACTION';

export class MySiteSubscribeAction implements Action {

  readonly type = 'MY_SITE_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const MY_REGISTRATIONS_CLEAR_ACTION = 'MY_REGISTRATIONS_CLEAR_ACTION';

export class MyRegistrationsClearAction implements Action {

  readonly type = 'MY_REGISTRATIONS_CLEAR_ACTION';

  constructor() {
  }
}


export const MY_REGISTRATION_ADDED_ACTION = 'MY_REGISTRATION_ADDED_ACTION';

export class MyRegistrationAddedAction implements Action {

  readonly type = 'MY_REGISTRATION_ADDED_ACTION';

  constructor(public payload: Registration) {
  }
}

export const MY_REGISTRATION_CHANGED_ACTION = 'MY_REGISTRATION_CHANGED_ACTION';

export class MyRegistrationChangedAction implements Action {

  readonly type = 'MY_REGISTRATION_CHANGED_ACTION';

  constructor(public payload: Registration) {
  }
}
export const MY_REGISTRATION_DELETED_ACTION = 'MY_REGISTRATION_DELETED_ACTION';

export class MyRegistrationDeletedAction implements Action {

  readonly type = 'MY_REGISTRATION_DELETED_ACTION';

  constructor(public payload: string) {
  }
}


export const MY_GAMES_CLEAR_ACTION = 'MY_GAMES_CLEAR_ACTION';

export class MyGamesClearAction implements Action {

  readonly type = 'MY_GAMES_CLEAR_ACTION';

  constructor() {
  }
}


export const MY_GAMES_ADDED_ACTION = 'MY_GAMES_ADDED_ACTION';

export class MyGameAddedAction implements Action {

  readonly type = 'MY_GAMES_ADDED_ACTION';

  constructor(public payload: TournamentGame) {
  }
}

export const MY_GAMES_CHANGED_ACTION = 'MY_GAMES_CHANGED_ACTION';

export class MyGameChangedAction implements Action {

  readonly type = 'MY_GAMES_CHANGED_ACTION';

  constructor(public payload: TournamentGame) {
  }
}
export const MY_GAMES_DELETED_ACTION = 'MY_GAMES_DELETED_ACTION';

export class MyGameDeletedAction implements Action {

  readonly type = 'MY_GAMES_DELETED_ACTION';

  constructor(public payload: string) {
  }
}


