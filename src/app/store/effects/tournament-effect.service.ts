import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  ARMY_LIST_ERASE_ACTION,
  ARMY_LIST_PUSH_ACTION, TOURNAMENT_PLAYER_PUSH_ACTION,
  REGISTRATION_ERASE_ACTION,
  REGISTRATION_PUSH_ACTION, TOURNAMENT_PLAYER_ERASE_ACTION, REGISTRATION_ACCEPT_ACTION,
  TOURNAMENT_SUBSCRIBE_ACTION,
  TOURNAMENT_UNSUBSCRIBE_ACTION, TOURNAMENT_PAIR_AGAIN_ACTION,
  GAME_RESULT_ENTERED_ACTION, TOURNAMENT_NEW_ROUND_ACTION, ADD_DUMMY_PLAYER_ACTION, PUBLISH_ROUND_ACTION,
  TOURNAMENT_KILL_ROUND_ACTION, END_TOURNAMENT_ACTION, UNDO_TOURNAMENT_END_ACTION, SWAP_PLAYER_ACTION
} from '../actions/tournament-actions';
import {TournamentService} from '../../service/tournament.service';


@Injectable()
export class TournamentEffectService {

  @Effect({dispatch: false}) endTournament = this.actions$
    .ofType(END_TOURNAMENT_ACTION)
    .debug('END_TOURNAMENT_ACTION')
    .map(action => this.tournamentService.endTournament(action.payload));

  @Effect({dispatch: false}) pairNewRound = this.actions$
    .ofType(TOURNAMENT_NEW_ROUND_ACTION)
    .debug('TOURNAMENT_NEW_ROUND_ACTION')
    .map(action => this.tournamentService.pairNewRound(action.payload));

  @Effect({dispatch: false}) killRound = this.actions$
    .ofType(TOURNAMENT_KILL_ROUND_ACTION)
    .debug('TOURNAMENT_KILL_ROUND_ACTION')
    .map(action => this.tournamentService.killRound(action.payload));

  @Effect({dispatch: false}) undoTournamentEnd = this.actions$
    .ofType(UNDO_TOURNAMENT_END_ACTION)
    .debug('UNDO_TOURNAMENT_END_ACTION')
    .map(action => this.tournamentService.undoTournamentEnd(action.payload));

  @Effect({dispatch: false}) addDummyPlayer = this.actions$
    .ofType(ADD_DUMMY_PLAYER_ACTION)
    .debug('ADD_DUMMY_PLAYER_ACTION')
    .map(action => this.tournamentService.addDummyPlayer(action.payload));


  @Effect({dispatch: false}) gameResultEntered = this.actions$
    .ofType(GAME_RESULT_ENTERED_ACTION)
    .debug('GAME_RESULT_ENTERED_ACTION')
    .map(action => this.tournamentService.gameResultEntered(action.payload));

  @Effect({dispatch: false}) swapPlayer = this.actions$
    .ofType(SWAP_PLAYER_ACTION)
    .debug('SWAP_PLAYER_ACTION')
    .map(action => this.tournamentService.swapPlayer(action.payload));

  @Effect({dispatch: false}) publishRound = this.actions$
    .ofType(PUBLISH_ROUND_ACTION)
    .debug('PUBLISH_ROUND_ACTION')
    .map(action => this.tournamentService.publishRound(action.payload));

  @Effect({dispatch: false}) pairAgainTournament = this.actions$
    .ofType(TOURNAMENT_PAIR_AGAIN_ACTION)
    .debug('TOURNAMENT_PAIR_AGAIN_ACTION')
    .map(action => this.tournamentService.pairAgainTournament(action.payload));


  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENT_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_SUBSCRIBE_ACTION')
    .map(action => this.tournamentService.subscribeOnTournament(action.payload));


  @Effect({dispatch: false}) pushRegistartion = this.actions$
    .ofType(REGISTRATION_PUSH_ACTION)
    .debug('REGISTRATION_PUSH_ACTION')
    .map(action => this.tournamentService.pushRegistration(action.payload));

  @Effect({dispatch: false}) eraseRegistartion = this.actions$
    .ofType(REGISTRATION_ERASE_ACTION)
    .debug('REGISTRATION_ERASE_ACTION')
    .map(action => this.tournamentService.eraseRegistration(action.payload));

  @Effect({dispatch: false}) pushTournamentPlayer = this.actions$
    .ofType(REGISTRATION_ACCEPT_ACTION)
    .debug('REGISTRATION_ACCEPT_ACTION')
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
    .ofType(TOURNAMENT_PLAYER_PUSH_ACTION)
    .debug('TOURNAMENT_PLAYER_PUSH_ACTION')
    .map(action => this.tournamentService.pushNewTournamentPlayer(action.payload));

  constructor(
    private actions$: Actions,
    private tournamentService: TournamentService
  ) { }
}
