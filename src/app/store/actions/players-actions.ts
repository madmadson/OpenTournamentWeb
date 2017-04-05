import {Action} from "@ngrx/store";
import {Player} from "../../../../shared/model/player";


export const PLAYERS_SUBSCRIBE_ACTION = 'PLAYERS_SUBSCRIBE_ACTION';

export class PlayersSubscribeAction implements Action {

  readonly type = 'PLAYERS_SUBSCRIBE_ACTION';

  constructor() {
  }
}

export const PLAYERS_CLEAR_ACTION = 'PLAYERS_CLEAR_ACTION';

export class PlayersClearAction implements Action {

  readonly type = 'PLAYERS_CLEAR_ACTION';

  constructor() {
  }
}

export const PLAYERS_UNSUBSCRIBE_ACTION = 'PLAYERS_UNSUBSCRIBE_ACTION';

export class PlayersUnsubscribeAction implements Action {

  readonly type = 'PLAYERS_UNSUBSCRIBE_ACTION';

  constructor() {
  }
}


export const PLAYER_ADDED_ACTION = 'PLAYER_ADDED_ACTION';

export class PlayerAddedAction implements Action {

  readonly type = 'PLAYER_ADDED_ACTION';

  constructor(public payload: Player) {
  }
}

export const PLAYER_CHANGED_ACTION = 'PLAYER_CHANGED_ACTION';

export class PlayerChangedAction implements Action {

  readonly type = 'PLAYER_CHANGED_ACTION';

  constructor(public payload: Player) {
  }
}
export const PLAYER_DELETED_ACTION = 'PLAYER_DELETED_ACTION';

export class PlayerDeletedAction implements Action {

  readonly type = 'PLAYER_DELETED_ACTION';

  constructor(public payload: string) {
  }
}



