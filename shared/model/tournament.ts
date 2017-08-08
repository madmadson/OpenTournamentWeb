

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
  creatorMail: string;
  dailyMail: boolean;
  finished: boolean;
  uploaded: boolean;
  payLink: string;
  description: string;

  coOrganizators: string[];

  static fromJson({name, location, beginDate, endDate,
                    maxParticipants, actualParticipants,
                    teamSize, actualRound, visibleRound, creatorUid, creatorMail,
                    dailyMail, finished, uploaded, payLink, description, coOrganizators}): Tournament {
    return new Tournament(
      name, location,
      beginDate, endDate,
      maxParticipants, actualParticipants, teamSize, actualRound,
      visibleRound, creatorUid, creatorMail, dailyMail,
      finished, uploaded, payLink, description, coOrganizators);
  }


  constructor(name: string, location: string, beginDate: string, endDate: string,
              maxParticipants: number, actualParticipants: number, teamSize: number, actualRound: number,
              visibleRound: number, creatorUid: string, creatorMail: string,
              dailyMail: boolean, finished: boolean, uploaded: boolean, payLink: string, description: string,
              coOrganizators: string[]) {
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
    this.creatorMail = creatorMail;
    this.dailyMail = dailyMail;
    this.finished = finished;
    this.uploaded = uploaded;
    this.payLink = payLink;
    this.description = description;
    this.coOrganizators = coOrganizators;

  }
}


