import {TournamentVM} from "../../src/app/tournament/tournament.vm";

import * as moment from "moment";

export class Tournament {

  id: string;
  name: string;
  location: string;
  beginDate: string;
  endDate: string;
  maxParticipants: number;
  teamSize: number;
  actualRound: number;
  creatorUid: string;

  static fromJson({actualRound,
                    beginDate, endDate,
                    location, maxParticipants, name, teamSize, creatorUid}): Tournament {
    return new Tournament(
      name, location,
      beginDate, endDate,
      maxParticipants, teamSize, actualRound, creatorUid);
  }

  static fromTournamentVM(tournamentVM: TournamentVM): Tournament {
    return new Tournament(
      tournamentVM.name, tournamentVM.location,
      moment(new Date(tournamentVM.beginDate)).toISOString(), moment(new Date(tournamentVM.endDate)).toISOString(),
      tournamentVM.maxParticipants, tournamentVM.teamSize, 0, tournamentVM.creatorUid);
  }

  constructor(name: string, location: string,
              beginDate: string, endDate: string,
              maxParticipants: number, teamSize: number, actualRound: number, creatorUid: string) {
    this.name = name;
    this.location = location;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.maxParticipants = maxParticipants;
    this.teamSize = teamSize;
    this.actualRound = actualRound;
    this.creatorUid = creatorUid;
  }
}


