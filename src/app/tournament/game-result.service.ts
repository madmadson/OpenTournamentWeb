import {Injectable} from '@angular/core';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {GameResult} from '../../../shared/dto/game-result';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {Tournament} from '../../../shared/model/tournament';
import {TeamGameResult} from '../../../shared/dto/team-game-result';

@Injectable()
export class GameResultService {

  constructor(private afoDatabase: AngularFireOfflineDatabase) {

  }


  public gameResultEntered(gameResult: GameResult,
                           actualTournament: Tournament,
                           allPlayerRankings: TournamentRanking[],
                           allGames: TournamentGame[],
                           clearGame: boolean) {

    const afoGames = this.afoDatabase.object('/tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGames.update(gameResult.gameAfter);

    this.updatePlayerRankingAfterGameResultEntered(gameResult, actualTournament.actualRound, clearGame, allPlayerRankings, allGames, true);

  }

  public teamGameResultEntered(teamGameResult: TeamGameResult,
                               actualTournament: Tournament,
                               allPlayerRankings: TournamentRanking[],
                               allTeamRankings: TournamentRanking[],
                               allGames: TournamentGame[],
                               clearGame: boolean) {

    console.log('team result entered');

    const afoGame = this.afoDatabase.object('/tournament-games/' + teamGameResult.gameAfter.tournamentId + '/' + teamGameResult.gameAfter.id);
    afoGame.update(teamGameResult.gameAfter);

    const teamMatchState: TeamMatchState = this.determineTeamMatchState(teamGameResult, allGames);

    this.updateTeamMatchAfterGameResultEntered(teamMatchState, teamGameResult);
    this.updatePlayerRankingAfterGameResultEntered({
      gameBefore: teamGameResult.gameBefore,
      gameAfter: teamGameResult.gameAfter
    }, actualTournament.actualRound, clearGame, allPlayerRankings, allGames, false);
    this.updateTeamRankingAfterGameResultEntered(teamMatchState,
      teamGameResult, actualTournament.actualRound, clearGame,
      allTeamRankings, true);
  }

  // USE THIS ONLY FOR Testing
  public generatedTeamGameResultEntered(teamGameResult: TeamGameResult,
                                        actualTournament: Tournament,
                                        allPlayerRankings: TournamentRanking[],
                                        allTeamRankings: TournamentRanking[],
                                        allGames: TournamentGame[]) {

    console.log('generated team result entered');

    const afoGame = this.afoDatabase.object('/tournament-games/' + teamGameResult.gameAfter.tournamentId + '/' + teamGameResult.gameAfter.id);
    afoGame.update(teamGameResult.gameAfter);

    // HACKY <3
    const teamMatchState: TeamMatchState = {
      teamOneWon: teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore >
                  teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore ? 1 : 0,
      teamTwoWon: teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore <
                  teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore ? 1 : 0,
      teamMatchFinished: true
    };

    const teamGameResult2 = _.cloneDeep(teamGameResult);

    teamGameResult2.gameAfter.playerOneIntermediateResult = teamGameResult.teamMatch.playerOneIntermediateResult;
    teamGameResult2.gameAfter.playerTwoIntermediateResult = teamGameResult.teamMatch.playerTwoIntermediateResult;

    this.updateTeamMatchAfterGameResultEntered(teamMatchState, teamGameResult2);
    this.updatePlayerRankingAfterGameResultEntered({
      gameBefore: teamGameResult.gameBefore,
      gameAfter: teamGameResult.gameAfter
    }, actualTournament.actualRound, false, allPlayerRankings, allGames, false);

    // HACKY <3
    teamGameResult.gameAfter.playerOneScore = teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore;
    teamGameResult.gameAfter.playerTwoScore = teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore;

    this.updateTeamRankingAfterGameResultEntered(teamMatchState,
      teamGameResult, actualTournament.actualRound, false,
      allTeamRankings, true);
  }

  private determineTeamMatchState(teamGameResult: TeamGameResult,
                                  allGames: TournamentGame[]): TeamMatchState {

    let teamMatchFinished = true;

    _.forEach(allGames, function (playerGame: TournamentGame) {

      if (playerGame.tournamentRound === teamGameResult.gameAfter.tournamentRound &&
        playerGame.playerOneTeamName === teamGameResult.gameAfter.playerOneTeamName &&
        playerGame.playerOneTournamentPlayerId !== teamGameResult.gameAfter.playerOneTournamentPlayerId) {

        if (!playerGame.finished) {
          console.log(' found unfinished game:' + JSON.stringify(playerGame));
          teamMatchFinished = false;
        }
      }
    });

    let teamOneWon = 0;
    let teamTwoWon = 0;

    if (teamGameResult.gameBefore.finished) {
      if (teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore - teamGameResult.gameBefore.playerOneScore >
        teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore - teamGameResult.gameBefore.playerTwoScore) {
        teamOneWon = 1;
      } else if (teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore - teamGameResult.gameBefore.playerOneScore <
        teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore - teamGameResult.gameBefore.playerTwoScore) {
        teamTwoWon = 1;
      }
    } else {
      if (teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore >
        teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore) {
        teamOneWon = 1;
      } else if (teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore <
        teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore) {
        teamTwoWon = 1;
      }
    }
    return {
      teamMatchFinished: teamMatchFinished,
      teamOneWon: teamOneWon,
      teamTwoWon: teamTwoWon
    };

  }

  private updatePlayerRankingAfterGameResultEntered(gameResult: GameResult,
                                                    round: number,
                                                    clearGame: boolean,
                                                    allPlayerRankings: TournamentRanking[],
                                                    allGames: TournamentGame[],
                                                    debug: boolean) {

    const that = this;
    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    const gameResultChangedForPlayerMap = {};

    let savedScorePlayerOne = 0;
    let savedCPPlayerOne = 0;
    let savedVPPlayerOne = 0;

    let savedScorePlayerTwo = 0;
    let savedCPPlayerTwo = 0;
    let savedVPPlayerTwo = 0;

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
      const opponentNamesTournamentPlayerMap = {};
      _.forEach(allRankingsFromSameRound, function (ranking: TournamentRanking) {
        scoreTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.score;
        opponentIdsTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.opponentTournamentPlayerIds;
        opponentNamesTournamentPlayerMap[ranking.playerName] = ranking.opponentNames;
      });


      if (gameResult.gameAfter.playerOneTournamentPlayerId !== 'bye') {

        let newScorePlayerOne = 0;
        let newCPPlayerOne = 0;
        let newVPPlayerOne = 0;
        let newListOfOpponentsIdsPlayerOne = [];
        let newListOfOpponentsNamesPlayerOne = [];

        // if there is a round before add them
        if (lastRoundRankingPlayerOne) {
          newScorePlayerOne = newScorePlayerOne + lastRoundRankingPlayerOne.score;
          newCPPlayerOne = newCPPlayerOne + lastRoundRankingPlayerOne.controlPoints;
          newVPPlayerOne = newVPPlayerOne + lastRoundRankingPlayerOne.victoryPoints;

          newListOfOpponentsIdsPlayerOne =
            _.union(newListOfOpponentsIdsPlayerOne, lastRoundRankingPlayerOne.opponentTournamentPlayerIds);

          newListOfOpponentsNamesPlayerOne =
            _.union(newListOfOpponentsNamesPlayerOne, lastRoundRankingPlayerOne.opponentNames);
        }

        if (i === gameResult.gameAfter.tournamentRound) {

          newScorePlayerOne = newScorePlayerOne + gameResult.gameAfter.playerOneScore;
          newCPPlayerOne = newCPPlayerOne + gameResult.gameAfter.playerOneControlPoints;
          newVPPlayerOne = newVPPlayerOne + gameResult.gameAfter.playerOneVictoryPoints;

          if (!clearGame) {
            newListOfOpponentsIdsPlayerOne.push(gameResult.gameAfter.playerTwoTournamentPlayerId);
            opponentIdsTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] = newListOfOpponentsIdsPlayerOne;

            newListOfOpponentsNamesPlayerOne.push(gameResult.gameAfter.playerTwoPlayerName);
            opponentNamesTournamentPlayerMap[rankingPlayerOne.playerName] = newListOfOpponentsNamesPlayerOne;
          }

          const playerOneRankingRef = this.afoDatabase.object('/tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerOne.id);
          playerOneRankingRef.update(
            {
              score: newScorePlayerOne,
              controlPoints: newCPPlayerOne,
              victoryPoints: newVPPlayerOne,
              opponentTournamentPlayerIds: newListOfOpponentsIdsPlayerOne,
              opponentNames: newListOfOpponentsNamesPlayerOne
            });

          savedScorePlayerOne = newScorePlayerOne;
          savedCPPlayerOne = newCPPlayerOne;
          savedVPPlayerOne = newVPPlayerOne;

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

          const nextRoundRankingPlayerOne: TournamentRanking = _.find(allPlayerRankings, function (ranking: TournamentRanking) {
            return (ranking.tournamentRound === (i) &&
              (ranking.playerName === gameResult.gameAfter.playerOnePlayerName));
          });

          const diffScore = savedScorePlayerOne - gameResult.gameBefore.playerOneScore;
          const scorePlayerOne = nextRoundRankingPlayerOne.score + diffScore;

          const diffControlPoints = savedCPPlayerOne - gameResult.gameBefore.playerOneControlPoints;
          const cpPlayerOne = nextRoundRankingPlayerOne.controlPoints + diffControlPoints;

          const diffVictoryPoints = savedVPPlayerOne - gameResult.gameBefore.playerOneVictoryPoints;
          const vpPlayerOne = nextRoundRankingPlayerOne.victoryPoints + diffVictoryPoints;

          const playerOneRankingRef = this.afoDatabase
            .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerOne.id);

          if (debug) {
            console.log('update playerOne next after' + gameResult.gameAfter.playerOnePlayerName +
              ' SC: ' + scorePlayerOne + ' CP: ' + cpPlayerOne + ' VP: ' + vpPlayerOne);
          }

          playerOneRankingRef.update(
            {
              score: scorePlayerOne,
              controlPoints: cpPlayerOne,
              victoryPoints: vpPlayerOne,
            });
        }
      }

      if (gameResult.gameAfter.playerTwoTournamentPlayerId !== 'bye') {

        let newScorePlayerTwo = 0;
        let newCPPlayerTwo = 0;
        let newVPPlayerTwo = 0;
        let newListOfOpponentsIdsPlayerTwo = [];
        let newListOfOpponentsNamesPlayerTwo = [];


        // if there is a round before add it
        if (lastRoundRankingPlayerTwo) {
          newScorePlayerTwo = newScorePlayerTwo + lastRoundRankingPlayerTwo.score;
          newCPPlayerTwo = newCPPlayerTwo + lastRoundRankingPlayerTwo.controlPoints;
          newVPPlayerTwo = newVPPlayerTwo + lastRoundRankingPlayerTwo.victoryPoints;

          newListOfOpponentsIdsPlayerTwo =
            _.union(newListOfOpponentsIdsPlayerTwo, lastRoundRankingPlayerTwo.opponentTournamentPlayerIds);
          newListOfOpponentsNamesPlayerTwo =
            _.union(newListOfOpponentsNamesPlayerTwo, lastRoundRankingPlayerTwo.opponentNames);
        }

        // the actual round where the result is entered
        if (i === gameResult.gameAfter.tournamentRound) {

          newScorePlayerTwo = newScorePlayerTwo + gameResult.gameAfter.playerTwoScore;
          newCPPlayerTwo = newCPPlayerTwo + gameResult.gameAfter.playerTwoControlPoints;
          newVPPlayerTwo = newVPPlayerTwo + gameResult.gameAfter.playerTwoVictoryPoints;

          if (!clearGame) {
            newListOfOpponentsIdsPlayerTwo.push(gameResult.gameAfter.playerOneTournamentPlayerId);
            opponentIdsTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] = newListOfOpponentsIdsPlayerTwo;

            newListOfOpponentsNamesPlayerTwo.push(gameResult.gameAfter.playerOnePlayerName);
            opponentNamesTournamentPlayerMap[rankingPlayerTwo.playerName] = newListOfOpponentsNamesPlayerTwo;
          }

          const playerTwoRankingRef = this.afoDatabase
            .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerTwo.id);
          playerTwoRankingRef.update(
            {
              score: newScorePlayerTwo,
              controlPoints: newCPPlayerTwo,
              victoryPoints: newVPPlayerTwo,
              opponentTournamentPlayerIds: newListOfOpponentsIdsPlayerTwo,
              opponentNames: newListOfOpponentsNamesPlayerTwo
            });

          savedScorePlayerTwo = newScorePlayerTwo;
          savedCPPlayerTwo = newCPPlayerTwo;
          savedVPPlayerTwo = newVPPlayerTwo;

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

          const nextRoundRankingPlayerTwo: TournamentRanking = _.find(allPlayerRankings, function (ranking: TournamentRanking) {
            return (ranking.tournamentRound === (i) &&
              (ranking.playerName === gameResult.gameAfter.playerTwoPlayerName));
          });

          const diffScore = savedScorePlayerTwo - gameResult.gameBefore.playerTwoScore;
          const scorePlayerTwo = nextRoundRankingPlayerTwo.score + diffScore;

          const diffControlPoints = savedCPPlayerTwo - gameResult.gameBefore.playerTwoControlPoints;
          const cpPlayerTwo = nextRoundRankingPlayerTwo.controlPoints + diffControlPoints;

          const diffVictoryPoints = savedVPPlayerTwo - gameResult.gameBefore.playerTwoVictoryPoints;
          const vpPlayerTwo = nextRoundRankingPlayerTwo.victoryPoints + diffVictoryPoints;

          const playerTwoRankingRef = this.afoDatabase
            .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerTwo.id);
          playerTwoRankingRef.update(
            {
              score: scorePlayerTwo,
              controlPoints: cpPlayerTwo,
              victoryPoints: vpPlayerTwo,
            });

          if (debug) {
            console.log('update playerTwo next round: ' + gameResult.gameAfter.playerTwoPlayerName +
              ' SC: ' + scorePlayerTwo + ' CP: ' + cpPlayerTwo + ' VP: ' + vpPlayerTwo);
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

          if (debug) {
            console.log('update sos: ' + rankToUpdate.playerName + ' for round: ' + rankToUpdate.tournamentRound +
              ' NewSos: ' + newSos);
          }
        }
      });
    } // loop over game result round till actual rounds
  }

  updateTeamMatchAfterGameResultEntered(teamMatchState: TeamMatchState,
                                        teamGameResult: TeamGameResult) {

    if (!teamGameResult.gameBefore.finished) {

      // console.log('teamMatchState: ' + JSON.stringify(teamMatchState));
      // console.log('team1: ' + teamGameResult.gameAfter.playerOneIntermediateResult);
      // console.log('team2: ' + teamGameResult.gameAfter.playerTwoIntermediateResult);

      const teamMatchRef = this.afoDatabase.object('tournament-team-games/' + teamGameResult.teamMatch.tournamentId + '/' + teamGameResult.teamMatch.id);
      teamMatchRef.update({
        'playerOneIntermediateResult': teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore,
        'playerOneControlPoints': teamGameResult.teamMatch.playerOneControlPoints + teamGameResult.gameAfter.playerOneControlPoints,
        'playerOneVictoryPoints': teamGameResult.teamMatch.playerOneVictoryPoints + teamGameResult.gameAfter.playerOneVictoryPoints,
        'playerOneScore': teamMatchState.teamMatchFinished ? teamMatchState.teamOneWon : '0',
        'playerTwoIntermediateResult': teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore,
        'playerTwoControlPoints': teamGameResult.teamMatch.playerTwoControlPoints + teamGameResult.gameAfter.playerTwoControlPoints,
        'playerTwoVictoryPoints': teamGameResult.teamMatch.playerTwoVictoryPoints + teamGameResult.gameAfter.playerTwoVictoryPoints,
        'playerTwoScore': teamMatchState.teamMatchFinished ? teamMatchState.teamTwoWon : '0',
        'finished': teamMatchState.teamMatchFinished
      });
    } else {
      const playerOneIntermediateResult = teamGameResult.teamMatch.playerOneIntermediateResult + teamGameResult.gameAfter.playerOneScore - teamGameResult.gameBefore.playerOneScore;
      const playerOneControlPoints = teamGameResult.teamMatch.playerOneControlPoints + teamGameResult.gameAfter.playerOneControlPoints - teamGameResult.gameBefore.playerOneControlPoints;
      const playerOneVictoryPoints = teamGameResult.teamMatch.playerOneVictoryPoints + teamGameResult.gameAfter.playerOneVictoryPoints - teamGameResult.gameBefore.playerOneVictoryPoints;
      const playerOneScore = teamMatchState.teamMatchFinished ? teamMatchState.teamOneWon : '0';
      const playerTwoIntermediateResult = teamGameResult.teamMatch.playerTwoIntermediateResult + teamGameResult.gameAfter.playerTwoScore - teamGameResult.gameBefore.playerTwoScore;
      const playerTwoControlPoints = teamGameResult.teamMatch.playerTwoControlPoints + teamGameResult.gameAfter.playerTwoControlPoints - teamGameResult.gameBefore.playerTwoControlPoints;
      const playerTwoVictoryPoints = teamGameResult.teamMatch.playerTwoVictoryPoints + teamGameResult.gameAfter.playerTwoVictoryPoints - teamGameResult.gameBefore.playerTwoVictoryPoints;
      const playerTwoScore = teamMatchState.teamMatchFinished ? teamMatchState.teamTwoWon : '0';
      const finished = teamMatchState.teamMatchFinished;

      const teamMatchRef = this.afoDatabase.object('tournament-team-games/' + teamGameResult.teamMatch.tournamentId + '/' + teamGameResult.teamMatch.id);
      teamMatchRef.update({
        'playerOneIntermediateResult': playerOneIntermediateResult,
        'playerOneControlPoints': playerOneControlPoints,
        'playerOneVictoryPoints': playerOneVictoryPoints,
        'playerOneScore': playerOneScore,
        'playerTwoIntermediateResult': playerTwoIntermediateResult,
        'playerTwoControlPoints': playerTwoControlPoints,
        'playerTwoVictoryPoints': playerTwoVictoryPoints,
        'playerTwoScore': playerTwoScore,
        'finished': finished
      });
    }
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

  updateTeamRankingAfterGameResultEntered(teamMatchState: TeamMatchState,
                                          teamGameResult: TeamGameResult,
                                          round: number,
                                          clearGame: boolean,
                                          allTeamRankings: TournamentRanking[],
                                          debug: boolean) {

    const roundOfGameResult = teamGameResult.gameAfter.tournamentRound;

    let savedScoreTeamOne = 0;
    let savedSecondScoreTeamOne = 0;
    let savedCPTeamOne = 0;
    let savedVPTeamOne = 0;

    let savedScoreTeamTwo = 0;
    let savedSecondScoreTeamTwo = 0;
    let savedCPTeamTwo = 0;
    let savedVPTeamTwo = 0;

    for (let i = roundOfGameResult; i <= round; i++) {

      let lastRoundRankingTeamOne: TournamentRanking = undefined;
      let lastRoundRankingTeamTwo: TournamentRanking = undefined;
      let rankingTeamOne: TournamentRanking = undefined;
      let rankingTeamTwo: TournamentRanking = undefined;

      _.forEach(allTeamRankings, function (ranking: TournamentRanking) {


        if (ranking.tournamentRound === (i - 1) &&
          ranking.playerName === teamGameResult.gameAfter.playerOneTeamName) {
          lastRoundRankingTeamOne = ranking;
        }

        if (ranking.tournamentRound === (i - 1) &&
          ranking.playerName === teamGameResult.gameAfter.playerTwoTeamName) {
          lastRoundRankingTeamTwo = ranking;
        }

        if (ranking.tournamentRound === (i) &&
          ranking.playerName === teamGameResult.gameAfter.playerOneTeamName) {
          rankingTeamOne = ranking;
        }

        if (ranking.tournamentRound === (i) &&
          ranking.playerName === teamGameResult.gameAfter.playerTwoTeamName) {
          rankingTeamTwo = ranking;
        }

      });


      if (teamGameResult.gameAfter.playerOneTournamentPlayerId !== 'bye') {
        let newScoreTeamOne = 0;
        let newSecondScoreTeamOne = 0;
        let newCPTeamOne = 0;
        let newVPTeamOne = 0;
        let newListOfOpponentsIdsTeamOne = [];
        let newListOfOpponentsNamesTeamOne = [];

        // if there is a round before add them
        if (lastRoundRankingTeamOne) {
          newScoreTeamOne = newScoreTeamOne + lastRoundRankingTeamOne.score;

          newListOfOpponentsIdsTeamOne =
            _.union(newListOfOpponentsIdsTeamOne, lastRoundRankingTeamOne.opponentTournamentPlayerIds);

          newListOfOpponentsNamesTeamOne =
            _.union(newListOfOpponentsNamesTeamOne, lastRoundRankingTeamOne.opponentNames);
        }

        if (i === teamGameResult.gameAfter.tournamentRound) {

          if (teamMatchState.teamMatchFinished && !clearGame) {
            newScoreTeamOne = newScoreTeamOne + teamMatchState.teamOneWon;
          }

          if (!teamGameResult.gameBefore.finished) {
            newSecondScoreTeamOne = rankingTeamOne.secondScore + teamGameResult.gameAfter.playerOneScore;
            newCPTeamOne = rankingTeamOne.controlPoints + teamGameResult.gameAfter.playerOneControlPoints;
            newVPTeamOne = rankingTeamOne.victoryPoints + teamGameResult.gameAfter.playerOneVictoryPoints;
          } else {
            newSecondScoreTeamOne = rankingTeamOne.secondScore +
              teamGameResult.gameAfter.playerOneScore - teamGameResult.gameBefore.playerOneScore;
            newCPTeamOne = rankingTeamOne.controlPoints +
              teamGameResult.gameAfter.playerOneControlPoints - teamGameResult.gameBefore.playerOneControlPoints;
            newVPTeamOne = rankingTeamOne.victoryPoints +
              teamGameResult.gameAfter.playerOneVictoryPoints - teamGameResult.gameBefore.playerOneVictoryPoints;
          }


          if (!clearGame) {
            if (rankingTeamTwo) {
              newListOfOpponentsIdsTeamOne.push(rankingTeamTwo.tournamentPlayerId);
              newListOfOpponentsNamesTeamOne.push(rankingTeamOne.playerName);
            } else {
              newListOfOpponentsIdsTeamOne.push('bye');
              newListOfOpponentsNamesTeamOne.push('Bye');
            }
          }

          const teamOneRankingRef = this.afoDatabase.object('/tournament-team-rankings/' + teamGameResult.gameAfter.tournamentId + '/' + rankingTeamOne.id);
          teamOneRankingRef.update(
            {
              score: newScoreTeamOne,
              secondScore: newSecondScoreTeamOne,
              controlPoints: newCPTeamOne,
              victoryPoints: newVPTeamOne,
              opponentTournamentPlayerIds: newListOfOpponentsIdsTeamOne,
              opponentNames: newListOfOpponentsNamesTeamOne
            });

          savedScoreTeamOne = newScoreTeamOne;
          savedSecondScoreTeamOne = newSecondScoreTeamOne;
          savedCPTeamOne = newCPTeamOne;
          savedVPTeamOne = newVPTeamOne;

          if (debug) {
            console.log('update ranking: ' + rankingTeamOne.playerName +
              ' newScoreTeamOne: ' + newScoreTeamOne);
          }
        }

        // there is a round after
        if (i > teamGameResult.gameAfter.tournamentRound) {


          const nextRoundRankingTeamOne: TournamentRanking = _.find(allTeamRankings, function (ranking: TournamentRanking) {
            return (ranking.tournamentRound === (i) &&
              (ranking.playerName === teamGameResult.gameAfter.playerOneTeamName));
          });

          const diffScore = savedScoreTeamOne - teamGameResult.teamMatch.playerOneScore;
          const scoreTeamTwo = nextRoundRankingTeamOne.score + diffScore;

          const diffSecondScore = savedSecondScoreTeamOne - teamGameResult.teamMatch.playerOneIntermediateResult;
          const secondScoreTeamOne = nextRoundRankingTeamOne.secondScore + diffSecondScore;

          const diffControlPoints = savedCPTeamOne - teamGameResult.teamMatch.playerOneControlPoints;
          const cpTeamOne = nextRoundRankingTeamOne.controlPoints + diffControlPoints;

          const diffVictoryPoints = savedVPTeamOne - teamGameResult.teamMatch.playerOneVictoryPoints;
          const vpTeamOne = nextRoundRankingTeamOne.victoryPoints + diffVictoryPoints;


          const playerOneRankingRef = this.afoDatabase
            .object('tournament-team-rankings/' + teamGameResult.gameAfter.tournamentId + '/' + rankingTeamOne.id);

          playerOneRankingRef.update(
            {
              score: scoreTeamTwo,
              secondScore: secondScoreTeamOne,
              controlPoints: cpTeamOne,
              victoryPoints: vpTeamOne,
            });

          if (debug) {
            console.log('update ranking: next round: ' + rankingTeamOne.playerName +
              ' newScoreTeamOne: ' + newScoreTeamOne);
          }
        }
      }

      if (teamGameResult.gameAfter.playerTwoTournamentPlayerId !== 'bye') {

        let newScoreTeamTwo = 0;
        let newSecondScoreTeamTwo = 0;
        let newCPTeamTwo = 0;
        let newVPTeamTwo = 0;
        let newListOfOpponentsIdsTeamTwo = [];
        let newListOfOpponentsNamesTeamTwo = [];

        // if there is a round before add it
        if (lastRoundRankingTeamTwo) {
          newScoreTeamTwo = newScoreTeamTwo + lastRoundRankingTeamTwo.score;

          newListOfOpponentsIdsTeamTwo =
            _.union(newListOfOpponentsIdsTeamTwo, lastRoundRankingTeamTwo.opponentTournamentPlayerIds);

          newListOfOpponentsNamesTeamTwo =
            _.union(newListOfOpponentsNamesTeamTwo, lastRoundRankingTeamTwo.opponentNames);
        }

        // the actual round where the result is entered
        if (i === teamGameResult.gameAfter.tournamentRound) {

          if (teamMatchState.teamMatchFinished && !clearGame) {
            newScoreTeamTwo = newScoreTeamTwo + teamMatchState.teamTwoWon;
          }

          if (!teamGameResult.gameBefore.finished) {
            newSecondScoreTeamTwo = rankingTeamTwo.secondScore + teamGameResult.gameAfter.playerTwoScore;
            newCPTeamTwo = rankingTeamTwo.controlPoints + teamGameResult.gameAfter.playerTwoControlPoints;
            newVPTeamTwo = newVPTeamTwo + rankingTeamTwo.victoryPoints + teamGameResult.gameAfter.playerTwoVictoryPoints;
          } else {
            newSecondScoreTeamTwo = rankingTeamTwo.secondScore +
              teamGameResult.gameAfter.playerTwoScore - teamGameResult.gameBefore.playerTwoScore;
            newCPTeamTwo = rankingTeamTwo.controlPoints +
              teamGameResult.gameAfter.playerTwoControlPoints - teamGameResult.gameBefore.playerTwoControlPoints;
            newVPTeamTwo = rankingTeamTwo.victoryPoints +
              teamGameResult.gameAfter.playerTwoVictoryPoints - teamGameResult.gameBefore.playerTwoVictoryPoints;
          }

          if (!clearGame) {
            if (rankingTeamOne) {
              newListOfOpponentsIdsTeamTwo.push(rankingTeamOne.tournamentPlayerId);
              newListOfOpponentsNamesTeamTwo.push(rankingTeamOne.playerName);
            } else {
              newListOfOpponentsIdsTeamTwo.push('bye');
              newListOfOpponentsNamesTeamTwo.push('Bye');
            }
          }


          const playerTwoRankingRef = this.afoDatabase
            .object('tournament-team-rankings/' + teamGameResult.gameAfter.tournamentId + '/' + rankingTeamTwo.id);
          playerTwoRankingRef.update(
            {
              score: newScoreTeamTwo,
              secondScore: newSecondScoreTeamTwo,
              controlPoints: newCPTeamTwo,
              victoryPoints: newVPTeamTwo,
              opponentTournamentPlayerIds: newListOfOpponentsIdsTeamTwo,
              opponentNames: newListOfOpponentsNamesTeamTwo
            });

          savedScoreTeamTwo = newScoreTeamTwo;
          savedSecondScoreTeamTwo = newSecondScoreTeamTwo;
          savedCPTeamTwo = newCPTeamTwo;
          savedVPTeamTwo = newVPTeamTwo;

          if (debug) {
            console.log('update ranking: ' + rankingTeamTwo.playerName +
              ' newScoreTeamTwo: ' + newScoreTeamTwo);
          }
        }


        if (i > teamGameResult.gameAfter.tournamentRound) {

          const nextRoundRankingTeamTwo: TournamentRanking = _.find(allTeamRankings, function (ranking: TournamentRanking) {
            return (ranking.tournamentRound === (i) &&
              (ranking.playerName === teamGameResult.gameAfter.playerTwoTeamName));
          });

          const diffScore = savedScoreTeamTwo - teamGameResult.teamMatch.playerTwoScore;
          const scoreTeamTwo = nextRoundRankingTeamTwo.score + diffScore;

          const diffSecondScore = savedSecondScoreTeamTwo - teamGameResult.teamMatch.playerTwoIntermediateResult;
          const secondScoreTeamTwo = nextRoundRankingTeamTwo.secondScore + diffSecondScore;

          const diffControlPoints = savedCPTeamTwo - teamGameResult.teamMatch.playerTwoControlPoints;
          const cpTeamTwo = nextRoundRankingTeamTwo.controlPoints + diffControlPoints;

          const diffVictoryPoints = savedVPTeamTwo - teamGameResult.teamMatch.playerTwoVictoryPoints;
          const vpTeamTwo = nextRoundRankingTeamTwo.victoryPoints + diffVictoryPoints;

          const teamTwoRankingRef = this.afoDatabase
            .object('tournament-team-rankings/' + teamGameResult.gameAfter.tournamentId + '/' + rankingTeamTwo.id);
          teamTwoRankingRef.update(
            {
              score: scoreTeamTwo,
              secondScore: secondScoreTeamTwo,
              controlPoints: cpTeamTwo,
              victoryPoints: vpTeamTwo,
            });

          if (debug) {
            console.log('update ranking: next round' + rankingTeamTwo.playerName +
              ' score: ' + newScoreTeamTwo + ' secondScore: ' + newSecondScoreTeamTwo +
              ' newCPTeamTwo: ' + newCPTeamTwo + ' newVPTeamTwo: ' + newVPTeamTwo);
          }

        }
      }
    }
  }

  clearGameForTeamMatchOnly(gameToReset: TournamentGame, teamMatch: TournamentGame) {

    const tournamentTeamGamesRef = this.afoDatabase
      .object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);

    const newInterPlayerOne = teamMatch.playerOneIntermediateResult - gameToReset.playerOneScore;
    const newControlPlayerOne = teamMatch.playerOneControlPoints - gameToReset.playerOneControlPoints;
    const newVictoryPlayerOne = teamMatch.playerOneVictoryPoints - gameToReset.playerOneVictoryPoints;

    const newInterPlayerTwo = teamMatch.playerTwoIntermediateResult - gameToReset.playerTwoScore;
    const newControlPlayerTwo = teamMatch.playerTwoControlPoints - gameToReset.playerTwoControlPoints;
    const newVictoryPlayerTwo = teamMatch.playerTwoVictoryPoints - gameToReset.playerTwoVictoryPoints;

    tournamentTeamGamesRef.update({
      'playerOneScore': 0,
      'playerOneIntermediateResult': newInterPlayerOne,
      'playerOneControlPoints': newControlPlayerOne,
      'playerOneVictoryPoints': newVictoryPlayerOne,
      'playerTwoScore': 0,
      'playerTwoIntermediateResult': newInterPlayerTwo,
      'playerTwoControlPoints': newControlPlayerTwo,
      'playerTwoVictoryPoints': newVictoryPlayerTwo,
      'finished': false
    });

  }

  clearRankingForTeamMatch(teamMatch: TournamentGame,
                           allTeamRankings: TournamentRanking[]) {

    const that = this;

    let lastRoundTeamOneScore = 0;
    let lastRoundTeamOneSecondScore = 0;
    let lastRoundTeamOneCP = 0;
    let lastRoundTeamOneVP = 0;
    let lastRoundTeamOneOpponentIds = [];
    let lastRoundTeamOneOpponentNames = [];

    let lastRoundTeamTwoScore = 0;
    let lastRoundTeamTwoSecondScore = 0;
    let lastRoundTeamTwoCP = 0;
    let lastRoundTeamTwoVP = 0;
    let lastRoundTeamTwoOpponentIds = [];
    let lastRoundTeamTwoOpponentNames = [];

    _.forEach(allTeamRankings, function (teamRank: TournamentRanking) {

      if (teamRank.tournamentRound === (teamMatch.tournamentRound - 1) &&
        teamRank.playerName === teamMatch.playerOnePlayerName) {
        lastRoundTeamOneScore = teamRank.score;
        lastRoundTeamOneSecondScore = teamRank.secondScore;
        lastRoundTeamOneCP = teamRank.controlPoints;
        lastRoundTeamOneVP = teamRank.victoryPoints;
        lastRoundTeamOneOpponentIds = teamRank.opponentTournamentPlayerIds;
        lastRoundTeamOneOpponentNames = teamRank.opponentNames;
      }

      if (teamRank.tournamentRound === (teamMatch.tournamentRound - 1) &&
        teamRank.playerName === teamMatch.playerTwoPlayerName) {
        lastRoundTeamTwoScore = teamRank.score;
        lastRoundTeamTwoSecondScore = teamRank.secondScore;
        lastRoundTeamTwoCP = teamRank.controlPoints;
        lastRoundTeamTwoVP = teamRank.victoryPoints;
        lastRoundTeamTwoOpponentIds = teamRank.opponentTournamentPlayerIds;
        lastRoundTeamTwoOpponentNames = teamRank.opponentNames;
      }
    });

    _.forEach(allTeamRankings, function (teamRank: TournamentRanking) {

      if (teamRank.tournamentRound === (teamMatch.tournamentRound) &&
        teamRank.playerName === teamMatch.playerOnePlayerName) {
        const actualRankTeamOne = that.afoDatabase
          .object('tournament-team-rankings/' + teamMatch.tournamentId + '/' + teamRank.id);

        actualRankTeamOne.update({
          score: lastRoundTeamOneScore,
          secondScore: lastRoundTeamOneSecondScore,
          controlPoints: lastRoundTeamOneCP,
          victoryPoints: lastRoundTeamOneVP,
          opponentTournamentPlayerIds: lastRoundTeamOneOpponentIds,
          opponentNames: lastRoundTeamOneOpponentNames
        });
      }

      if (teamRank.tournamentRound === (teamMatch.tournamentRound) &&
        teamRank.playerName === teamMatch.playerTwoPlayerName) {
        const actualRankTeamTwo = that.afoDatabase
          .object('tournament-team-rankings/' + teamMatch.tournamentId + '/' + teamRank.id);

        actualRankTeamTwo.update({
          score: lastRoundTeamTwoScore,
          secondScore: lastRoundTeamTwoSecondScore,
          controlPoints: lastRoundTeamTwoCP,
          victoryPoints: lastRoundTeamTwoVP,
          opponentTournamentPlayerIds: lastRoundTeamTwoOpponentIds,
          opponentNames: lastRoundTeamTwoOpponentNames
        });

      }
    });
  }
}

class TeamMatchState {

  teamMatchFinished: boolean;
  teamOneWon: number;
  teamTwoWon: number;
}

