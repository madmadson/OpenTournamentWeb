export class TournamentRanking {

  id: string;

  tournamentId: string;
  playerId: string;

  playerName: string;

  score: number;
  sos: number;
  controlPoints: number;
  victoryPoints: number;

  tournamentRound: number;
  opponentPlayerIds: string[];

  static fromJson({tournamentId, playerId, playerName, score, sos,
                    controlPoints, victoryPoints, tournamentRound,  opponentPlayerIds}): TournamentRanking {
    return new TournamentRanking(tournamentId, playerId, playerName, score,
      sos, controlPoints, victoryPoints,
      tournamentRound, opponentPlayerIds);
  }

  constructor(playerId: string, tournamentId: string, playerName: string, score: number, sos: number,
              controlPoints: number, victoryPoints: number,
              tournamentRound: number, opponentPlayerIds: string[]) {

    this.playerId = playerId;
    this.tournamentId = tournamentId;

    this.playerName = playerName;
    this.score = score;
    this.sos = sos;
    this.controlPoints = controlPoints;
    this.victoryPoints = victoryPoints;

    this.tournamentRound = tournamentRound;
    this.opponentPlayerIds = opponentPlayerIds;
  }


}
