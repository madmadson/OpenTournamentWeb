

import {RouterState} from '@ngrx/router-store';

import {TournamentStoreData} from './reducers/tournamentsReducer';

import {PlayerStoreData} from './reducers/playersReducer';
import {ActualTournamentStoreData} from './reducers/tournamentReducer';
import {ActualTournamentRegistrationsStoreData} from './reducers/tournamentRegistrationReducer';
import {ActualTournamentRankingsStoreData} from './reducers/tournamentRankingReducer';
import {ActualTournamentPlayersStoreData} from './reducers/tournamentPlayerReducer';
import {ActualTournamentArmyListsStoreData} from './reducers/tournamentArmyListReducer';
import {ActualTournamentGamesStoreData} from './reducers/tournamentGameReducer';
import {AuthenticationStoreState} from './authentication-state';


export interface ApplicationState {

  routerState: RouterState;
  tournaments: TournamentStoreData;
  players: PlayerStoreData;
  authenticationStoreState: AuthenticationStoreState;

  actualTournament: ActualTournamentStoreData;
  actualTournamentRegistrations: ActualTournamentRegistrationsStoreData;
  actualTournamentRankings: ActualTournamentRankingsStoreData;
  actualTournamentGames: ActualTournamentGamesStoreData;
  actualTournamentPlayers: ActualTournamentPlayersStoreData;
  actualTournamentArmyLists: ActualTournamentArmyListsStoreData;


}

