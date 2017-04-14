

import {RouterState} from '@ngrx/router-store';

import {TournamentStoreData} from './reducers/tournamentsReducer';
import {AuthenticationStoreData} from './reducers/authenticationReducer';
import {PlayerStoreData} from './reducers/playersReducer';
import {ActualTournamentStoreData} from './reducers/tournamentReducer';


export interface ApplicationState {

  routerState: RouterState;
  tournamentStoreData: TournamentStoreData;
  playerStoreData: PlayerStoreData;
  authenticationStoreData: AuthenticationStoreData;


  actualTournamentData: ActualTournamentStoreData;


}

