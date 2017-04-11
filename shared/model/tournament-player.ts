

import {Registration} from './registration';
export class TournamentPlayer {

  id: string;
  tournamentId: string;
  email: string;
  playerId: string;
  playerName: string;
  elo?: number;
  meta?: string;
  origin?: string;
  country?: string;
  faction?: string;
  teamName?: string;

  static fromJson({tournamentId, email, playerId, playerName,
                    origin, meta, teamName,  country, elo}): TournamentPlayer {
    return new TournamentPlayer(tournamentId, email,
      playerId, playerName, origin,
      meta, teamName, country, elo);
  }

  static fromRegistration(reg: Registration): TournamentPlayer {
    return new TournamentPlayer( reg.tournamentId, reg.email, reg.playerId,
      reg.playerName, reg.origin, reg.meta,
      reg.teamName, reg.country, reg.elo);
  }

  constructor(tournamentId: string, email: string, playerId: string, playerName: string, origin: string,
              meta: string, teamName: string, country: string, elo: number) {

    this.tournamentId = tournamentId;
    this.email = email;
    this.playerId = playerId;
    this.playerName = playerName;
    this.origin = origin;
    this.meta = meta;
    this.teamName = teamName;
    this.country = country;
    this.elo = elo;
  }

}
