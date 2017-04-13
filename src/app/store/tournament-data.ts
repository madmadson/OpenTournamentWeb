


import {Registration} from '../../../shared/model/registration';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyList} from '../../../shared/model/armyList';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {Tournament} from '../../../shared/model/tournament';


export interface TournamentData {

  actualTournament: Tournament;

  actualTournamentRegisteredPlayers: Registration[];
  actualTournamentPlayers: TournamentPlayer[];
  actualTournamentArmyLists: ArmyList[];
  actualTournamentGames: TournamentGame[];
  actualTournamentRankings: TournamentRanking[];
}

export const INITIAL_TOURNAMENT_DATA = {

  actualTournament: undefined,

  actualTournamentRegisteredPlayers: [],
  actualTournamentPlayers: [],
  actualTournamentArmyLists: [],
  actualTournamentGames: [],
  actualTournamentRankings: []
};

