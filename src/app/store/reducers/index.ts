

import {ActionReducerMap} from '@ngrx/store';
import {RouterStateUrl} from '../../../../shared/utils';

import * as fromRouter from '@ngrx/router-store';

import * as fromGames from '../../games/games-reducer';
import * as fromAuthentication from '../reducers/authenticationReducer';



export interface AppState {
  games: fromGames.GamesState;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  authentication: fromAuthentication.AuthenticationState;
}

export const reducers: ActionReducerMap<AppState> = {
  games: fromGames.gamesReducer,
  routerReducer: fromRouter.routerReducer,
  authentication: fromAuthentication.authenticationReducer,
};
