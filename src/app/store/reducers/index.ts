

import {ActionReducerMap} from '@ngrx/store';
import {RouterStateUrl} from '../../../../shared/utils';

import * as fromRouter from '@ngrx/router-store';

import * as fromGames from '../../games/games-reducer';
import * as fromAuthentication from '../reducers/authenticationReducer';
import * as fromMySite from '../reducers/mySiteReducer';
import * as fromPlayers from '../reducers/playersReducer';
import * as fromActualTournament from '../../tournament/actual-tournament-reducer';
import * as fromTournaments from '../../tournaments/tournaments-reducer';




export interface AppState {
  games: fromGames.GamesState;
  tournaments: fromTournaments.TournamentsState;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  authentication: fromAuthentication.AuthenticationState;
  mySite: fromMySite.MySiteState;
  players: fromPlayers.PlayersState;
  actualTournament: fromActualTournament.ActualTournamentState;

}

export const reducers: ActionReducerMap<AppState> = {
  games: fromGames.gamesReducer,
  tournaments: fromTournaments.tournamentsReducer,
  routerReducer: fromRouter.routerReducer,
  authentication: fromAuthentication.authenticationReducer,
  mySite: fromMySite.mySiteReducer,
  players: fromPlayers.playersReducer,
  actualTournament: fromActualTournament.actualTournamentReducer
};
