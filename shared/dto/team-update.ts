


import {TournamentTeam} from '../model/tournament-team';
import {TournamentPlayer} from '../model/tournament-player';
import {ArmyList} from "../model/armyList";

export class TeamUpdate {

  team: TournamentTeam;
  tournamentPlayers: TournamentPlayer[];
  armyLists: ArmyList[];
}
