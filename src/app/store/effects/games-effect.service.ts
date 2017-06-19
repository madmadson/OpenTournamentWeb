import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {GAMES_SUBSCRIBE_ACTION} from '../actions/games-actions';
import {GamesService} from '../../service/games.service';

@Injectable()
export class GamesEffectService {


  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(GAMES_SUBSCRIBE_ACTION)
    .debug('GAMES_SUBSCRIBE_ACTION')
    .map(action => this.gamesService.subscribeOnGames());

  constructor(
    private actions$: Actions,
    private gamesService: GamesService
  ) { }

}
