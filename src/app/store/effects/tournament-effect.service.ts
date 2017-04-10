import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  REGISTRATION_PUSH_ACTION, TOURNAMENT_SUBSCRIBE_ACTION,
  TOURNAMENT_UNSUBSCRIBE_ACTION
} from '../actions/tournament-actions';
import {TournamentService} from '../../service/tournament.service';


@Injectable()
export class TournamentEffectService {

  constructor(
    private actions$: Actions,
    private tournamentService: TournamentService
  ) { }

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENT_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_SUBSCRIBE_ACTION')
    .map(action => this.tournamentService.subscribeOnTournament(action.payload));

  @Effect({dispatch: false}) unsubscribe = this.actions$
    .ofType(TOURNAMENT_UNSUBSCRIBE_ACTION)
    .debug('TOURNAMENT_UNSUBSCRIBE_ACTION')
    .map(action => this.tournamentService.unsubscribeOnTournament());

  @Effect({dispatch: false}) pushRegistartion = this.actions$
    .ofType(REGISTRATION_PUSH_ACTION)
    .debug('REGISTRATION_PUSH_ACTION')
    .map(action => this.tournamentService.pushRegistration(action.payload));
}
