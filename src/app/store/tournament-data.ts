


import {Registration} from '../../../shared/model/registration';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyList} from '../../../shared/model/armyList';

export interface TournamentData {


  actualTournamentRegisteredPlayers: Registration[];
  actualTournamentPlayers: TournamentPlayer[];
  actualTournamentArmyLists: ArmyList[];
}

export const INITIAL_TOURNAMENT_DATA = {

  actualTournamentRegisteredPlayers: [],
  actualTournamentPlayers: [],
  actualTournamentArmyLists: [],
};

