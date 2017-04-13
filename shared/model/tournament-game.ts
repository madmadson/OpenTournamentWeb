

export class TournamentGame {

  id: string;

  playerOnePlayerId: string;
  playerOnePlayerName: string;
  playerOneScore: number;
  playerOneControlPoints: number;
  playerOneVictoryPoints: number;
  playerOneArmyList: string;
  playerOneElo: number;

  playerTwoPlayerId: string;
  playerTwoPlayerName: string;
  playerTwoScore: number;
  playerTwoControlPoints: number;
  playerTwoVictoryPoints: number;
  playerTwoArmyList: string;
  playerTwoElo: number;

  playingField: number;
  tournamentRound: number;
  finished: boolean;
  scenario: string;

  constructor(playerOnePlayerId: string, playerOnePlayerName: string, playerOneScore: number,
              playerOneControlPoints: number, playerOneVictoryPoints: number,
              playerOneArmyList: string, playerOneElo: number, playerTwoPlayerId: string,
              playerTwoPlayerName: string, playerTwoScore: number, playerTwoControlPoints: number,
              playerTwoVictoryPoints: number, playerTwoArmyList: string, playerTwoElo: number,
              tournamentRound: number, playingField: number, finished: boolean, scenario: string) {

    this.playerOnePlayerId = playerOnePlayerId;
    this.playerOnePlayerName = playerOnePlayerName;
    this.playerOneScore = playerOneScore;
    this.playerOneControlPoints = playerOneControlPoints;
    this.playerOneVictoryPoints = playerOneVictoryPoints;
    this.playerOneArmyList = playerOneArmyList;
    this.playerOneElo = playerOneElo;

    this.playerTwoPlayerId = playerTwoPlayerId;
    this.playerTwoPlayerName = playerTwoPlayerName;
    this.playerTwoScore = playerTwoScore;
    this.playerTwoControlPoints = playerTwoControlPoints;
    this.playerTwoVictoryPoints = playerTwoVictoryPoints;
    this.playerTwoArmyList = playerTwoArmyList;
    this.playerTwoElo = playerTwoElo;

    this.tournamentRound = tournamentRound;
    this.playingField = playingField;
    this.finished = finished;
    this.scenario = scenario;
  }
}
