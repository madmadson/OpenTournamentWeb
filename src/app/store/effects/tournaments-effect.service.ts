import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TournamentsService} from '../../tournaments/tournaments.service';
import {
  CO_ORGANIZER_ADD_ACTION,
  CO_ORGANIZER_DELETE_ACTION, CoOrganizatorAddAction, CoOrganizatorDeleteAction,
  TOURNAMENT_PUSH_ACTION, TOURNAMENT_SET_ACTION, TournamentPushAction, TournamentSetAction
} from '../actions/tournaments-actions';

@Injectable()
export class TournamentsEffectService {


  @Effect({dispatch: false}) pushTournament = this.actions$
    .ofType(TOURNAMENT_PUSH_ACTION)
    .debug('TOURNAMENT_PUSH_ACTION')
    .map((action: TournamentPushAction) => this.tournamentService.pushTournament(action.payload));

  @Effect({dispatch: false}) setTournament = this.actions$
    .ofType(TOURNAMENT_SET_ACTION)
    .debug('TOURNAMENT_SET_ACTION')
    .map((action: TournamentSetAction) => this.tournamentService.setTournament(action.payload));

  @Effect({dispatch: false}) addCoOrganizer = this.actions$
    .ofType(CO_ORGANIZER_ADD_ACTION)
    .debug('CO_ORGANIZER_ADD_ACTION')
    .map((action: CoOrganizatorAddAction) => this.tournamentService.addCoOrganizer(action.payload));

  @Effect({dispatch: false}) deleteCoOrganizer = this.actions$
    .ofType(CO_ORGANIZER_DELETE_ACTION)
    .debug('CO_ORGANIZER_DELETE_ACTION')
    .map((action: CoOrganizatorDeleteAction) => this.tournamentService.deleteCoOrganizer(action.payload));


  constructor(
    private actions$: Actions,
    private tournamentService: TournamentsService
  ) { }
}
