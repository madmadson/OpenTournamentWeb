
import {GlobalData} from './global-store-data';
import {RouterState} from '@ngrx/router-store';
import {TournamentData} from './tournament-data';

export interface ApplicationState {

  routerState: RouterState;
  globalState: GlobalData;
  tournamentData: TournamentData;
}

