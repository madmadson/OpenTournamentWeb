

import {Registration} from './registration';
export class TournamentPlayer {

  id?: string;
  tournamentId: string;
  registrationId?: string;
  email?: string;
  playerId: string;
  playerName: string;
  elo?: number;
  meta?: string;
  origin?: string;
  country?: string;
  faction?: string;
  teamName?: string;
  droppedInRound: number;

  static fromJson({tournamentId, registrationId, email, playerId, playerName,
                    origin, meta, teamName,  country, elo, faction, droppedInRound}): TournamentPlayer {
    return new TournamentPlayer(tournamentId, registrationId, email,
      playerId, playerName, origin,
      meta, teamName, country, elo, faction, droppedInRound);
  }

  static fromRegistration(reg: Registration): TournamentPlayer {
    return new TournamentPlayer( reg.tournamentId, reg.id, reg.email, reg.playerId,
      reg.playerName, reg.origin, reg.meta,
      reg.teamName, reg.country, reg.elo, reg.faction, 0);
  }

  constructor(tournamentId: string, registrationId: string, email: string, playerId: string, playerName: string, origin: string,
              meta: string, teamName: string, country: string, elo: number, faction: string, droppedInRound: number) {

    this.tournamentId = tournamentId;
    this.registrationId = registrationId;
    this.email = email;
    this.playerId = playerId;
    this.playerName = playerName;
    this.origin = origin;
    this.meta = meta;
    this.teamName = teamName;
    this.country = country;
    this.elo = elo;
    this.faction = faction;
    this.droppedInRound = droppedInRound;
  }

}
