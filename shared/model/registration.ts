import * as moment from "moment";
import {RegistrationVM} from "../../src/app/tournament/registration.vm";

export class Registration {

  id: string;
  tournamentId: string;
  name: string;
  origin: string;
  meta: string;
  registrationDate: string;
  teamName: string;
  playerId: string;
  teamId: string;

  static fromJson({tournamentId, name,
                    origin, meta,
                    registrationDate, teamName, playerId, teamId}): Registration {
    return new Registration(
      tournamentId, name, origin,
      meta, registrationDate,
      teamName, playerId, teamId);
  }

  static fromRegistrationVM(registrationVM: RegistrationVM): Registration {
    return new Registration( registrationVM.tournamentId,
      registrationVM.name, registrationVM.origin, registrationVM.meta,
      moment(registrationVM.registrationDate).format(),
     registrationVM.teamName, registrationVM.playerId, registrationVM.teamId);
  }

  constructor(tournamentId: string, name: string, origin: string,
              meta: string, registrationDate: string,
              teamName: string, playerId: string, teamId: string) {

    this.tournamentId = tournamentId;
    this.name = name;
    this.origin = origin;
    this.meta = meta;
    this.registrationDate = registrationDate;
    this.teamName = teamName;
    this.playerId = playerId;
    this.teamId = teamId;
  }
}


