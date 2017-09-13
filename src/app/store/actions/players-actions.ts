import {Action} from '@ngrx/store';
import {Player} from '../../../../shared/model/player';


export const PLAYER_PUSH_ACTION = 'PLAYER_PUSH_ACTION';
export class PlayerPushAction implements Action {

  readonly type = 'PLAYER_PUSH_ACTION';
  constructor(public payload: Player) {
  }
}



