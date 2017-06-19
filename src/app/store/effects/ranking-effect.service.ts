import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {TournamentRankingService} from '../../service/tournament-ranking.service';
import {TOURNAMENT_RANKINGS_SUBSCRIBE_ACTION} from '../actions/tournament-rankings-actions';

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
