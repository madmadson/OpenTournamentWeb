
export class ArmyList {

  id: string;
  tournamentId: string;
  regId: string;
  playerId: string;
  playerName: string;
  name: string;
  list: string;

  static fromJson({tournamentId, regId, playerId, playerName, name, list}): ArmyList {
    return new ArmyList(
      tournamentId, regId, playerId, playerName, name, list);
  }

  constructor(tournamentId: string, regId: string, playerId: string, playerName: string, name: string,
              list: string) {

    this.tournamentId = tournamentId;
    this.regId = regId;
    this.playerId = playerId;
    this.playerName = playerName;
    this.name = name;
    this.list = list;
  }
}


