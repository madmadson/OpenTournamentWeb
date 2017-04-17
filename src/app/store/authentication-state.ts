

import {Player} from '../../../shared/model/player';
import {UserData} from '../../../shared/model/userData';

export interface AuthenticationStoreState {
  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  currentUserEmail: string;
  loggedIn: boolean;
  redirectUrl: string;

  userData:  UserData;
  userPlayerData: Player;
}
