import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  ARMY_LIST_ERASE_ACTION,
  ARMY_LIST_PUSH_ACTION, NEW_TOURNAMENT_PLAYER_PUSH_ACTION,
  REGISTRATION_ERASE_ACTION,
  REGISTRATION_PUSH_ACTION, TOURNAMENT_PLAYER_ERASE_ACTION, TOURNAMENT_PLAYER_PUSH_ACTION, TOURNAMENT_SUBSCRIBE_ACTION,
  TOURNAMENT_UNSUBSCRIBE_ACTION
} from '../actions/tournament-actions';
import {TournamentService} from '../../service/tournament.service';


@Injectable()
export class TournamentEffectService {

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

  @Effect({dispatch: false}) eraseRegistartion = this.actions$
    .ofType(REGISTRATION_ERASE_ACTION)
    .debug('REGISTRATION_ERASE_ACTION')
    .map(action => this.tournamentService.eraseRegistration(action.payload));

  @Effect({dispatch: false}) pushTournamentPlayer = this.actions$
    .ofType(TOURNAMENT_PLAYER_PUSH_ACTION)
    .debug('TOURNAMENT_PLAYER_PUSH_ACTION')
    .map(action => this.tournamentService.pushTournamentPlayer(action.payload));

  @Effect({dispatch: false}) eraseTournamentPlayer = this.actions$
    .ofType(TOURNAMENT_PLAYER_ERASE_ACTION)
    .debug('TOURNAMENT_PLAYER_ERASE_ACTION')
    .map(action => this.tournamentService.eraseTournamentPlayer(action.payload));

  @Effect({dispatch: false}) pushArmyList = this.actions$
    .ofType(ARMY_LIST_PUSH_ACTION)
    .debug('ARMY_LIST_PUSH_ACTION')
    .map(action => this.tournamentService.pushArmyList(action.payload));

  @Effect({dispatch: false}) eraseArmyList = this.actions$
    .ofType(ARMY_LIST_ERASE_ACTION)
    .debug('ARMY_LIST_ERASE_ACTION')
    .map(action => this.tournamentService.eraseArmyList(action.payload));

  @Effect({dispatch: false}) pushNewTournamentPlayer = this.actions$
    .ofType(NEW_TOURNAMENT_PLAYER_PUSH_ACTION)
    .debug('NEW_TOURNAMENT_PLAYER_PUSH_ACTION')
    .map(action => this.tournamentService.pushNewTournamentPlayer(action.payload));

  constructor(
    private actions$: Actions,
    private tournamentService: TournamentService
  ) { }
}
