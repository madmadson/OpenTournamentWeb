import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Tournament} from '../../../shared/model/tournament';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {
  AddTournamentRankingAction, ChangeTournamentRankingAction, ClearRankingAction,
  DeleteTournamentRankingAction
} from '../store/actions/tournament-rankings-actions';

import * as _ from 'lodash';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {GameResult} from '../../../shared/dto/game-result';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {AppState} from '../store/reducers/index';


@Injectable()
export class TournamentRankingService {

  tournamentRankingsRef: firebase.database.Reference;

  allPlayers: TournamentPlayer[];
  allTeams: TournamentTeam[];
  allPlayerRankings: TournamentRanking[];
  allTeamRankings: TournamentRanking[];
  allGames: TournamentGame[];
  allTeamGames: TournamentGame[];
  actualTournament: Tournament;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>) {

    this.store.select(state => state).subscribe(state => {
      this.allPlayers = state.actualTournament.actualTournamentPlayers;
      this.allTeams = state.actualTournament.actualTournamentTeams;
      this.allPlayerRankings = state.actualTournament.actualTournamentRankings;
      this.allTeamRankings = state.actualTournament.actualTournamentTeamRankings;
      this.allGames = state.actualTournament.actualTournamentGames;
      this.allTeamGames = state.actualTournament.actualTournamentTeamGames;
      this.actualTournament = state.actualTournament.actualTournament;
    });

  }

  public subscribeOnTournamentRankings(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearRankingAction());

    if (this.tournamentRankingsRef) {
      this.tournamentRankingsRef.off();
    }

    this.tournamentRankingsRef = firebase.database().ref('tournament-rankings/' + tournamentId);

    this.tournamentRankingsRef.on('child_added', function (snapshot) {

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch(new AddTournamentRankingAction(ranking));

    });

    this.tournamentRankingsRef.on('child_changed', function (snapshot) {

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentRankingAction(ranking));

    });

    this.tournamentRankingsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentRankingAction(snapshot.key));

    });
  }

  pushRankingForRound(config: TournamentManagementConfiguration): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    this.eraseRankingsForRound(config);

    const lastRoundRankings: TournamentRanking[] = _.filter(this.allPlayerRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {
      const newTournamentRanking = new TournamentRanking(
        tournamentPlayer.tournamentId,
        tournamentPlayer.id,
        tournamentPlayer.playerId ? tournamentPlayer.playerId : '',
        tournamentPlayer.playerName,
        tournamentPlayer.faction ? tournamentPlayer.faction : '',
        tournamentPlayer.teamName ? tournamentPlayer.teamName : '',
        tournamentPlayer.origin ? tournamentPlayer.origin : '',
        tournamentPlayer.meta ? tournamentPlayer.meta : '',
        tournamentPlayer.country ? tournamentPlayer.country : '',
        tournamentPlayer.elo ? tournamentPlayer.elo : 0,
        0, 0, 0, 0, 0, 1, [],
        tournamentPlayer.droppedInRound ? tournamentPlayer.droppedInRound : 0);


      _.each(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {

        if (lastRoundRanking.tournamentPlayerId === tournamentPlayer.id) {

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = config.round;
          newTournamentRanking.opponentTournamentPlayerIds = lastRoundRanking.opponentTournamentPlayerIds;
        }
      });

      const tournamentRankingsRef = that.afoDatabase
        .list('tournament-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }

  pushTeamRankingForRound(config: TournamentManagementConfiguration): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];


    const lastRoundTeamRankings: TournamentRanking[] = _.filter(this.allTeamRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(this.allTeams, function (team: TournamentTeam) {
      const newTournamentRanking = new TournamentRanking(
        team.tournamentId,
        team.id,
        '',
        team.teamName,
        '',
        '',
        '',
        team.meta ? team.meta : '',
        team.country ? team.country : '',
        0, 0, 0, 0, 0, 0, 1, [],
        team.droppedInRound ? team.droppedInRound : 0);

      _.each(lastRoundTeamRankings, function (lastRoundRanking: TournamentRanking) {

        if (lastRoundRanking.tournamentPlayerId === team.id) {

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.secondScore = lastRoundRanking.secondScore;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = config.round;
          newTournamentRanking.opponentTournamentPlayerIds = lastRoundRanking.opponentTournamentPlayerIds;
        }
      });
      const tournamentRankingsRef = that.afoDatabase
        .list('tournament-team-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }

  eraseRankingsForRound(config: TournamentManagementConfiguration) {

    const that = this;

    _.each(this.allPlayerRankings, function (ranking: TournamentRanking) {

      if (ranking.tournamentRound === config.round) {
        const rankingRef = that.afoDatabase.object('tournament-rankings/' + config.tournamentId + '/' + ranking.id);
        rankingRef.remove();
      }
    });
  }

  eraseTeamRankingsForRound(config: TournamentManagementConfiguration) {

    const that = this;

    _.each(this.allTeamRankings, function (ranking: TournamentRanking) {

      if (ranking.tournamentRound === config.round) {
        const rankingRef = that.afoDatabase.object('tournament-team-rankings/' + config.tournamentId + '/' + ranking.id);
        rankingRef.remove();
      }
    });
  }

  updateRankingAfterGameResultEntered(gameResult: GameResult, round: number, reset: boolean) {

    const that = this;
    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    const gameResultChangedForPlayerMap = {};

    for (let i = roundOfGameResult; i <= round; i++) {

      const allRankingsFromSameRound: TournamentRanking[] = _.filter(this.allPlayerRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === i);
      });

      const scoreTournamentPlayerMap = {};
      const opponentIdsTournamentPlayerMap = {};
      _.each(allRankingsFromSameRound, function (ranking: TournamentRanking) {
        scoreTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.score;
        opponentIdsTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.opponentTournamentPlayerIds;
      });

      const lastRoundRankingPlayerOne: TournamentRanking = _.filter(this.allPlayerRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i - 1) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId);
      })[0];

      const lastRoundRankingPlayerTwo: TournamentRanking = _.filter(this.allPlayerRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i - 1) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId);
      })[0];

      const rankingPlayerOne: TournamentRanking = _.filter(this.allPlayerRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId);
      })[0];

      const rankingPlayerTwo: TournamentRanking = _.filter(this.allPlayerRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId);
      })[0];

      const actualRoundGamePlayerOne: TournamentGame = _.filter(this.allGames, function (game: TournamentGame) {
        return (game.tournamentRound === (i) &&
        (game.playerOneTournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId ||
        game.playerTwoTournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId));
      })[0];

      const actualRoundGamePlayerTwo: TournamentGame = _.filter(this.allGames, function (game: TournamentGame) {
        return (game.tournamentRound === (i) &&
        (game.playerOneTournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId ||
        game.playerTwoTournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId));
      })[0];

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
      _.each(allRankingsFromSameRound, function (rankToUpdate: TournamentRanking) {

        let newSos = 0;
        _.each(opponentIdsTournamentPlayerMap[rankToUpdate.tournamentPlayerId], function (opponentTournamentPlayerId: string) {
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


  updateTeamRankingAfterGameResultEntered(gameResult: GameResult, round: number, reset: boolean) {

    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    let teamMatchFinished = true;
    let teamOneScore = 0;
    let teamTwoScore = 0;

    _.each(this.allGames, function (playerGame: TournamentGame) {

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

      const lastRoundRankingTeamOne: TournamentRanking = _.filter(this.allTeamRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i - 1) && ranking.playerName === gameResult.gameAfter.playerOneTeamName);
      })[0];

      const lastRoundRankingTeamTwo: TournamentRanking = _.filter(this.allTeamRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i - 1) && ranking.playerName === gameResult.gameAfter.playerTwoTeamName);
      })[0];

      const rankingTeamOne: TournamentRanking = _.filter(this.allTeamRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i) && ranking.playerName === gameResult.gameAfter.playerOneTeamName);
      })[0];

      const rankingTeamTwo: TournamentRanking = _.filter(this.allTeamRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i) && ranking.playerName === gameResult.gameAfter.playerTwoTeamName);
      })[0];

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
        }

        // there is a round after
        if (i > gameResult.gameAfter.tournamentRound) {

          const actualRoundTeamMatchTeamOne: TournamentGame = _.filter(this.allTeamGames, function (game: TournamentGame) {
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
        }


        if (i > gameResult.gameAfter.tournamentRound) {

          const actualRoundTeamMatchTeamTwo: TournamentGame = _.filter(this.allTeamGames, function (game: TournamentGame) {
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
          }
        }
      }
    }
  }
}

