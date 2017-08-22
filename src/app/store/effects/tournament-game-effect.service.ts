import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {TournamentGameService} from '../../service/tournament-game.service';
import {SubscribeTournamentGamesAction, TOURNAMENT_GAMES_SUBSCRIBE_ACTION} from '../actions/tournament-games-actions';


@Injectable()
export class TournamentGameEffectService {

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENT_GAMES_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_GAMES_SUBSCRIBE_ACTION')
    .map((action: SubscribeTournamentGamesAction) => this.gameService.subscribeOnTournamentGames(action.payload));


  constructor(
    private actions$: Actions,
    private gameService: TournamentGameService
  ) { }
}
