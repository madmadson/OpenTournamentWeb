import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';

import {TournamentGame} from '../../../shared/model/tournament-game';


@Injectable()
export class SwappingService {

  constructor(private afoDatabase: AngularFireOfflineDatabase) {}

  swapPlayer(rankingsForRound: TournamentRanking[],
             draggedGame: TournamentGame,
             draggedTournamentPlayerId: string,
             droppedGame: TournamentGame,
             droppedPlayerId: string) {

    const newGameOne = this.createGameOne(draggedGame, draggedTournamentPlayerId, droppedGame, droppedPlayerId);
    const newGameTwo = this.createGameTwo(draggedGame, draggedTournamentPlayerId, droppedGame, droppedPlayerId);

    this.handlePlayerOneIsBye(newGameOne, rankingsForRound);
    this.handlePlayerTwoIsBye(newGameOne, rankingsForRound);
    this.handlePlayerOneIsBye(newGameTwo, rankingsForRound);
    this.handlePlayerTwoIsBye(newGameTwo, rankingsForRound);

    // console.log('newGameOne: ' + JSON.stringify(newGameOne));
    // console.log('newGameTwo: ' + JSON.stringify(newGameTwo));

    const gameOneRef = this.afoDatabase.object('tournament-games/' + newGameOne.tournamentId + '/' + newGameOne.id);
    gameOneRef.update(newGameOne);

    const gameTwoRef = this.afoDatabase.object('tournament-games/' + newGameTwo.tournamentId + '/' + newGameTwo.id);
    gameTwoRef.update(newGameTwo);
  }

  private handlePlayerOneIsBye(game: TournamentGame, rankingsForRound: TournamentRanking[]) {

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

  private handlePlayerTwoIsBye(game: TournamentGame, rankingsForRound: TournamentRanking[]) {

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

  private createGameOne(
    draggedGame: TournamentGame,
    draggedTournamentPlayerId: string,
    droppedGame: TournamentGame,
    droppedTournamentPlayerId: string): TournamentGame {

    let gameOnePlayerOneAffected = false;
    let gameOnePlayerTwoAffected = false;
    let gameTwoPlayerOneAffected = false;
    let gameTwoPlayerTwoAffected = false;

    if (draggedGame.playerOneTournamentPlayerId === draggedTournamentPlayerId) {
      // X-1 / X-2
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOneAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // X-1 / 2-X
        gameOnePlayerOneAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    } else {
      // 1-X / X-2
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // 1-X / 2-X
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    }

    return {
      id: draggedGame.id,
      tournamentId: draggedGame.tournamentId,

      playerOnePlayerId: gameOnePlayerTwoAffected ? draggedGame.playerOnePlayerId :
        gameTwoPlayerOneAffected ? droppedGame.playerOnePlayerId : droppedGame.playerTwoPlayerId,
      playerOneTournamentPlayerId: gameOnePlayerTwoAffected ? draggedGame.playerOneTournamentPlayerId :
        gameTwoPlayerOneAffected ? droppedGame.playerOneTournamentPlayerId : droppedGame.playerTwoTournamentPlayerId,
      playerOnePlayerName: gameOnePlayerTwoAffected ? draggedGame.playerOnePlayerName :
        gameTwoPlayerOneAffected ? droppedGame.playerOnePlayerName : droppedGame.playerTwoPlayerName,
      playerOneTeamName: gameOnePlayerTwoAffected ? draggedGame.playerOneTeamName :
        gameTwoPlayerOneAffected ? droppedGame.playerOneTeamName : droppedGame.playerTwoTeamName,
      playerOneFaction: gameOnePlayerTwoAffected ? draggedGame.playerOneFaction :
        gameTwoPlayerOneAffected ? droppedGame.playerOneFaction : droppedGame.playerTwoFaction,
      playerOneElo: gameOnePlayerTwoAffected ? draggedGame.playerOneElo :
        gameTwoPlayerOneAffected ? droppedGame.playerOneElo : droppedGame.playerTwoElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,
      playerOneIntermediateResult: 0,

      playerTwoPlayerId: gameOnePlayerOneAffected ? draggedGame.playerTwoPlayerId :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoPlayerId : droppedGame.playerOnePlayerId,
      playerTwoTournamentPlayerId: gameOnePlayerOneAffected ? draggedGame.playerTwoTournamentPlayerId :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoTournamentPlayerId : droppedGame.playerOneTournamentPlayerId,
      playerTwoPlayerName: gameOnePlayerOneAffected ? draggedGame.playerTwoPlayerName :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoPlayerName : droppedGame.playerOnePlayerName,
      playerTwoTeamName: gameOnePlayerOneAffected ? draggedGame.playerTwoTeamName :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoTeamName : droppedGame.playerOneTeamName,
      playerTwoFaction: gameOnePlayerOneAffected ? draggedGame.playerTwoFaction :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoFaction : droppedGame.playerOneFaction,
      playerTwoElo: gameOnePlayerOneAffected ? draggedGame.playerTwoElo :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoElo : droppedGame.playerOneElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,
      playerTwoIntermediateResult: 0,

      playingField: draggedGame.playingField,
      tournamentRound: draggedGame.tournamentRound,
      finished: draggedGame.finished,
      scenario: draggedGame.scenario
    };
  }

  private createGameTwo(
    draggedGame: TournamentGame,
    draggedTournamentPlayerId: string,
    droppedGame: TournamentGame,
    droppedTournamentPlayerId: string): TournamentGame {
    let gameOnePlayerOneAffected = false;
    let gameOnePlayerTwoAffected = false;
    let gameTwoPlayerOneAffected = false;
    let gameTwoPlayerTwoAffected = false;

    if (draggedGame.playerOneTournamentPlayerId === draggedTournamentPlayerId) {
      // Drag:  X-1 /Drop: X-1
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOneAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // Drag: X-1 / Drop: 1-X
        gameOnePlayerOneAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    } else {
      // Drag: 1-X /Drop: X-1
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // Drag: 1-X /Drop: 1-X
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    }


    return {
      id: droppedGame.id,
      tournamentId: droppedGame.tournamentId,

      playerOnePlayerId: gameTwoPlayerTwoAffected ? droppedGame.playerOnePlayerId :
        gameOnePlayerOneAffected ? draggedGame.playerOnePlayerId : draggedGame.playerTwoPlayerId,
      playerOneTournamentPlayerId: gameTwoPlayerTwoAffected ? droppedGame.playerOneTournamentPlayerId :
        gameOnePlayerOneAffected ? draggedGame.playerOneTournamentPlayerId : draggedGame.playerTwoTournamentPlayerId,
      playerOnePlayerName: gameTwoPlayerTwoAffected ? droppedGame.playerOnePlayerName :
        gameOnePlayerOneAffected ? draggedGame.playerOnePlayerName : draggedGame.playerTwoPlayerName,
      playerOneTeamName: gameTwoPlayerTwoAffected ? droppedGame.playerOneTeamName :
        gameOnePlayerOneAffected ? draggedGame.playerOneTeamName : draggedGame.playerTwoTeamName,

      playerOneFaction: gameTwoPlayerTwoAffected ? droppedGame.playerOneFaction :
        gameOnePlayerOneAffected ? draggedGame.playerOneFaction : draggedGame.playerTwoFaction,
      playerOneElo: gameTwoPlayerTwoAffected ? droppedGame.playerOneElo :
        gameOnePlayerOneAffected ? draggedGame.playerOneElo : draggedGame.playerTwoElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,
      playerOneIntermediateResult: 0,

      playerTwoPlayerId: gameTwoPlayerOneAffected ? droppedGame.playerTwoPlayerId :
        gameOnePlayerTwoAffected ? draggedGame.playerTwoPlayerId : draggedGame.playerOnePlayerId,
      playerTwoTournamentPlayerId: gameTwoPlayerOneAffected ? droppedGame.playerTwoTournamentPlayerId :
        gameOnePlayerTwoAffected ? draggedGame.playerTwoTournamentPlayerId : draggedGame.playerOneTournamentPlayerId,
      playerTwoPlayerName: gameTwoPlayerOneAffected ? droppedGame.playerTwoPlayerName :
        gameOnePlayerTwoAffected ? draggedGame.playerTwoPlayerName : draggedGame.playerOnePlayerName,
      playerTwoTeamName: gameTwoPlayerOneAffected ? droppedGame.playerTwoTeamName :
        gameOnePlayerTwoAffected ? draggedGame.playerTwoTeamName : draggedGame.playerOneTeamName,
      playerTwoFaction: gameTwoPlayerOneAffected ? droppedGame.playerTwoFaction :
        gameOnePlayerTwoAffected ? draggedGame.playerTwoFaction : draggedGame.playerOneFaction,
      playerTwoElo: gameTwoPlayerOneAffected ? droppedGame.playerTwoElo :
        gameOnePlayerTwoAffected ? draggedGame.playerTwoElo : draggedGame.playerOneElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,
      playerTwoIntermediateResult: 0,

      playingField: droppedGame.playingField,
      tournamentRound: droppedGame.tournamentRound,
      finished: droppedGame.finished,
      scenario: droppedGame.scenario
    };
  }
}
