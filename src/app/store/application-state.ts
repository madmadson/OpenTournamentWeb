

import * as fromRouter from '@ngrx/router-store';

import {TournamentStoreData} from './reducers/tournamentsReducer';

import {PlayerStoreData} from './reducers/playersReducer';
import {ActualTournamentStoreData} from './reducers/tournamentReducer';
import {ActualTournamentRegistrationsStoreData} from './reducers/tournamentRegistrationReducer';
import {ActualTournamentRankingsStoreData} from './reducers/tournamentRankingReducer';
import {ActualTournamentPlayersStoreData} from './reducers/tournamentPlayerReducer';
import {ActualTournamentArmyListsStoreData} from './reducers/tournamentArmyListReducer';
import {ActualTournamentGamesStoreData} from './reducers/tournamentGameReducer';
import {AuthenticationStoreState} from './authentication-state';
import {MySiteStoreData} from './reducers/mySiteReducer';
import {ActualTournamentTeamsStoreData} from './reducers/tournamentTeamReducer';
import {ActualTournamentTeamGamesStoreData} from './reducers/tournamentTeamGameReducer';
import {ActualTournamentTeamRankingsStoreData} from './reducers/tournamentTeamRankingReducer';



export interface ApplicationState {

  routerState: fromRouter.RouterReducerState;
  tournaments: TournamentStoreData;
  players: PlayerStoreData;
  authenticationStoreState: AuthenticationStoreState;
  mySiteSoreData: MySiteStoreData;

  actualTournament: ActualTournamentStoreData;
  actualTournamentRegistrations: ActualTournamentRegistrationsStoreData;
  actualTournamentRankings: ActualTournamentRankingsStoreData;
  actualTournamentTeamRankings: ActualTournamentTeamRankingsStoreData;
  actualTournamentGames: ActualTournamentGamesStoreData;
  actualTournamentTeamGames: ActualTournamentTeamGamesStoreData;
  actualTournamentPlayers: ActualTournamentPlayersStoreData;
  actualTournamentArmyLists: ActualTournamentArmyListsStoreData;
  actualTournamentTeams: ActualTournamentTeamsStoreData;


}

