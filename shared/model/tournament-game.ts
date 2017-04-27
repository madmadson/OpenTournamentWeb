

export class TournamentGame {

  id: string;
  tournamentId: string;

  playerOnePlayerId: string;
  playerOneTournamentPlayerId: string;
  playerOnePlayerName: string;
  playerOneFaction: string;
  playerOneElo: number;
  playerOneScore: number;
  playerOneControlPoints: number;
  playerOneVictoryPoints: number;
  playerOneArmyList: string;
  playerOneEloChanging: number;

  playerTwoPlayerId: string;
  playerTwoTournamentPlayerId: string;
  playerTwoPlayerName: string;
  playerTwoFaction: string;
  playerTwoElo: number;
  playerTwoScore: number;
  playerTwoControlPoints: number;
  playerTwoVictoryPoints: number;
  playerTwoArmyList: string;
  playerTwoEloChanging: number;

  playingField: number;
  tournamentRound: number;
  finished: boolean;
  scenario: string;

  static fromJson({tournamentId, playerOnePlayerId, playerOneTournamentPlayerId,
                    playerOnePlayerName, playerOneFaction, playerOneElo, playerOneScore,
                    playerOneControlPoints, playerOneVictoryPoints, playerOneArmyList,
                    playerOneEloChanging,
                    playerTwoPlayerId, playerTwoTournamentPlayerId, playerTwoPlayerName,
                    playerTwoFaction, playerTwoElo, playerTwoScore, playerTwoControlPoints,
                    playerTwoVictoryPoints, playerTwoArmyList, playerTwoEloChanging,
                    playingField, tournamentRound, finished, scenario
  }): TournamentGame {
    return new TournamentGame(tournamentId, playerOnePlayerId, playerOneTournamentPlayerId,
      playerOnePlayerName, playerOneElo, playerOneFaction, playerOneScore,
      playerOneControlPoints, playerOneVictoryPoints, playerOneArmyList, playerOneEloChanging,
      playerTwoPlayerId, playerTwoTournamentPlayerId, playerTwoPlayerName,
      playerTwoElo,  playerTwoFaction, playerTwoScore, playerTwoControlPoints,
      playerTwoVictoryPoints, playerTwoArmyList, playerTwoEloChanging,
      playingField, tournamentRound, finished, scenario);
  }

  constructor(tournamentId: string, playerOnePlayerId: string, playerOneTournamentPlayerId: string,
              playerOnePlayerName: string, playerOneElo: number,
              playerOneFaction: string, playerOneScore: number, playerOneControlPoints: number,
              playerOneVictoryPoints: number, playerOneArmyList: string, playerOneEloChanging: number,
              playerTwoPlayerId: string,
              playerTwoTournamentPlayerId: string, playerTwoPlayerName: string,
              playerTwoElo: number, playerTwoFaction: string,  playerTwoScore: number,
              playerTwoControlPoints: number, playerTwoVictoryPoints: number, playerTwoArmyList: string,
              playerTwoEloChanging: number,
              tournamentRound: number, playingField: number, finished: boolean, scenario: string) {

    this.tournamentId = tournamentId;

    this.playerOnePlayerId = playerOnePlayerId;
    this.playerOneTournamentPlayerId = playerOneTournamentPlayerId;
    this.playerOnePlayerName = playerOnePlayerName;
    this.playerOneElo = playerOneElo;
    this.playerOneFaction = playerOneFaction;
    this.playerOneScore = playerOneScore;
    this.playerOneControlPoints = playerOneControlPoints;
    this.playerOneVictoryPoints = playerOneVictoryPoints;
    this.playerOneArmyList = playerOneArmyList;
    this.playerOneEloChanging = playerOneEloChanging;

    this.playerTwoPlayerId = playerTwoPlayerId;
    this.playerTwoTournamentPlayerId = playerTwoTournamentPlayerId;
    this.playerTwoPlayerName = playerTwoPlayerName;
    this.playerTwoElo = playerTwoElo;
    this.playerTwoFaction = playerTwoFaction;
    this.playerTwoScore = playerTwoScore;
    this.playerTwoControlPoints = playerTwoControlPoints;
    this.playerTwoVictoryPoints = playerTwoVictoryPoints;
    this.playerTwoArmyList = playerTwoArmyList;
    this.playerTwoEloChanging = playerTwoEloChanging;

    this.tournamentRound = tournamentRound;
    this.playingField = playingField;
    this.finished = finished;
    this.scenario = scenario;
  }
}
