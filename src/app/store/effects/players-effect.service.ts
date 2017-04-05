import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {PlayersService} from "../../service/players.service";
import {PLAYERS_SUBSCRIBE_ACTION, PLAYERS_UNSUBSCRIBE_ACTION} from "../actions/players-actions";

@Injectable()
export class PlayersEffectService {

  constructor(
    private actions$: Actions,
    private playerService: PlayersService
  ) { }

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(PLAYERS_SUBSCRIBE_ACTION)
    .debug('PLAYERS_SUBSCRIBE_ACTION')
    .map(action => this.playerService.subscribeOnPlayers());

  @Effect({dispatch: false}) unsubscribe = this.actions$
    .ofType(PLAYERS_UNSUBSCRIBE_ACTION)
    .debug('PLAYERS_UNSUBSCRIBE_ACTION')
    .map(action => this.playerService.unsubscribeOnPlayers());


}
