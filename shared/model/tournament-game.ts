

export class TournamentGame {

  id: string;
  tournamentId: string;

  playerOnePlayerId: string;
  playerOnePlayerName: string;
  playerOneScore: number;
  playerOneControlPoints: number;
  playerOneVictoryPoints: number;
  playerOneArmyList: string;

  playerTwoPlayerId: string;
  playerTwoPlayerName: string;
  playerTwoScore: number;
  playerTwoControlPoints: number;
  playerTwoVictoryPoints: number;
  playerTwoArmyList: string;

  playingField: number;
  tournamentRound: number;
  finished: boolean;
  scenario: string;

  static fromJson({tournamentId, playerOnePlayerId, playerOnePlayerName, playerOneScore,
                    playerOneControlPoints, playerOneVictoryPoints, playerOneArmyList,
                    playerTwoPlayerId, playerTwoPlayerName, playerTwoScore, playerTwoControlPoints,
                    playerTwoVictoryPoints, playerTwoArmyList,
                    playingField, tournamentRound, finished, scenario
  }): TournamentGame {
    return new TournamentGame(tournamentId, playerOnePlayerId, playerOnePlayerName, playerOneScore,
      playerOneControlPoints, playerOneVictoryPoints, playerOneArmyList,
      playerTwoPlayerId, playerTwoPlayerName, playerTwoScore, playerTwoControlPoints,
      playerTwoVictoryPoints, playerTwoArmyList,
      playingField, tournamentRound, finished, scenario);
  }

  constructor(tournamentId: string, playerOnePlayerId: string, playerOnePlayerName: string,
              playerOneScore: number, playerOneControlPoints: number, playerOneVictoryPoints: number,
              playerOneArmyList: string, playerTwoPlayerId: string,
              playerTwoPlayerName: string, playerTwoScore: number, playerTwoControlPoints: number,
              playerTwoVictoryPoints: number, playerTwoArmyList: string,
              tournamentRound: number, playingField: number, finished: boolean, scenario: string) {

    this.tournamentId = tournamentId;

    this.playerOnePlayerId = playerOnePlayerId;
    this.playerOnePlayerName = playerOnePlayerName;
    this.playerOneScore = playerOneScore;
    this.playerOneControlPoints = playerOneControlPoints;
    this.playerOneVictoryPoints = playerOneVictoryPoints;
    this.playerOneArmyList = playerOneArmyList;

    this.playerTwoPlayerId = playerTwoPlayerId;
    this.playerTwoPlayerName = playerTwoPlayerName;
    this.playerTwoScore = playerTwoScore;
    this.playerTwoControlPoints = playerTwoControlPoints;
    this.playerTwoVictoryPoints = playerTwoVictoryPoints;
    this.playerTwoArmyList = playerTwoArmyList;

    this.tournamentRound = tournamentRound;
    this.playingField = playingField;
    this.finished = finished;
    this.scenario = scenario;
  }
}
