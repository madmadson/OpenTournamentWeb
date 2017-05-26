
export class ArmyList {

  id: string;
  tournamentId: string;
  regId: string;
  tournamentPlayerId: string;
  playerId: string;
  playerName: string;
  teamName: string;
  name: string;
  list: string;

  static fromJson({tournamentId, regId, tournamentPlayerId, playerId, playerName, teamName, name, list}): ArmyList {
    return new ArmyList(
      tournamentId, regId, tournamentPlayerId, playerId, playerName, teamName, name, list);
  }

  constructor(tournamentId: string, regId: string, tournamentPlayerId: string,
              playerId: string, playerName: string, teamName: string, name: string, list: string) {

    this.tournamentId = tournamentId;
    this.regId = regId;
    this.tournamentPlayerId = tournamentPlayerId;
    this.playerId = playerId;
    this.playerName = playerName;
    this.teamName = teamName;
    this.name = name;
    this.list = list;
  }
}


