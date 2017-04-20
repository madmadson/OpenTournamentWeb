

export class Tournament {

  id?: string;
  name: string;
  location: string;
  beginDate: string;
  endDate: string;
  maxParticipants: number;
  actualParticipants: number;
  teamSize: number;
  actualRound: number;
  visibleRound: number;
  creatorUid: string;

  static fromJson({name, location, beginDate, endDate,
                    maxParticipants, actualParticipants,  teamSize, actualRound, visibleRound, creatorUid}): Tournament {
    return new Tournament(
      name, location,
      beginDate, endDate,
      maxParticipants, actualParticipants, teamSize, actualRound, visibleRound, creatorUid);
  }


  constructor(name: string, location: string, beginDate: string, endDate: string,
              maxParticipants: number, actualParticipants: number, teamSize: number, actualRound: number,
              visibleRound: number, creatorUid: string) {
    this.name = name;
    this.location = location;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.maxParticipants = maxParticipants;
    this.actualParticipants  = actualParticipants;
    this.teamSize = teamSize;
    this.actualRound = actualRound;
    this.visibleRound = visibleRound;
    this.creatorUid = creatorUid;
  }
}


