

export class TournamentTeam {

  id?: string;
  tournamentId: string;
  creatorUid: string;
  teamName: string;
  country: string;
  meta: string;
  isAcceptedTournamentTeam: boolean;

  static fromJson({tournamentId, creatorUid,  teamName, country, meta, isAcceptedTournamentTeam}): TournamentTeam {
    return new TournamentTeam(tournamentId, creatorUid,  teamName, country, meta, isAcceptedTournamentTeam);
  }
  constructor(tournamentId: string, creatorUid: string,
              teamName: string, country: string, meta: string, isAcceptedTournamentTeam: boolean) {

    this.tournamentId = tournamentId;

    this.creatorUid = creatorUid;
    this.teamName = teamName;
    this.country = country;
    this.meta = meta;
    this.isAcceptedTournamentTeam = isAcceptedTournamentTeam;
  }
}
