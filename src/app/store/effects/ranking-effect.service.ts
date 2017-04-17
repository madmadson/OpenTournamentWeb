import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  ARMY_LIST_ERASE_ACTION,
  ARMY_LIST_PUSH_ACTION, TOURNAMENT_PLAYER_PUSH_ACTION,
  REGISTRATION_ERASE_ACTION,
  REGISTRATION_PUSH_ACTION, START_TOURNAMENT_ACTION, TOURNAMENT_PLAYER_ERASE_ACTION, REGISTRATION_ACCEPT_ACTION,
  TOURNAMENT_SUBSCRIBE_ACTION,
  TOURNAMENT_UNSUBSCRIBE_ACTION
} from '../actions/tournament-actions';
import {TournamentService} from '../../service/tournament.service';
import {TournamentRankingService} from "../../service/tournament-ranking.service";
import {TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION} from "../actions/tournament-rankings-actions";


@Injectable()
export class RankingEffectService {

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION')
    .map(action => this.rankingService.subscribeOnTournamentRankings(action.payload));


  constructor(
    private actions$: Actions,
    private rankingService: TournamentRankingService
  ) { }
}
