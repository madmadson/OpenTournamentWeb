import {ArmyList} from './armyList';

export class Registration {

  id?: string;
  tournamentId: string;
  tournamentName: string;
  tournamentLocation: string;
  tournamentDate: string;
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
  isTournamentPlayer: boolean;

  static fromJson({ tournamentId, tournamentName, tournamentLocation, tournamentDate, playerName, email,
                    origin, meta,
                    registrationDate, teamName, playerId, teamId, country, elo, faction, isTournamentPlayer}): Registration {
    return new Registration(
      tournamentId, tournamentName, tournamentLocation, tournamentDate, playerName, email, origin,
      meta, registrationDate,
      teamName, playerId, teamId, country, elo, faction, isTournamentPlayer);
  }


  constructor(tournamentId: string, tournamentName: string, tournamentLocation: string, tournamentDate: string,
              playerName: string, email: string, origin: string,
              meta: string, registrationDate: string,
              teamName: string, playerId: string, teamId: string,
              country: string, elo: number, faction: string, isTournamentPlayer: boolean) {

    this.tournamentId = tournamentId;
    this.tournamentName = tournamentName;
    this.tournamentLocation = tournamentLocation;
    this.tournamentDate = tournamentDate;

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
    this.isTournamentPlayer = isTournamentPlayer;
  }
}


