import {INITIAL_UI_STATE, AuthenticationState} from './authentication-state';
import {INITIAL_STORE_DATA, StoreData} from './store-data';
import {RouterState} from '@ngrx/router-store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from './tournament-data';

export interface ApplicationState {

  router: RouterState;
  authenticationState: AuthenticationState;
  storeData: StoreData;
  tournamentData: TournamentData;
}

