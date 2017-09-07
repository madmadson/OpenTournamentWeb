import {ActionReducerMap} from '@ngrx/store';
import {RouterStateUrl} from '../../../../shared/utils';

import * as fromRouter from '@ngrx/router-store';

import * as fromGames from '../../games/games-reducer';
import * as fromAuthentication from '../reducers/authenticationReducer';
import * as fromMySite from '../reducers/mySiteReducer';
import * as fromPlayers from '../reducers/playersReducer';
import * as fromActualTournament from '../../tournament/store/actual-tournament-reducer';
import * as fromTournaments from '../../tournaments/tournaments-reducer';
import * as fromActualTournamentGames from '../../tournament/store/actual-tournament-games-reducer';
import * as fromActualTournamentRankings from '../../tournament/store/actual-tournament-rankings-reducer';
import * as fromActualTournamentPlayers from '../../tournament/store/actual-tournament-players-reducer';
import * as fromActualTournamentArmyLists from '../../tournament/store/actual-tournament-army-lists-reducer';


export interface AppState {
  games: fromGames.GamesState;
  tournaments: fromTournaments.TournamentsState;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  authentication: fromAuthentication.AuthenticationState;
  mySite: fromMySite.MySiteState;
  players: fromPlayers.PlayersState;
  actualTournament: fromActualTournament.ActualTournamentState;
  actualTournamentGames: fromActualTournamentGames.ActualTournamentGamesState;
  actualTournamentRankings: fromActualTournamentRankings.ActualTournamentRankingsState;
  actualTournamentPlayers: fromActualTournamentPlayers.ActualTournamentPlayersState;
  actualTournamentArmyLists: fromActualTournamentArmyLists.ActualTournamentArmyListsState;
}

export const reducers: ActionReducerMap<AppState> = {
  games: fromGames.gamesReducer,
  tournaments: fromTournaments.tournamentsReducer,
  routerReducer: fromRouter.routerReducer,
  authentication: fromAuthentication.authenticationReducer,
  mySite: fromMySite.mySiteReducer,
  players: fromPlayers.playersReducer,
  actualTournament: fromActualTournament.actualTournamentReducer,
  actualTournamentGames: fromActualTournamentGames.actualTournamentGamesReducer,
  actualTournamentRankings: fromActualTournamentRankings.actualTournamentRankiongsReducer,
  actualTournamentPlayers: fromActualTournamentPlayers.playersReducer,
  actualTournamentArmyLists: fromActualTournamentArmyLists.actualTournamentArmyListsReducer,
};
