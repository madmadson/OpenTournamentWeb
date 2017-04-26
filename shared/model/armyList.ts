
export class ArmyList {

  id: string;
  tournamentId: string;
  regId: string;
  playerId: string;
  name: string;
  list: string;

  static fromJson({tournamentId, regId, playerId, name, list}): ArmyList {
    return new ArmyList(
      tournamentId, regId, playerId, name, list);
  }

  constructor(tournamentId: string, regId: string, playerId: string, name: string,
              list: string) {

    this.tournamentId = tournamentId;
    this.regId = regId;
    this.playerId = playerId;
    this.name = name;
    this.list = list;
  }
}


