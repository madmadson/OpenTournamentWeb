export class Tournament {

  id: string;
  name: string;
  location: string;
  beginDate: string;
  endDate: string;
  maxParticipants: number;
  teamSize: number;
  actualRound: number;


  static fromJson({actualRound,
                    beginDate, endDate,
                    location, maxParticipants, name, teamSize}): Tournament {
    return new Tournament(
      name, location,
      beginDate, endDate,
      maxParticipants, teamSize, actualRound);
  }

  constructor(name: string, location: string,
              beginDate: string, endDate: string,
              maxParticipants: number, teamSize: number, actualRound: number) {
    this.name = name;
    this.location = location;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.maxParticipants = maxParticipants;
    this.teamSize = teamSize;
    this.actualRound = actualRound;
  }


}


