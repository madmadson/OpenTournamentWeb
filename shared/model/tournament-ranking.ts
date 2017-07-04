export class TournamentRanking {


  id: string;

  tournamentId: string;
  tournamentPlayerId: string;
  playerId: string;

  playerName: string;
  faction: string;
  teamName: string;
  meta: string;
  origin: string;
  country: string;
  elo: number;

  score: number;

  // all accumulated score from single games
  secondScore: number;
  sos: number;
  controlPoints: number;
  victoryPoints: number;

  tournamentRound: number;
  opponentTournamentPlayerIds: string[];

  droppedInRound: number;

  static fromJson({tournamentId, tournamentPlayerId, playerId, playerName,
                    teamName, faction, origin, meta, country, elo, score, secondScore, sos,
                    controlPoints, victoryPoints, tournamentRound,  opponentTournamentPlayerIds, droppedInRound}): TournamentRanking {
    return new TournamentRanking(tournamentId, tournamentPlayerId, playerId,
      playerName, faction, teamName, origin, meta, country, elo, score, secondScore,
      sos, controlPoints, victoryPoints,
      tournamentRound, opponentTournamentPlayerIds, droppedInRound);
  }

  constructor(tournamentId: string, tournamentPlayerId: string, playerId: string, playerName: string, faction: string, teamName: string,
              origin: string, meta: string, country: string, elo: number, score: number, secondScore: number, sos: number,
              controlPoints: number, victoryPoints: number,
              tournamentRound: number, opponentTournamentPlayerIds: string[], droppedInRound) {

    this.tournamentId = tournamentId;
    this.tournamentPlayerId = tournamentPlayerId;
    this.playerId = playerId;

    this.playerName = playerName;
    this.faction = faction;
    this.teamName = teamName;
    this.origin = origin;
    this.meta = meta;
    this.country = country;
    this.elo = elo;

    this.score = score;
    this.secondScore = secondScore;
    this.sos = sos;
    this.controlPoints = controlPoints;
    this.victoryPoints = victoryPoints;

    this.tournamentRound = tournamentRound;
    this.opponentTournamentPlayerIds = opponentTournamentPlayerIds;

    this.droppedInRound = droppedInRound;
  }
}
