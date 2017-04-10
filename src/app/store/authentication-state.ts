
import {UserData} from '../../../shared/model/userData';
import {Player} from '../../../shared/model/player';
export interface AuthenticationState {

  currentUserId: string;
  currentUserName: string;
  currentUserImage: string;
  loggedIn: boolean;
  redirectUrl: string;

  userData:  UserData;
  userPlayerData: Player;
  currentTournamentId: string;
}

export const INITIAL_UI_STATE: AuthenticationState = {

    currentUserId: undefined,
    currentUserName: undefined,
    currentUserImage: undefined,
    loggedIn: false,
    redirectUrl: undefined,

    userPlayerData: undefined,
    userData: undefined,
    currentTournamentId: undefined
};
