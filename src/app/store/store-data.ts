import {UserData} from '../../../shared/model/userData';
import {Tournament} from '../../../shared/model/tournament';
import {Player} from '../../../shared/model/player';

import * as moment from 'moment';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {TournamentPlayer} from '../../../shared/model/tournament-player';


export interface StoreData {

  userData:  UserData;
  playerData: Player;
  tournaments: Tournament[];
  players: Player[];

  actualTournament: Tournament;
  actualTournamentPlayers: TournamentPlayer[];
  actualTournamentTeams: TournamentTeam[];


}

export const INITIAL_STORE_DATA = {

  userData: undefined,

  playerData: undefined,

  actualTournament: {
    id: '123',
    name: 'InitialTournament',
    location: 'Karlsruhe',
    beginDate: moment('2017-03-12').format(),
    endDate: moment('2017-03-12').format(),
    actualRound: 0,
    maxParticipants: 16,
    teamSize: 1,
    creatorUid: '1'
  },

  actualTournamentPlayers: [
    {
      id: '1',
      firstName: 'Franz',
      nickName: 'Franzerich',
      lastName: 'Lasti',
    }
  ],

  actualTournamentTeams: [
    {
      id: '444',
      name: 'TeamAwesome',
      country: 'Germany',
      meta: 'MetaFu'
    },
    {
      id: '666',
      name: 'TeamGooor',
      country: 'Germany',
      meta: 'FoLow'
    },
    {
      id: '445',
      name: 'TeamAwesome2',
      country: 'Germany',
      meta: 'MetaFu'
    },
  ],

  tournaments: [],

  players: [],
};
