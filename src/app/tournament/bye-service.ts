import {Injectable} from '@angular/core';
import {getGameVsBye, TournamentGame} from '../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentPlayer} from '../../../shared/model/tournament-player';

import * as _ from 'lodash';

@Injectable()
export class ByeService {

  constructor(private afoDatabase: AngularFireOfflineDatabase) {
  }

  handlePlayerOneIsBye(game: TournamentGame, rankingsForRound: TournamentRanking[]) {

    const that = this;

    if (game.playerOneTournamentPlayerId === 'bye') {
      game.playerTwoScore = 1;
      game.playerTwoControlPoints = 3;
      game.playerTwoVictoryPoints = 38;
      game.finished = true;

      _.forEach(rankingsForRound, function (ranking: TournamentRanking) {

        if (ranking.tournamentPlayerId === game.playerTwoTournamentPlayerId) {
          const playerTwoRankingRef = that.afoDatabase
            .object('tournament-rankings/' + game.tournamentId + '/' + ranking.id);
          playerTwoRankingRef.update(
            {
              score: (ranking.score + 1),
              controlPoints: (ranking.controlPoints + 3),
              victoryPoints: (ranking.controlPoints + 38),
            });
        }
      });
    }
  }

  handlePlayerTwoIsBye(game: TournamentGame, rankingsForRound: TournamentRanking[]) {

    const that = this;

    if (game.playerTwoTournamentPlayerId === 'bye') {
      game.playerOneScore = 1;
      game.playerOneControlPoints = 3;
      game.playerOneVictoryPoints = 38;
      game.finished = true;

      _.forEach(rankingsForRound, function (ranking: TournamentRanking) {

        if (ranking.tournamentPlayerId === game.playerOneTournamentPlayerId) {
          const playerTwoRankingRef = that.afoDatabase
            .object('tournament-rankings/' + game.tournamentId + '/' + ranking.id);
          playerTwoRankingRef.update(
            {
              score: (ranking.score + 1),
              controlPoints: (ranking.controlPoints + 3),
              victoryPoints: (ranking.controlPoints + 38),
            });
        }
      });
    }
  }

  handleTeamOneIsBye(teamMatch: TournamentGame,
                     teamTwoPlayers: TournamentPlayer[],
                     rankingsForRound: TournamentRanking[]) {

    const that = this;

    const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);

    _.forEach(teamTwoPlayers, function (playerTeamTwo: TournamentPlayer, index: number) {
      const newPlayerGame = getGameVsBye(playerTeamTwo, true, teamMatch.tournamentRound, index);

      console.log('newByeGame: ' + JSON.stringify(newPlayerGame));

      teamGamesRef.push(newPlayerGame);
      that.handlePlayerOneIsBye(newPlayerGame, rankingsForRound);
    });

  }

  handleTeamTwoIsBye(teamMatch: TournamentGame,
                     teamOnePlayers: TournamentPlayer[],
                     rankingsForRound: TournamentRanking[]) {

    const that = this;

    const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);


    _.forEach(teamOnePlayers, function (playerTeamTwo: TournamentPlayer, index: number) {
      const newPlayerGame = getGameVsBye(playerTeamTwo, false, teamMatch.tournamentRound, index);

      console.log('newByeGame: ' + JSON.stringify(newPlayerGame));

      teamGamesRef.push(newPlayerGame);
      that.handlePlayerOneIsBye(newPlayerGame, rankingsForRound);
    });

  }

}
