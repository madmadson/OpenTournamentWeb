import * as moment from 'moment';
import {RegistrationVM} from '../../src/app/tournament/registration.vm';

export class Registration {

  id: string;
  tournamentId: string;
  playerName: string;
  origin: string;
  meta: string;
  registrationDate: string;
  teamName: string;
  playerId: string;
  teamId: string;
  country: string;
  elo: number;

  static fromJson({tournamentId, playerName,
                    origin, meta,
                    registrationDate, teamName, playerId, teamId, country, elo}): Registration {
    return new Registration(
      tournamentId, playerName, origin,
      meta, registrationDate,
      teamName, playerId, teamId, country, elo);
  }

  static fromRegistrationVM(registrationVM: RegistrationVM): Registration {
    return new Registration( registrationVM.tournamentId,
      registrationVM.playerName, registrationVM.origin, registrationVM.meta,
      moment(registrationVM.registrationDate).format(),
     registrationVM.teamName, registrationVM.playerId, registrationVM.teamId,
    registrationVM.country, registrationVM.elo);
  }

  constructor(tournamentId: string, playerName: string, origin: string,
              meta: string, registrationDate: string,
              teamName: string, playerId: string, teamId: string,
              country: string, elo: number) {

    this.tournamentId = tournamentId;
    this.playerName = playerName;
    this.origin = origin;
    this.meta = meta;
    this.registrationDate = registrationDate;
    this.teamName = teamName;
    this.playerId = playerId;
    this.teamId = teamId;
    this.country = country;
    this.elo = elo;
  }
}


