import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TournamentsService} from '../../service/tournaments.service';
import {
  TOURNAMENT_PUSH_ACTION, TOURNAMENT_SET_ACTION,
  TOURNAMENTS_SUBSCRIBE_ACTION,
  TOURNAMENTS_UNSUBSCRIBE_ACTION
} from '../actions/tournaments-actions';

@Injectable()
export class TournamentsEffectService {


  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENTS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENTS_SUBSCRIBE_ACTION')
    .map(action => this.tournamentService.subscribeOnTournaments());

  @Effect({dispatch: false}) unsubscribe = this.actions$
    .ofType(TOURNAMENTS_UNSUBSCRIBE_ACTION)
    .debug('TOURNAMENTS_UNSUBSCRIBE_ACTION')
    .map(action => this.tournamentService.unsubscribeOnTournaments());


  @Effect({dispatch: false}) pushTournament = this.actions$
    .ofType(TOURNAMENT_PUSH_ACTION)
    .debug('TOURNAMENT_PUSH_ACTION')
    .map(action => this.tournamentService.pushTournament(action.payload));

  @Effect({dispatch: false}) setTournament = this.actions$
    .ofType(TOURNAMENT_SET_ACTION)
    .debug('TOURNAMENT_SET_ACTION')
    .map(action => this.tournamentService.setTournament(action.payload));


  constructor(
    private actions$: Actions,
    private tournamentService: TournamentsService
  ) { }



}
