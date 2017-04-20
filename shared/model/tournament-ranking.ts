export class TournamentRanking {


  id: string;

  tournamentId: string;
  tournamentPlayerId: string;
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
  opponentTournamentPlayerIds: string[];



  static fromJson({tournamentId, tournamentPlayerId, playerId, playerName,
                    teamName, faction, origin, meta, elo, score, sos,
                    controlPoints, victoryPoints, tournamentRound,  opponentTournamentPlayerIds}): TournamentRanking {
    return new TournamentRanking(tournamentId, tournamentPlayerId, playerId,
      playerName, faction, teamName, origin, meta, elo, score,
      sos, controlPoints, victoryPoints,
      tournamentRound, opponentTournamentPlayerIds);
  }

  public setScore(score: number) {

  }

  constructor(tournamentId: string, tournamentPlayerId: string, playerId: string, playerName: string, faction: string, teamName: string,
              origin: string, meta: string, elo: number, score: number, sos: number,
              controlPoints: number, victoryPoints: number,
              tournamentRound: number, opponentTournamentPlayerIds: string[]) {

    this.tournamentId = tournamentId;
    this.tournamentPlayerId = tournamentPlayerId;
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
    this.opponentTournamentPlayerIds = opponentTournamentPlayerIds;
  }


}
