import {INITIAL_UI_STATE, UiState} from './ui-state';
import {INITIAL_STORE_DATA, StoreData} from './store-data';
import {RouterState} from '@ngrx/router-store';
import {INITIAL_TOURNAMENT_DATA, TournamentData} from './tournament-data';

export interface ApplicationState {

  router: RouterState;
  uiState: UiState;
  storeData: StoreData;
  tournamentData: TournamentData;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
  uiState: INITIAL_UI_STATE,
  storeData: INITIAL_STORE_DATA,
  tournamentData: INITIAL_TOURNAMENT_DATA,
  router: {
    path: '/login-page'
  }
};
