

import {Injectable} from '@angular/core';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {GameResult} from '../../../shared/dto/game-result';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {Tournament} from '../../../shared/model/tournament';

@Injectable()
export class GameResultService {

  constructor(private afoDatabase: AngularFireOfflineDatabase) {

  }


  gameResultEntered(gameResult: GameResult, actualTournament: Tournament, allPlayerRankings: TournamentRanking[],
                    allGames: TournamentGame[]) {

    const afoGames = this.afoDatabase.object('/tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGames.update(gameResult.gameAfter);

    this.updateRankingAfterGameResultEntered(gameResult, actualTournament.actualRound, false, allPlayerRankings, allGames);


  }

  private updateRankingAfterGameResultEntered(gameResult: GameResult,
                                              round: number,
                                              reset: boolean,
                                              allPlayerRankings: TournamentRanking[],
                                              allGames: TournamentGame[]) {

    const that = this;
    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    const gameResultChangedForPlayerMap = {};

    for (let i = roundOfGameResult; i <= round; i++) {

      const allRankingsFromSameRound: TournamentRanking[] = [];
      let lastRoundRankingPlayerOne: TournamentRanking = undefined;
      let lastRoundRankingPlayerTwo: TournamentRanking = undefined;
      let rankingPlayerOne: TournamentRanking = undefined;
      let rankingPlayerTwo: TournamentRanking = undefined;

      _.forEach(allPlayerRankings, function (ranking: TournamentRanking) {

        if (ranking.tournamentRound === i) {
          allRankingsFromSameRound.push(ranking);
        }

        if (ranking.tournamentRound === (i - 1) &&
            ranking.tournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId) {
          lastRoundRankingPlayerOne = ranking;
        }

        if (ranking.tournamentRound === (i - 1) &&
          ranking.tournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId) {
          lastRoundRankingPlayerTwo = ranking;
        }

        if (ranking.tournamentRound === (i) &&
          ranking.tournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId) {
          rankingPlayerOne = ranking;
        }

        if (ranking.tournamentRound === (i) &&
          ranking.tournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId) {
          rankingPlayerTwo = ranking;
        }

      });

      let actualRoundGamePlayerOne: TournamentGame = undefined;
      let actualRoundGamePlayerTwo: TournamentGame = undefined;

       _.forEach(allGames, function (game: TournamentGame) {
          if (game.tournamentRound === (i) &&
            (game.playerOneTournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId ||
              game.playerTwoTournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId)) {
            actualRoundGamePlayerOne = game;
          }
          if (game.tournamentRound === (i) &&
              (game.playerOneTournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId ||
                game.playerTwoTournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId)) {
            actualRoundGamePlayerTwo = game;
          }
      });


      const scoreTournamentPlayerMap = {};
      const opponentIdsTournamentPlayerMap = {};
      _.forEach(allRankingsFromSameRound, function (ranking: TournamentRanking) {
        scoreTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.score;
        opponentIdsTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.opponentTournamentPlayerIds;
      });



      if (gameResult.gameAfter.playerOneTournamentPlayerId !== 'bye') {

        let newScorePlayerOne = 0;
        let newCPPlayerOne = 0;
        let newVPPlayerOne = 0;
        let newListOfOpponentsIdsPlayerOne = [];

        // if there is a round before add them
        if (lastRoundRankingPlayerOne) {
          newScorePlayerOne = newScorePlayerOne + lastRoundRankingPlayerOne.score;
          newCPPlayerOne = newCPPlayerOne + lastRoundRankingPlayerOne.controlPoints;
          newVPPlayerOne = newVPPlayerOne + lastRoundRankingPlayerOne.victoryPoints;

          newListOfOpponentsIdsPlayerOne =
            _.union(newListOfOpponentsIdsPlayerOne, lastRoundRankingPlayerOne.opponentTournamentPlayerIds);
        }

        if (i === gameResult.gameAfter.tournamentRound) {

          newScorePlayerOne = newScorePlayerOne + gameResult.gameAfter.playerOneScore;
          newCPPlayerOne = newCPPlayerOne + gameResult.gameAfter.playerOneControlPoints;
          newVPPlayerOne = newVPPlayerOne + gameResult.gameAfter.playerOneVictoryPoints;

          if (reset) {
            const indexOfOpponentToRemove = _.findIndex(newListOfOpponentsIdsPlayerOne, gameResult.gameAfter.playerTwoTournamentPlayerId);
            newListOfOpponentsIdsPlayerOne.splice(indexOfOpponentToRemove);
          } else {
            newListOfOpponentsIdsPlayerOne.push(gameResult.gameAfter.playerTwoTournamentPlayerId);
            opponentIdsTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] = newListOfOpponentsIdsPlayerOne;
          }

          const playerOneRankingRef = this.afoDatabase.object('/tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerOne.id);
          playerOneRankingRef.update(
            {
              score: newScorePlayerOne,
              controlPoints: newCPPlayerOne,
              victoryPoints: newVPPlayerOne,
              opponentTournamentPlayerIds: newListOfOpponentsIdsPlayerOne
            });

          if (!gameResult.gameBefore.finished) {
            scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] = newScorePlayerOne;

          } else if (gameResult.gameBefore.playerOneScore < gameResult.gameAfter.playerOneScore) {
            scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] =
              scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] + 1;

            // for later rounds SOS
            gameResultChangedForPlayerMap[rankingPlayerOne.tournamentPlayerId] = 1;
          } else if (gameResult.gameBefore.playerOneScore > gameResult.gameAfter.playerOneScore) {
            scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] =
              scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] - 1;

            // for later rounds SOS
            gameResultChangedForPlayerMap[rankingPlayerOne.tournamentPlayerId] = -1;
          }
        }

        // there is a round after
        if (i > gameResult.gameAfter.tournamentRound && actualRoundGamePlayerOne) {
          if (gameResult.gameAfter.playerOneTournamentPlayerId === actualRoundGamePlayerOne.playerOneTournamentPlayerId) {
            newScorePlayerOne = lastRoundRankingPlayerOne.score + actualRoundGamePlayerOne.playerOneScore;
            newCPPlayerOne = lastRoundRankingPlayerOne.controlPoints + actualRoundGamePlayerOne.playerOneControlPoints;
            newVPPlayerOne = lastRoundRankingPlayerOne.victoryPoints + actualRoundGamePlayerOne.playerOneVictoryPoints;
          } else {
            newScorePlayerOne = lastRoundRankingPlayerOne.score + actualRoundGamePlayerOne.playerTwoScore;
            newCPPlayerOne = lastRoundRankingPlayerOne.controlPoints + actualRoundGamePlayerOne.playerTwoControlPoints;
            newVPPlayerOne = lastRoundRankingPlayerOne.victoryPoints + actualRoundGamePlayerOne.playerTwoVictoryPoints;
          }

          const playerOneRankingRef = this.afoDatabase
            .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerOne.id);

          playerOneRankingRef.update(
            {
              score: newScorePlayerOne,
              controlPoints: newCPPlayerOne,
              victoryPoints: newVPPlayerOne,
            });
        }
      }

      if (gameResult.gameAfter.playerTwoTournamentPlayerId !== 'bye') {

        let newScorePlayerTwo = 0;
        let newCPPlayerTwo = 0;
        let newVPPlayerTwo = 0;
        let newListOfOpponentsIdsPlayerTwo = [];

        // if there is a round before add it
        if (lastRoundRankingPlayerTwo) {
          newScorePlayerTwo = newScorePlayerTwo + lastRoundRankingPlayerTwo.score;
          newCPPlayerTwo = newCPPlayerTwo + lastRoundRankingPlayerTwo.controlPoints;
          newVPPlayerTwo = newVPPlayerTwo + lastRoundRankingPlayerTwo.victoryPoints;

          newListOfOpponentsIdsPlayerTwo =
            _.union(newListOfOpponentsIdsPlayerTwo, lastRoundRankingPlayerTwo.opponentTournamentPlayerIds);
        }

        // the actual round where the result is entered
        if (i === gameResult.gameAfter.tournamentRound) {

          newScorePlayerTwo = newScorePlayerTwo + gameResult.gameAfter.playerTwoScore;
          newCPPlayerTwo = newCPPlayerTwo + gameResult.gameAfter.playerTwoControlPoints;
          newVPPlayerTwo = newVPPlayerTwo + gameResult.gameAfter.playerTwoVictoryPoints;

          if (reset) {
            const indexOfOpponentToRemove = _.findIndex(newListOfOpponentsIdsPlayerTwo, gameResult.gameAfter.playerOneTournamentPlayerId);
            newListOfOpponentsIdsPlayerTwo.splice(indexOfOpponentToRemove);
          } else {
            newListOfOpponentsIdsPlayerTwo.push(gameResult.gameAfter.playerOneTournamentPlayerId);
            opponentIdsTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] = newListOfOpponentsIdsPlayerTwo;
          }

          const playerTwoRankingRef = this.afoDatabase
            .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerTwo.id);
          playerTwoRankingRef.update(
            {
              score: newScorePlayerTwo,
              controlPoints: newCPPlayerTwo,
              victoryPoints: newVPPlayerTwo,
              opponentTournamentPlayerIds: newListOfOpponentsIdsPlayerTwo
            });

          if (!gameResult.gameBefore.finished) {
            scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] = newScorePlayerTwo;
          } else if (gameResult.gameBefore.playerTwoScore < gameResult.gameAfter.playerTwoScore) {
            scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] =
              scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] + 1;

            // for later rounds SOS
            gameResultChangedForPlayerMap[rankingPlayerTwo.tournamentPlayerId] = 1;
          } else if (gameResult.gameBefore.playerTwoScore > gameResult.gameAfter.playerTwoScore) {
            scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] =
              scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] - 1;

            // for later rounds SOS
            gameResultChangedForPlayerMap[rankingPlayerTwo.tournamentPlayerId] = -1;
          }
        }


        if (i > gameResult.gameAfter.tournamentRound && actualRoundGamePlayerTwo) {
          if (gameResult.gameAfter.playerTwoTournamentPlayerId === actualRoundGamePlayerTwo.playerOneTournamentPlayerId) {
            newScorePlayerTwo = lastRoundRankingPlayerTwo.score + actualRoundGamePlayerTwo.playerOneScore;
            newCPPlayerTwo = lastRoundRankingPlayerTwo.controlPoints + actualRoundGamePlayerTwo.playerOneControlPoints;
            newVPPlayerTwo = lastRoundRankingPlayerTwo.victoryPoints + actualRoundGamePlayerTwo.playerOneVictoryPoints;
          } else {
            newScorePlayerTwo = lastRoundRankingPlayerTwo.score + actualRoundGamePlayerTwo.playerTwoScore;
            newCPPlayerTwo = lastRoundRankingPlayerTwo.controlPoints + actualRoundGamePlayerTwo.playerTwoControlPoints;
            newVPPlayerTwo = lastRoundRankingPlayerTwo.victoryPoints + actualRoundGamePlayerTwo.playerTwoVictoryPoints;
          }

          const playerTwoRankingRef = this.afoDatabase
            .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerTwo.id);
          playerTwoRankingRef.update(
            {
              score: newScorePlayerTwo,
              controlPoints: newCPPlayerTwo,
              victoryPoints: newVPPlayerTwo,
            });
        }
      }

      // SOS calculation for round
      _.forEach(allRankingsFromSameRound, function (rankToUpdate: TournamentRanking) {

        let newSos = 0;
        _.forEach(opponentIdsTournamentPlayerMap[rankToUpdate.tournamentPlayerId], function (opponentTournamentPlayerId: string) {
          const opponentScore: number = scoreTournamentPlayerMap[opponentTournamentPlayerId];
          if (opponentScore) {
            newSos = newSos + opponentScore;

            // game result changed so later rounds sos are affected
            if (gameResultChangedForPlayerMap[opponentTournamentPlayerId] && i > gameResult.gameAfter.tournamentRound) {
              newSos = newSos + gameResultChangedForPlayerMap[opponentTournamentPlayerId];
            }
          }
        });

        const rankRef = that.afoDatabase.object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankToUpdate.id);
        rankRef.update({'sos': newSos});

      });
    } // loop over game result round till actual rounds
  }
}
