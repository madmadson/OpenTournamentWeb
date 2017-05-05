

export class TournamentTeam {

  id?: string;
  isRegisteredTeam: boolean;
  tournamentId: string;
  creatorUid: string;
  teamName: string;
  country: string;
  meta: string;
  isAcceptedTournamentTeam: boolean;

  static fromJson({isRegisteredTeam, tournamentId, creatorUid,  teamName, country, meta, isAcceptedTournamentTeam}): TournamentTeam {
    return new TournamentTeam(isRegisteredTeam, tournamentId, creatorUid,  teamName, country, meta, isAcceptedTournamentTeam);
  }
  constructor(isRegisteredTeam: boolean, tournamentId: string, creatorUid: string,
              teamName: string, country: string, meta: string, isAcceptedTournamentTeam: boolean) {

    this.isRegisteredTeam = isRegisteredTeam;
    this.tournamentId = tournamentId;

    this.creatorUid = creatorUid;
    this.teamName = teamName;
    this.country = country;
    this.meta = meta;
    this.isAcceptedTournamentTeam = isAcceptedTournamentTeam;
  }
}
