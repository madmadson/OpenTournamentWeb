import {ArmyList} from './armyList';

export class Registration {

  id: string;
  tournamentId: string;
  playerName: string;
  email: string;
  origin: string;
  meta: string;
  registrationDate: string;
  teamName: string;
  playerId: string;
  teamId: string;
  country: string;
  elo: number;
  faction: string;
  armyLists: ArmyList[];

  static fromJson({tournamentId, playerName, email,
                    origin, meta,
                    registrationDate, teamName, playerId, teamId, country, elo, faction}): Registration {
    return new Registration(
      tournamentId, playerName, email, origin,
      meta, registrationDate,
      teamName, playerId, teamId, country, elo, faction);
  }


  constructor(tournamentId: string, playerName: string, email: string, origin: string,
              meta: string, registrationDate: string,
              teamName: string, playerId: string, teamId: string,
              country: string, elo: number, faction: string) {

    this.tournamentId = tournamentId;
    this.playerName = playerName;
    this.email = email;
    this.origin = origin;
    this.meta = meta;
    this.registrationDate = registrationDate;
    this.teamName = teamName;
    this.playerId = playerId;
    this.teamId = teamId;
    this.country = country;
    this.elo = elo;
    this.faction = faction;
    this.armyLists = [];
  }
}


