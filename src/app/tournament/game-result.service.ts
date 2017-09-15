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


  gameResultEntered(gameResult: GameResult,
                    actualTournament: Tournament,
                    allPlayerRankings: TournamentRanking[],
                    allGames: TournamentGame[]) {

    const afoGames = this.afoDatabase.object('/tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGames.update(gameResult.gameAfter);

    this.updateRankingAfterGameResultEntered(gameResult, actualTournament.actualRound, false, allPlayerRankings, allGames, false);

  }

  teamGameResultEntered(gameResult: GameResult,
                        actualTournament: Tournament,
                        allPlayerRankings: TournamentRanking[],
                        allTeamRankings: TournamentRanking[],
                        allGames: TournamentGame[],
                        allTeamGames: TournamentGame[]) {

    const afoGame = this.afoDatabase.object('/tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGame.update(gameResult.gameAfter);

    this.updateTeamMatchAfterGameResultEntered(gameResult, allGames, allTeamGames);

    this.updateRankingAfterGameResultEntered(gameResult, actualTournament.actualRound, false, allPlayerRankings, allGames, false);

    this.updateTeamRankingAfterGameResultEntered(gameResult, actualTournament.actualRound, false, allTeamRankings, allGames, allTeamGames,  false);


  }

  private updateRankingAfterGameResultEntered(gameResult: GameResult,
                                              round: number,
                                              reset: boolean,
                                              allPlayerRankings: TournamentRanking[],
                                              allGames: TournamentGame[],
                                              debug: boolean) {

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

          if (debug) {
            console.log('update playerOne actual round: ' + gameResult.gameAfter.playerOnePlayerName +
              ' SC: ' + newScorePlayerOne + ' CP: ' + newCPPlayerOne + ' VP: ' + newVPPlayerOne);
          }

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


          if (debug) {
            console.log('update playerOne round after' + gameResult.gameAfter.playerOnePlayerName +
                        ' SC: ' + newScorePlayerOne + ' CP: ' + newCPPlayerOne + ' VP: ' + newVPPlayerOne);
          }

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

          if (debug) {
            console.log('update playerTwo actual round: ' + gameResult.gameAfter.playerTwoPlayerName +
              ' SC: ' + newScorePlayerTwo + ' CP: ' + newCPPlayerTwo + ' VP: ' + newVPPlayerTwo);
          }

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

          if (debug) {
            console.log('update playerTwo next round: ' + gameResult.gameAfter.playerTwoPlayerName +
              ' SC: ' + newScorePlayerTwo + ' CP: ' + newCPPlayerTwo + ' VP: ' + newVPPlayerTwo);
          }
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

        if (rankToUpdate.sos !== newSos) {
          const rankRef = that.afoDatabase.object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankToUpdate.id);
          rankRef.update({'sos': newSos});
        }

        if (debug) {
          console.log('update sos: ' + rankToUpdate.playerName +
            ' NewSos: ' + newSos);
        }
      });
    } // loop over game result round till actual rounds
  }

  updateTeamMatchAfterGameResultEntered(gameResult: GameResult,
                                        allGames: TournamentGame[],
                                        allTeamGames: TournamentGame[]) {

    const that = this;

    let teamMatchFinished = true;

    _.forEach(allGames, function (playerGame: TournamentGame) {

      if (playerGame.tournamentRound === gameResult.gameAfter.tournamentRound &&
        playerGame.playerOneTeamName === gameResult.gameAfter.playerOneTeamName) {

        if (!playerGame.finished) {
          teamMatchFinished = false;
        }
      }
    });

    let teamOneWon = 0;
    let teamTwoWon = 0;

    _.forEach(allTeamGames, function (teamMatch: TournamentGame) {

      if (teamMatch.tournamentRound === gameResult.gameAfter.tournamentRound &&
        (teamMatch.playerOnePlayerName === gameResult.gameAfter.playerOneTeamName ||
          teamMatch.playerOnePlayerName === gameResult.gameAfter.playerTwoTeamName)) {

        if (!gameResult.gameBefore.finished) {

          if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore) >
              (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore))) {

            teamOneWon = 1;
          }
          if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore) <
              (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore))) {

            teamTwoWon = 1;
          }

          const teamMatchRef = that.afoDatabase.object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);
          teamMatchRef.update({
            'playerOneIntermediateResult': teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore,
            'playerOneControlPoints': teamMatch.playerOneControlPoints + gameResult.gameAfter.playerOneControlPoints,
            'playerOneVictoryPoints': teamMatch.playerOneVictoryPoints + gameResult.gameAfter.playerOneVictoryPoints,
            'playerOneScore': teamMatchFinished ? teamOneWon : '0',
            'playerTwoIntermediateResult': teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore,
            'playerTwoControlPoints': teamMatch.playerTwoControlPoints + gameResult.gameAfter.playerTwoControlPoints,
            'playerTwoVictoryPoints': teamMatch.playerTwoVictoryPoints + gameResult.gameAfter.playerTwoVictoryPoints,
            'playerTwoScore': teamMatchFinished ? teamTwoWon : '0',
            'finished': teamMatchFinished
          });
        } else {

          if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore) >
              (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore))) {

            teamOneWon = 1;
          }
          if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore) <
              (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore))) {

            teamTwoWon = 1;
          }

          const teamMatchRef = that.afoDatabase.object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);
          teamMatchRef.update({
            'playerOneIntermediateResult': (teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore),
            'playerOneControlPoints': (teamMatch.playerOneControlPoints + gameResult.gameAfter.playerOneControlPoints - gameResult.gameBefore.playerOneControlPoints),
            'playerOneVictoryPoints': (teamMatch.playerOneVictoryPoints + gameResult.gameAfter.playerOneVictoryPoints - gameResult.gameBefore.playerOneVictoryPoints),
            'playerOneScore': teamMatchFinished ? teamOneWon : '0',
            'playerTwoIntermediateResult': (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore),
            'playerTwoControlPoints': (teamMatch.playerTwoControlPoints + gameResult.gameAfter.playerTwoControlPoints - gameResult.gameBefore.playerTwoControlPoints),
            'playerTwoVictoryPoints': (teamMatch.playerTwoVictoryPoints + gameResult.gameAfter.playerTwoVictoryPoints - gameResult.gameBefore.playerTwoVictoryPoints),
            'playerTwoScore': teamMatchFinished ? teamTwoWon : '0',
            'finished': teamMatchFinished
          });
        }
      }
    });
  }

  clearGameForTeamMatch(teamMatch: TournamentGame) {
    const tournamentTeamGamesRef = this.afoDatabase
      .object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);

    tournamentTeamGamesRef.update({
      'playerOneScore': 0,
      'playerOneIntermediateResult': 0,
      'playerOneControlPoints': 0,
      'playerOneVictoryPoints': 0,
      'playerTwoScore': 0,
      'playerTwoIntermediateResult': 0,
      'playerTwoControlPoints': 0,
      'playerTwoVictoryPoints': 0,
      'finished': false
    });
  }

  updateTeamRankingAfterGameResultEntered(gameResult: GameResult,
                                          round: number,
                                          reset: boolean,
                                          allTeamRankings: TournamentRanking[],
                                          allGames: TournamentGame[],
                                          allTeamGames: TournamentGame[],
                                          debug: boolean) {

    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    let teamMatchFinished = true;
    let teamOneScore = 0;
    let teamTwoScore = 0;

    _.forEach(allGames, function (playerGame: TournamentGame) {

      if (playerGame.tournamentRound === gameResult.gameAfter.tournamentRound &&
        playerGame.playerOneTeamName === gameResult.gameAfter.playerOneTeamName) {

        teamOneScore = teamOneScore + playerGame.playerOneScore;
        teamTwoScore = teamTwoScore + playerGame.playerTwoScore;


        if (!playerGame.finished) {
          teamMatchFinished = false;
        }
      }
    });


    for (let i = roundOfGameResult; i <= round; i++) {

      let lastRoundRankingTeamOne: TournamentRanking = undefined;
      let lastRoundRankingTeamTwo: TournamentRanking = undefined;
      let rankingTeamOne: TournamentRanking = undefined;
      let rankingTeamTwo: TournamentRanking = undefined;

      _.forEach(allTeamRankings, function (ranking: TournamentRanking) {


        if (ranking.tournamentRound === (i - 1) &&
          ranking.playerName === gameResult.gameAfter.playerOneTeamName) {
          lastRoundRankingTeamOne = ranking;
        }

        if (ranking.tournamentRound === (i - 1) &&
          ranking.playerName === gameResult.gameAfter.playerTwoTeamName) {
          lastRoundRankingTeamTwo = ranking;
        }

        if (ranking.tournamentRound === (i) &&
          ranking.playerName === gameResult.gameAfter.playerOneTeamName) {
          rankingTeamOne = ranking;
        }

        if (ranking.tournamentRound === (i) &&
          ranking.playerName === gameResult.gameAfter.playerTwoTeamName) {
          rankingTeamTwo = ranking;
        }

      });


      if (gameResult.gameAfter.playerOneTournamentPlayerId !== 'bye') {
        let newScoreTeamOne = 0;
        let newSecondScoreTeamOne = 0;
        let newCPTeamOne = 0;
        let newVPTeamOne = 0;
        let newListOfOpponentsIdsTeamOne = [];

        // if there is a round before add them
        if (lastRoundRankingTeamOne) {
          newScoreTeamOne = newScoreTeamOne + lastRoundRankingTeamOne.score;

          newListOfOpponentsIdsTeamOne =
            _.union(newListOfOpponentsIdsTeamOne, lastRoundRankingTeamOne.opponentTournamentPlayerIds);
        }

        if (i === gameResult.gameAfter.tournamentRound) {

          if (teamMatchFinished && !reset) {
            newScoreTeamOne = newScoreTeamOne + (teamOneScore > teamTwoScore ? 1 : 0);
          }

          if (!gameResult.gameBefore.finished) {
            newSecondScoreTeamOne = rankingTeamOne.secondScore + gameResult.gameAfter.playerOneScore;
            newCPTeamOne = rankingTeamOne.controlPoints + gameResult.gameAfter.playerOneControlPoints;
            newVPTeamOne = rankingTeamOne.victoryPoints + gameResult.gameAfter.playerOneVictoryPoints;
          } else {
            newSecondScoreTeamOne = rankingTeamOne.secondScore +
              gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore;
            newCPTeamOne = rankingTeamOne.controlPoints +
              gameResult.gameAfter.playerOneControlPoints - gameResult.gameBefore.playerOneControlPoints;
            newVPTeamOne = rankingTeamOne.victoryPoints +
              gameResult.gameAfter.playerOneVictoryPoints - gameResult.gameBefore.playerOneVictoryPoints;
          }

          if (reset) {
            let indexOfOpponentToRemove;
            if (rankingTeamTwo) {
              indexOfOpponentToRemove = _.findIndex(newListOfOpponentsIdsTeamOne, rankingTeamTwo.tournamentPlayerId);
            } else {
              indexOfOpponentToRemove = _.findIndex(newListOfOpponentsIdsTeamOne, 'bye');
            }
            newListOfOpponentsIdsTeamOne.splice(indexOfOpponentToRemove);
          } else if (rankingTeamTwo) {
            newListOfOpponentsIdsTeamOne.push(rankingTeamTwo.tournamentPlayerId);
          } else {
            newListOfOpponentsIdsTeamOne.push('bye');
          }

          const teamOneRankingRef = this.afoDatabase.object('/tournament-team-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingTeamOne.id);
          teamOneRankingRef.update(
            {
              score: newScoreTeamOne,
              secondScore: newSecondScoreTeamOne,
              controlPoints: newCPTeamOne,
              victoryPoints: newVPTeamOne,
              opponentTournamentPlayerIds: newListOfOpponentsIdsTeamOne
            });

          if (debug) {
            console.log('update ranking: ' + rankingTeamOne.teamName +
              ' score: ' + newScoreTeamOne);
          }
        }

        // there is a round after
        if (i > gameResult.gameAfter.tournamentRound) {

          const actualRoundTeamMatchTeamOne: TournamentGame = _.filter(allTeamGames, function (game: TournamentGame) {
            return (game.tournamentRound === (i) &&
              (game.playerOnePlayerName === gameResult.gameAfter.playerOneTeamName ||
                game.playerTwoPlayerName === gameResult.gameAfter.playerOneTeamName));
          })[0];

          if (actualRoundTeamMatchTeamOne) {

            if (gameResult.gameAfter.playerOneTeamName === actualRoundTeamMatchTeamOne.playerOnePlayerName) {
              newScoreTeamOne = lastRoundRankingTeamOne.score + actualRoundTeamMatchTeamOne.playerOneScore;
              newSecondScoreTeamOne = lastRoundRankingTeamOne.secondScore + actualRoundTeamMatchTeamOne.playerOneIntermediateResult;
              newCPTeamOne = lastRoundRankingTeamOne.controlPoints + actualRoundTeamMatchTeamOne.playerOneControlPoints;
              newVPTeamOne = lastRoundRankingTeamOne.victoryPoints + actualRoundTeamMatchTeamOne.playerOneVictoryPoints;
            } else {
              newScoreTeamOne = lastRoundRankingTeamOne.score + actualRoundTeamMatchTeamOne.playerTwoScore;
              newSecondScoreTeamOne = lastRoundRankingTeamOne.secondScore + actualRoundTeamMatchTeamOne.playerTwoIntermediateResult;
              newCPTeamOne = lastRoundRankingTeamOne.controlPoints + actualRoundTeamMatchTeamOne.playerTwoControlPoints;
              newVPTeamOne = lastRoundRankingTeamOne.victoryPoints + actualRoundTeamMatchTeamOne.playerTwoVictoryPoints;
            }

            const playerOneRankingRef = this.afoDatabase
              .object('tournament-team-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingTeamOne.id);

            playerOneRankingRef.update(
              {
                score: newScoreTeamOne,
                secondScore: newSecondScoreTeamOne,
                controlPoints: newCPTeamOne,
                victoryPoints: newVPTeamOne,
              });

            if (debug) {
              console.log('update ranking: next round: ' + rankingTeamOne.teamName +
                ' score: ' + newScoreTeamOne);
            }
          }
        }
      }
      if (gameResult.gameAfter.playerTwoTournamentPlayerId !== 'bye') {

        let newScoreTeamTwo = 0;
        let newSecondScoreTeamTwo = 0;
        let newCPTeamTwo = 0;
        let newVPTeamTwo = 0;
        let newListOfOpponentsIdsTeamTwo = [];

        // if there is a round before add it
        if (lastRoundRankingTeamTwo) {
          newScoreTeamTwo = newScoreTeamTwo + lastRoundRankingTeamTwo.score;

          newListOfOpponentsIdsTeamTwo =
            _.union(newListOfOpponentsIdsTeamTwo, lastRoundRankingTeamTwo.opponentTournamentPlayerIds);
        }

        // the actual round where the result is entered
        if (i === gameResult.gameAfter.tournamentRound) {

          if (teamMatchFinished && !reset) {
            newScoreTeamTwo = newScoreTeamTwo + (teamOneScore < teamTwoScore ? 1 : 0);
          }

          if (!gameResult.gameBefore.finished) {
            newSecondScoreTeamTwo = rankingTeamTwo.secondScore + gameResult.gameAfter.playerTwoScore;
            newCPTeamTwo = rankingTeamTwo.controlPoints + gameResult.gameAfter.playerTwoControlPoints;
            newVPTeamTwo = newVPTeamTwo + rankingTeamTwo.victoryPoints + gameResult.gameAfter.playerTwoVictoryPoints;
          } else {
            newSecondScoreTeamTwo = rankingTeamTwo.secondScore +
              gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore;
            newCPTeamTwo = rankingTeamTwo.controlPoints +
              gameResult.gameAfter.playerTwoControlPoints - gameResult.gameBefore.playerTwoControlPoints;
            newVPTeamTwo = rankingTeamTwo.victoryPoints +
              gameResult.gameAfter.playerTwoVictoryPoints - gameResult.gameBefore.playerTwoVictoryPoints;
          }

          if (reset) {
            let indexOfOpponentToRemove;
            if (rankingTeamOne) {
              indexOfOpponentToRemove = _.findIndex(newListOfOpponentsIdsTeamTwo, rankingTeamOne.tournamentPlayerId);
            } else {
              indexOfOpponentToRemove = _.findIndex(newListOfOpponentsIdsTeamTwo, 'bye');
            }
            newListOfOpponentsIdsTeamTwo.splice(indexOfOpponentToRemove);
          } else if (rankingTeamOne) {
            newListOfOpponentsIdsTeamTwo.push(rankingTeamOne.tournamentPlayerId);
          } else {
            newListOfOpponentsIdsTeamTwo.push('bye');
          }


          const playerTwoRankingRef = this.afoDatabase
            .object('tournament-team-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingTeamTwo.id);
          playerTwoRankingRef.update(
            {
              score: newScoreTeamTwo,
              secondScore: newSecondScoreTeamTwo,
              controlPoints: newCPTeamTwo,
              victoryPoints: newVPTeamTwo,
              opponentTournamentPlayerIds: newListOfOpponentsIdsTeamTwo
            });

          if (debug) {
            console.log('update ranking: ' + rankingTeamTwo.teamName +
              ' score: ' + newScoreTeamTwo);
          }
        }


        if (i > gameResult.gameAfter.tournamentRound) {

          const actualRoundTeamMatchTeamTwo: TournamentGame = _.filter(allTeamGames, function (game: TournamentGame) {
            return (game.tournamentRound === (i) &&
              (game.playerOnePlayerName === gameResult.gameAfter.playerTwoTeamName ||
                game.playerTwoPlayerName === gameResult.gameAfter.playerTwoTeamName));
          })[0];

          if (actualRoundTeamMatchTeamTwo) {

            if (gameResult.gameAfter.playerTwoTeamName === actualRoundTeamMatchTeamTwo.playerOnePlayerName) {
              newScoreTeamTwo = lastRoundRankingTeamTwo.score + actualRoundTeamMatchTeamTwo.playerOneScore;
              newSecondScoreTeamTwo = lastRoundRankingTeamTwo.secondScore + actualRoundTeamMatchTeamTwo.playerOneIntermediateResult;
              newCPTeamTwo = lastRoundRankingTeamTwo.controlPoints + actualRoundTeamMatchTeamTwo.playerOneControlPoints;
              newVPTeamTwo = lastRoundRankingTeamTwo.victoryPoints + actualRoundTeamMatchTeamTwo.playerOneVictoryPoints;
            } else {
              newScoreTeamTwo = lastRoundRankingTeamTwo.score + actualRoundTeamMatchTeamTwo.playerTwoScore;
              newSecondScoreTeamTwo = lastRoundRankingTeamTwo.secondScore + actualRoundTeamMatchTeamTwo.playerTwoIntermediateResult;
              newCPTeamTwo = lastRoundRankingTeamTwo.controlPoints + actualRoundTeamMatchTeamTwo.playerTwoControlPoints;
              newVPTeamTwo = lastRoundRankingTeamTwo.victoryPoints + actualRoundTeamMatchTeamTwo.playerTwoVictoryPoints;
            }

            const teamTwoRankingRef = this.afoDatabase
              .object('tournament-team-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingTeamTwo.id);
            teamTwoRankingRef.update(
              {
                score: newScoreTeamTwo,
                secondScore: newSecondScoreTeamTwo,
                controlPoints: newCPTeamTwo,
                victoryPoints: newVPTeamTwo,
              });

            if (debug) {
              console.log('update ranking: next round' + rankingTeamTwo.teamName +
                ' score: ' + newScoreTeamTwo);
            }
          }
        }
      }
    }
  }
}
