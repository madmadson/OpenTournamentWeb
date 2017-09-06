

import {Tournament} from '../model/tournament';
import {GameResult} from './game-result';
import {TournamentRanking} from '../model/tournament-ranking';
import {TournamentGame} from '../model/tournament-game';

export class RankingUpdateModel {


  gameResult: GameResult;
  actualTournament: Tournament;

  allRankings: TournamentRanking[];
  allGames: TournamentGame[];

  reset: boolean;
}
