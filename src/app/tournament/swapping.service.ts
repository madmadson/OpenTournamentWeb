import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';

import {TournamentGame} from '../../../shared/model/tournament-game';
import {SwapGames} from '../../../shared/dto/swap-player';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ByeService} from './bye-service';
import {Tournament} from '../../../shared/model/tournament';


@Injectable()
export class SwappingService {

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private byeService: ByeService) {
  }

  swapPlayer(rankingsForRound: TournamentRanking[],
             draggedGame: TournamentGame,
             draggedTournamentPlayerId: string,
             droppedGame: TournamentGame,
             droppedPlayerId: string) {

    const newGameOne = this.createGameOne(draggedGame, draggedTournamentPlayerId, droppedGame, droppedPlayerId);
    const newGameTwo = this.createGameTwo(draggedGame, draggedTournamentPlayerId, droppedGame, droppedPlayerId);

    this.byeService.handlePlayerOneIsBye(newGameOne, rankingsForRound);
    this.byeService.handlePlayerTwoIsBye(newGameOne, rankingsForRound);
    this.byeService.handlePlayerOneIsBye(newGameTwo, rankingsForRound);
    this.byeService.handlePlayerTwoIsBye(newGameTwo, rankingsForRound);


    console.log('newGameOne: ' + JSON.stringify(newGameOne));
    console.log('newGameTwo: ' + JSON.stringify(newGameTwo));

    const gameOneRef = this.afoDatabase.object('tournament-games/' + newGameOne.tournamentId + '/' + newGameOne.id);
    gameOneRef.update(newGameOne);

    const gameTwoRef = this.afoDatabase.object('tournament-games/' + newGameTwo.tournamentId + '/' + newGameTwo.id);
    gameTwoRef.update(newGameTwo);
  }

  private createGameOne(draggedGame: TournamentGame,
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

  private createGameTwo(draggedGame: TournamentGame,
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

  swapTeam(actualTournament: Tournament,
           draggedGame: TournamentGame,
           draggedTournamentPlayerId: string,
           droppedGame: TournamentGame,
           droppedTournamentPlayerId: string,
           allGamesForRound: TournamentGame[],
           allPlayers: TournamentPlayer[],
           allRankingsForRound: TournamentRanking[]) {

    const newGameOne = this.createGameOne(draggedGame,
      draggedTournamentPlayerId,
      droppedGame,
      droppedTournamentPlayerId);
    const newGameTwo = this.createGameTwo(draggedGame,
      draggedTournamentPlayerId,
      droppedGame,
      droppedTournamentPlayerId);

    this.newPlayerGamesForTeamMatch(newGameOne,
                                    newGameTwo,
                                    allGamesForRound,
                                    allPlayers,
                                    allRankingsForRound);

    if (newGameOne.playerOneTournamentPlayerId === 'bye') {
      newGameOne.playerTwoScore = 1;
      newGameOne.playerTwoIntermediateResult = actualTournament.teamSize;
      newGameOne.playerTwoControlPoints = actualTournament.teamSize * 3;
      newGameOne.playerTwoVictoryPoints = actualTournament.teamSize * 38;
      newGameOne.finished = true;
    }

    if (newGameOne.playerTwoTournamentPlayerId === 'bye') {
      newGameOne.playerOneScore = 1;
      newGameOne.playerOneIntermediateResult = actualTournament.teamSize;
      newGameOne.playerOneControlPoints = actualTournament.teamSize * 3;
      newGameOne.playerOneVictoryPoints = actualTournament.teamSize * 38;
      newGameOne.finished = true;
    }
    const gameOneRef = this.afoDatabase.object('tournament-team-games/' + newGameOne.tournamentId + '/' + newGameOne.id);
    gameOneRef.update(newGameOne);

    if (newGameTwo.playerOneTournamentPlayerId === 'bye') {
      newGameTwo.playerTwoScore = 1;
      newGameTwo.playerTwoIntermediateResult = actualTournament.teamSize;
      newGameTwo.playerTwoControlPoints = actualTournament.teamSize * 3;
      newGameTwo.playerTwoVictoryPoints = actualTournament.teamSize * 38;
      newGameTwo.finished = true;
    }

    if (newGameTwo.playerTwoTournamentPlayerId === 'bye') {
      newGameTwo.playerOneScore = 1;
      newGameTwo.playerOneIntermediateResult = actualTournament.teamSize;
      newGameTwo.playerOneControlPoints = actualTournament.teamSize * 3;
      newGameTwo.playerOneVictoryPoints = actualTournament.teamSize * 38;
      newGameTwo.finished = true;
    }

    console.log('newTeamMatch1: ' + JSON.stringify(newGameOne));
    console.log('newTeamMatch2: ' + JSON.stringify(newGameTwo));

    const gameTwoRef = this.afoDatabase.object('tournament-team-games/' + newGameOne.tournamentId + '/' + newGameTwo.id);
    gameTwoRef.update(newGameTwo);

  }

  newPlayerGamesForTeamMatch(gameOne: TournamentGame,
                             gameTwo: TournamentGame,
                             allGamesForRound: TournamentGame[],
                             allPlayers: TournamentPlayer[],
                             allRankingsForRound: TournamentRanking[]) {

    const that = this;

    _.forEach(allGamesForRound, function (game: TournamentGame) {
      if (game.tournamentRound === gameOne.tournamentRound) {
        if (game.playerOneTeamName === gameOne.playerOnePlayerName ||
          game.playerTwoTeamName === gameOne.playerOnePlayerName ||
          game.playerOneTeamName === gameOne.playerTwoPlayerName ||
          game.playerTwoTeamName === gameOne.playerTwoPlayerName ||
          game.playerOneTeamName === gameTwo.playerOnePlayerName ||
          game.playerTwoTeamName === gameTwo.playerOnePlayerName ||
          game.playerOneTeamName === gameTwo.playerTwoPlayerName ||
          game.playerTwoTeamName === gameTwo.playerTwoPlayerName) {

          const playerGame = that.afoDatabase.object('tournament-games/' + gameOne.tournamentId + '/' + game.id);
          playerGame.remove();
        }
      }
    });

    this.createPlayerGamesForTeamMatch(gameOne, allPlayers, allRankingsForRound);
    this.createPlayerGamesForTeamMatch(gameTwo, allPlayers, allRankingsForRound);
  }

  createPlayerGamesForTeamMatch(teamMatch: TournamentGame,
                                allPlayers: TournamentPlayer[],
                                allRankingsForRound: TournamentRanking[]) {

    const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);

    const teamOnePlayers = _.filter(allPlayers, function (player: TournamentPlayer) {
      return teamMatch.playerOnePlayerName === player.teamName;
    });
    const teamTwoPlayers = _.filter(allPlayers, function (player: TournamentPlayer) {
      return teamMatch.playerTwoPlayerName === player.teamName;
    });

    if (teamMatch.playerOneTournamentPlayerId === 'bye') {
      this.byeService.handleTeamOneIsBye(teamMatch, teamTwoPlayers, allRankingsForRound);
    }

    if (teamMatch.playerTwoTournamentPlayerId === 'bye') {
      this.byeService.handleTeamTwoIsBye(teamMatch, teamOnePlayers, allRankingsForRound);
    }
    if (teamMatch.playerOneTournamentPlayerId !== 'bye' && teamMatch.playerTwoTournamentPlayerId !== 'bye') {
      _.forEach(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {

        const newTeamGame = new TournamentGame(
          teamMatch.tournamentId,
          playerOne.playerId ? playerOne.playerId : '', playerOne.id,
          playerOne.playerName, playerOne.teamName,
          playerOne.elo ? playerOne.elo : 0, playerOne.faction,
          0, 0, 0, '', 0, 0,
          teamTwoPlayers[index].playerId ? teamTwoPlayers[index].playerId : '',
          teamTwoPlayers[index].id,
          teamTwoPlayers[index].playerName,
          teamTwoPlayers[index].teamName,
          teamTwoPlayers[index].elo ? teamTwoPlayers[index].elo : 0,
          teamTwoPlayers[index].faction,
          0, 0, 0, '', 0, 0,
          teamMatch.tournamentRound, index + 1, false, '');

        console.log('newPlayerGame: ' + JSON.stringify(newTeamGame));

        teamGamesRef.push(newTeamGame);
      });
    }
  }

}
