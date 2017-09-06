import * as _ from 'lodash';

export class TournamentGame {

  id: string;
  tournamentId: string;

  playerOnePlayerId: string;
  playerOneTournamentPlayerId: string;
  playerOnePlayerName: string;
  playerOneTeamName: string;
  playerOneFaction: string;
  playerOneElo: number;
  playerOneScore: number;
  playerOneControlPoints: number;
  playerOneVictoryPoints: number;
  playerOneArmyList: string;
  playerOneEloChanging: number;
  playerOneIntermediateResult: number;

  playerTwoPlayerId: string;
  playerTwoTournamentPlayerId: string;
  playerTwoPlayerName: string;
  playerTwoTeamName: string;
  playerTwoFaction: string;
  playerTwoElo: number;
  playerTwoScore: number;
  playerTwoControlPoints: number;
  playerTwoVictoryPoints: number;
  playerTwoArmyList: string;
  playerTwoEloChanging: number;
  playerTwoIntermediateResult: number;

  tournamentRound: number;
  playingField: number;
  finished: boolean;
  scenario: string;

  static fromJson({tournamentId, playerOnePlayerId, playerOneTournamentPlayerId,
                    playerOnePlayerName, playerOneTeamName, playerOneFaction, playerOneElo, playerOneScore,
                    playerOneControlPoints, playerOneVictoryPoints, playerOneArmyList,
                    playerOneEloChanging, playerOneIntermediateResult,
                    playerTwoPlayerId, playerTwoTournamentPlayerId, playerTwoPlayerName, playerTwoTeamName,
                    playerTwoFaction, playerTwoElo, playerTwoScore, playerTwoControlPoints,
                    playerTwoVictoryPoints, playerTwoArmyList, playerTwoEloChanging,
                    playerTwoIntermediateResult,
                    tournamentRound, playingField, finished, scenario
  }): TournamentGame {
    return new TournamentGame(tournamentId, playerOnePlayerId, playerOneTournamentPlayerId,
      playerOnePlayerName, playerOneTeamName, playerOneElo, playerOneFaction, playerOneScore,
      playerOneControlPoints, playerOneVictoryPoints, playerOneArmyList, playerOneEloChanging,
      playerOneIntermediateResult,
      playerTwoPlayerId, playerTwoTournamentPlayerId, playerTwoPlayerName, playerTwoTeamName,
      playerTwoElo,  playerTwoFaction, playerTwoScore, playerTwoControlPoints,
      playerTwoVictoryPoints, playerTwoArmyList, playerTwoEloChanging,
      playerTwoIntermediateResult,
      tournamentRound, playingField, finished, scenario);
  }

  constructor(tournamentId: string, playerOnePlayerId: string, playerOneTournamentPlayerId: string,
              playerOnePlayerName: string, playerOneTeamName: string,  playerOneElo: number,
              playerOneFaction: string, playerOneScore: number, playerOneControlPoints: number,
              playerOneVictoryPoints: number, playerOneArmyList: string, playerOneEloChanging: number,
              playerOneIntermediateResult: number,
              playerTwoPlayerId: string,
              playerTwoTournamentPlayerId: string, playerTwoPlayerName: string, playerTwoTeamName: string,
              playerTwoElo: number, playerTwoFaction: string,  playerTwoScore: number,
              playerTwoControlPoints: number, playerTwoVictoryPoints: number, playerTwoArmyList: string,
              playerTwoEloChanging: number,
              playerTwoIntermediateResult: number,
              tournamentRound: number, playingField: number, finished: boolean, scenario: string) {

    this.tournamentId = tournamentId;

    this.playerOnePlayerId = playerOnePlayerId;
    this.playerOneTournamentPlayerId = playerOneTournamentPlayerId;
    this.playerOnePlayerName = playerOnePlayerName;
    this.playerOneTeamName = playerOneTeamName;
    this.playerOneElo = playerOneElo;
    this.playerOneFaction = playerOneFaction;
    this.playerOneScore = playerOneScore;
    this.playerOneControlPoints = playerOneControlPoints;
    this.playerOneVictoryPoints = playerOneVictoryPoints;
    this.playerOneArmyList = playerOneArmyList;
    this.playerOneEloChanging = playerOneEloChanging;
    this.playerOneIntermediateResult = playerOneIntermediateResult;

    this.playerTwoPlayerId = playerTwoPlayerId;
    this.playerTwoTournamentPlayerId = playerTwoTournamentPlayerId;
    this.playerTwoPlayerName = playerTwoPlayerName;
    this.playerTwoTeamName = playerTwoTeamName;
    this.playerTwoElo = playerTwoElo;
    this.playerTwoFaction = playerTwoFaction;
    this.playerTwoScore = playerTwoScore;
    this.playerTwoControlPoints = playerTwoControlPoints;
    this.playerTwoVictoryPoints = playerTwoVictoryPoints;
    this.playerTwoArmyList = playerTwoArmyList;
    this.playerTwoEloChanging = playerTwoEloChanging;
    this.playerTwoIntermediateResult = playerTwoIntermediateResult;

    this.tournamentRound = tournamentRound;
    this.playingField = playingField;
    this.finished = finished;
    this.scenario = scenario;
  }
}

export function clearTournamentGame(gameBefore: TournamentGame): TournamentGame {

  const playerGameToClear = _.cloneDeep(gameBefore);

  playerGameToClear.playerOneScore = 0;
  playerGameToClear.playerOneControlPoints = 0;
  playerGameToClear.playerOneVictoryPoints = 0;
  playerGameToClear.playerOneArmyList = '';
  playerGameToClear.playerTwoScore = 0;
  playerGameToClear.playerTwoControlPoints = 0;
  playerGameToClear.playerTwoVictoryPoints = 0;
  playerGameToClear.playerTwoArmyList = '';
  playerGameToClear.finished = false;

  return playerGameToClear;
}
