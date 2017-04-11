
export class ArmyList {

  id: string;
  tournamentId: string;
  playerId: string;
  name: string;
  list: string;

  static fromJson({tournamentId, playerId, name, list}): ArmyList {
    return new ArmyList(
      tournamentId, playerId, name, list);
  }

  constructor(tournamentId: string, playerId: string, name: string,
              list: string) {

    this.tournamentId = tournamentId;
    this.playerId = playerId;
    this.name = name;
    this.list = list;
  }
}


