import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {TournamentService} from "../../service/tournament.service";
import {
  TOURNAMENT_LOAD_ACTION,
  TOURNAMENT_PUSH_ACTION,
  TOURNAMENTS_SUBSCRIBE_ACTION,
  TOURNAMENTS_UNSUBSCRIBE_ACTION
} from "../actions/tournament-actions";

@Injectable()
export class TournamentEffectService {

  constructor(
    private actions$: Actions,
    private tournamentService: TournamentService
  ) { }

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENTS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENTS_SUBSCRIBE_ACTION')
    .map(action => this.tournamentService.subscribeOnTournaments());

  @Effect({dispatch: false}) unsubscribe = this.actions$
    .ofType(TOURNAMENTS_UNSUBSCRIBE_ACTION)
    .debug('TOURNAMENTS_UNSUBSCRIBE_ACTION')
    .map(action => this.tournamentService.unsubscribeOnTournaments());

  @Effect({dispatch: false}) loadTournament = this.actions$
    .ofType(TOURNAMENT_LOAD_ACTION)
    .debug('TOURNAMENTS_UNSUBSCRIBE_ACTION')
    .map(action => this.tournamentService.unsubscribeOnTournaments());

  @Effect({dispatch: false}) pushTournament = this.actions$
    .ofType(TOURNAMENT_PUSH_ACTION)
    .debug('TOURNAMENT_PUSH_ACTION')
    .map(action => this.tournamentService.pushTournaments(action.payload));


}
