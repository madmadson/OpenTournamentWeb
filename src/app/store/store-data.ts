import {UserData} from '../../../shared/model/userData';
import {Tournament} from '../../../shared/model/tournament';
import {Player} from '../../../shared/model/player';

import * as moment from 'moment';

export interface StoreData {

  userData:  UserData;
  playerData: Player;
  tournaments: Tournament[];
  players: Player[];
  actualTournament: Tournament;

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

  tournaments: [],

  players: [],
};
