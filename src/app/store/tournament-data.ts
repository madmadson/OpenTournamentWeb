


import {Registration} from '../../../shared/model/registration';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
export interface TournamentData {


  actualTournamentRegisteredPlayers: Registration[];
  actualTournamentPlayers: TournamentPlayer[];
}

export const INITIAL_TOURNAMENT_DATA = {

  actualTournamentRegisteredPlayers: [

  ],

  actualTournamentPlayers: [

  ],
};

