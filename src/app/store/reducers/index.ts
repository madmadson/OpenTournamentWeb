import {ActionReducerMap} from '@ngrx/store';
import {RouterStateUrl} from '../../../../shared/utils';

import * as fromRouter from '@ngrx/router-store';

import * as fromGames from '../../games/games-reducer';
import * as fromAuthentication from '../reducers/authenticationReducer';
import * as fromMyTournaments from '../../my-site/tournaments/my-tournaments-reducer';
import * as fromMyRegistrations from '../../my-site/registrations/my-registrations-reducer';
import * as fromMyGames from '../../my-site/games/my-games-reducer';
import * as fromPlayers from '../../player/players-reducer';
import * as fromActualTournament from '../../tournament/store/actual-tournament-reducer';
import * as fromTournaments from '../../tournaments/tournaments-reducer';
import * as fromActualTournamentGames from '../../tournament/store/actual-tournament-games-reducer';
import * as fromActualTournamentRankings from '../../tournament/store/actual-tournament-rankings-reducer';
import * as fromActualTournamentPlayers from '../../tournament/store/actual-tournament-players-reducer';
import * as fromActualTournamentArmyLists from '../../tournament/store/actual-tournament-army-lists-reducer';
import * as fromActualTournamentRegistrations from '../../tournament/store/actual-tournament-registrations-reducer';


export interface AppState {
  games: fromGames.GamesState;
  tournaments: fromTournaments.TournamentsState;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  authentication: fromAuthentication.AuthenticationState;
  myTournaments: fromMyTournaments.MyTournamentsState;
  myRegistrations: fromMyRegistrations.MyRegistrationsState;
  myGames: fromMyGames.MyGamesState;
  players: fromPlayers.PlayersState;
  actualTournament: fromActualTournament.ActualTournamentState;
  actualTournamentGames: fromActualTournamentGames.ActualTournamentGamesState;
  actualTournamentRankings: fromActualTournamentRankings.ActualTournamentRankingsState;
  actualTournamentPlayers: fromActualTournamentPlayers.ActualTournamentPlayersState;
  actualTournamentArmyLists: fromActualTournamentArmyLists.ActualTournamentArmyListsState;
  actualTournamentRegistrations: fromActualTournamentRegistrations.ActualTournamentRegistrationsState;
}

export const reducers: ActionReducerMap<AppState> = {
  games: fromGames.gamesReducer,
  tournaments: fromTournaments.tournamentsReducer,
  routerReducer: fromRouter.routerReducer,
  authentication: fromAuthentication.authenticationReducer,
  myTournaments: fromMyTournaments.myTournamentsReducer,
  myRegistrations: fromMyRegistrations.myRegistrationsReducer,
  myGames: fromMyGames.myGamesReducer,
  players: fromPlayers.playersReducer,
  actualTournament: fromActualTournament.actualTournamentReducer,
  actualTournamentGames: fromActualTournamentGames.actualTournamentGamesReducer,
  actualTournamentRankings: fromActualTournamentRankings.actualTournamentRankiongsReducer,
  actualTournamentPlayers: fromActualTournamentPlayers.playersReducer,
  actualTournamentArmyLists: fromActualTournamentArmyLists.actualTournamentArmyListsReducer,
  actualTournamentRegistrations: fromActualTournamentRegistrations.actualTournamentRegistrationsReducer,
};
