import {Tournament} from '../../../shared/model/tournament';
import {Player} from '../../../shared/model/player';

import * as moment from 'moment';
import {UserData} from "../../../shared/model/userData";


export interface GlobalData {


  tournaments: Tournament[];
  players: Player[];

  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  currentUserEmail: string;
  loggedIn: boolean;
  redirectUrl: string;

  userData:  UserData;
  userPlayerData: Player;
  currentTournamentId: string;

}

export const INITIAL_GLOBAL_DATA = {

  tournaments: [],
  players: [],

  currentUserId: undefined,
  currentUserName: undefined,
  currentUserImage: undefined,
  currentUserEmail: undefined,
  loggedIn: false,
  redirectUrl: undefined,

  userPlayerData: undefined,
  userData: undefined,
  currentTournamentId: undefined

};
