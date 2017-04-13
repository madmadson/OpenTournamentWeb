export class TournamentRanking {

  id: string;

  tournamentId: string;
  playerId: string;
  score: number;
  sos: number;
  controlPoints: number;
  victoryPoints: number;

  tournamentRound: number;
  opponentPlayerIds: string[];

  static fromJson({tournamentId, playerId, score, sos,
                    controlPoints, victoryPoints, tournamentRound,  opponentPlayerIds}): TournamentRanking {
    return new TournamentRanking(tournamentId, playerId, score,
      sos, controlPoints, victoryPoints,
      tournamentRound, opponentPlayerIds);
  }

  constructor(playerId: string, tournamentId: string, score: number, sos: number,
              controlPoints: number, victoryPoints: number,
              tournamentRound: number, opponentPlayerIds: string[]) {

    this.playerId = playerId;
    this.tournamentId = tournamentId;
    this.score = score;
    this.sos = sos;
    this.controlPoints = controlPoints;
    this.victoryPoints = victoryPoints;

    this.tournamentRound = tournamentRound;
    this.opponentPlayerIds = opponentPlayerIds;
  }


}
