export class TournamentTeam {

  id?: string;
  isRegisteredTeam: boolean;
  tournamentId: string;
  creatorUid: string;
  teamName: string;
  country: string;
  meta: string;
  isAcceptedTournamentTeam: boolean;
  armyListsChecked: boolean;
  paymentChecked: boolean;
  playerMarkedPayment: boolean;
  playerUploadedArmyLists: boolean;
  creatorMail: string;
  leaderName: string;

  tournamentPlayerIds?: string[];
  registeredPlayerIds?: string[];

  droppedInRound: number;

  static fromJson({isRegisteredTeam, tournamentId, creatorUid, teamName, country,
                    meta, isAcceptedTournamentTeam, tournamentPlayerIds,
                    registeredPlayerIds, creatorMail, leaderName,
                    armyListsChecked, paymentChecked, playerMarkedPayment, playerUploadedArmyLists, droppedInRound}): TournamentTeam {
    return new TournamentTeam(isRegisteredTeam, tournamentId, creatorUid, teamName, country,
      meta, isAcceptedTournamentTeam, tournamentPlayerIds, registeredPlayerIds, creatorMail, leaderName,
      armyListsChecked, paymentChecked, playerMarkedPayment, playerUploadedArmyLists, droppedInRound);
  }

  constructor(isRegisteredTeam: boolean, tournamentId: string, creatorUid: string,
              teamName: string, country: string, meta: string, isAcceptedTournamentTeam: boolean,
              tournamentPlayerIds: string[], registeredPlayerIds: string[], creatorMail: string, leaderName: string,
              armyListsChecked: boolean, paymentChecked: boolean,
              playerMarkedPayment: boolean, playerUploadedArmyLists: boolean, droppedInRound) {

    this.isRegisteredTeam = isRegisteredTeam;
    this.tournamentId = tournamentId;

    this.creatorUid = creatorUid;
    this.teamName = teamName;
    this.country = country;
    this.meta = meta;
    this.isAcceptedTournamentTeam = isAcceptedTournamentTeam;
    this.tournamentPlayerIds = tournamentPlayerIds ? tournamentPlayerIds : [];
    this.registeredPlayerIds = registeredPlayerIds ? registeredPlayerIds : [];
    this.creatorMail = creatorMail;
    this.leaderName = leaderName;
    this.armyListsChecked = armyListsChecked;
    this.paymentChecked = paymentChecked;
    this.playerMarkedPayment = playerMarkedPayment;
    this.playerUploadedArmyLists = playerUploadedArmyLists;
    this.droppedInRound = droppedInRound;
  }
}
