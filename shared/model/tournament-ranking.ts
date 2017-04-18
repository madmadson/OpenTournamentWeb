export class TournamentRanking {

  id: string;

  tournamentId: string;
  playerId: string;

  playerName: string;
  faction: string;
  teamName: string;
  origin: string;
  meta: string;
  elo: number;

  score: number;
  sos: number;
  controlPoints: number;
  victoryPoints: number;

  tournamentRound: number;
  opponentPlayerIds: string[];

  static fromJson({tournamentId, playerId, playerName, teamName, faction, origin, meta, elo, score, sos,
                    controlPoints, victoryPoints, tournamentRound,  opponentPlayerIds}): TournamentRanking {
    return new TournamentRanking(tournamentId, playerId, playerName, faction, teamName, origin, meta, elo, score,
      sos, controlPoints, victoryPoints,
      tournamentRound, opponentPlayerIds);
  }

  constructor(tournamentId: string, playerId: string, playerName: string, faction: string, teamName: string,
              origin: string, meta: string, elo: number, score: number, sos: number,
              controlPoints: number, victoryPoints: number,
              tournamentRound: number, opponentPlayerIds: string[]) {

    this.tournamentId = tournamentId;
    this.playerId = playerId;

    this.playerName = playerName;
    this.faction = faction;
    this.teamName = teamName;
    this.origin = origin;
    this.meta = meta;
    this.elo = elo;

    this.score = score;
    this.sos = sos;
    this.controlPoints = controlPoints;
    this.victoryPoints = victoryPoints;

    this.tournamentRound = tournamentRound;
    this.opponentPlayerIds = opponentPlayerIds;
  }


}
