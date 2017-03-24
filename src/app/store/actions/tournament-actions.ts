import {Action} from "@ngrx/store";
import {Tournament} from "../../../../shared/model/tournament";


export const TOURNAMENTS_SUBSCRIBE_ACTION: string = 'TOURNAMENTS_SUBSCRIBE_ACTION';

export class TournamentsSubscribeAction implements Action{

  readonly type: string = 'TOURNAMENTS_SUBSCRIBE_ACTION';

  constructor() {
  }
}

export const TOURNAMENTS_UNSUBSCRIBE_ACTION: string = 'TOURNAMENTS_UNSUBSCRIBE_ACTION';

export class TournamentsUnsubscribeAction implements Action{

  readonly type: string = 'TOURNAMENTS_UNSUBSCRIBE_ACTION';

  constructor() {
  }
}

export const TOURNAMENTS_LOADED_ACTION: string = 'TOURNAMENTS_LOADED_ACTION';

export class TournamentsLoadedAction implements Action{

  readonly type: string = 'TOURNAMENTS_LOADED_ACTION';

  constructor(public payload?: Tournament[]) {
  }
}


