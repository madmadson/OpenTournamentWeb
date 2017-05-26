export class TournamentTeam {

  id?: string;
  isRegisteredTeam: boolean;
  tournamentId: string;
  creatorUid: string;
  teamName: string;
  country: string;
  meta: string;
  isAcceptedTournamentTeam: boolean;

  tournamentPlayerIds?: string[];
  registeredPlayerIds?: string[];

  static fromJson({isRegisteredTeam, tournamentId, creatorUid, teamName, country,
                    meta, isAcceptedTournamentTeam, tournamentPlayerIds, registeredPlayerIds}): TournamentTeam {
    return new TournamentTeam(isRegisteredTeam, tournamentId, creatorUid, teamName, country,
      meta, isAcceptedTournamentTeam, tournamentPlayerIds, registeredPlayerIds);
  }

  constructor(isRegisteredTeam: boolean, tournamentId: string, creatorUid: string,
              teamName: string, country: string, meta: string, isAcceptedTournamentTeam: boolean,
              tournamentPlayerIds: string[], registeredPlayerIds: string[]) {

    this.isRegisteredTeam = isRegisteredTeam;
    this.tournamentId = tournamentId;

    this.creatorUid = creatorUid;
    this.teamName = teamName;
    this.country = country;
    this.meta = meta;
    this.isAcceptedTournamentTeam = isAcceptedTournamentTeam;
    this.tournamentPlayerIds = tournamentPlayerIds ? tournamentPlayerIds : [];
    this.registeredPlayerIds = registeredPlayerIds ? registeredPlayerIds : [];
  }
}
