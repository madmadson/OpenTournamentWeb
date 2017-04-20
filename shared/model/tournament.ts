

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
  finished: boolean;
  uploaded: boolean;

  static fromJson({name, location, beginDate, endDate,
                    maxParticipants, actualParticipants,
                    teamSize, actualRound, visibleRound, creatorUid,
                    finished, uploaded}): Tournament {
    return new Tournament(
      name, location,
      beginDate, endDate,
      maxParticipants, actualParticipants, teamSize, actualRound, visibleRound, creatorUid,
      finished, uploaded);
  }


  constructor(name: string, location: string, beginDate: string, endDate: string,
              maxParticipants: number, actualParticipants: number, teamSize: number, actualRound: number,
              visibleRound: number, creatorUid: string, finished: boolean, uploaded: boolean) {
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
    this.finished = finished;
    this.uploaded = uploaded;
  }
}


