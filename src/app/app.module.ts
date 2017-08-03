
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TournamentListComponent} from './tournament/tournament-list/tournament-list.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {GameEditComponent} from './game-edit/game-edit.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {ActionReducer, combineReducers, StoreModule} from '@ngrx/store';
import 'rxjs/Rx';
import {ApplicationState} from './store/application-state';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {compose} from '@ngrx/core/compose';
import {environment} from '../environments/environment';

import {storeFreeze} from 'ngrx-store-freeze';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffectService} from './store/effects/auth-effect.service';
import {TournamentsEffectService} from './store/effects/tournaments-effect.service';
import {LoginService} from './service/auth.service';
import {TournamentsService} from './service/tournaments.service';
import {routerReducer, RouterStoreModule} from '@ngrx/router-store';
import {MomentModule} from 'angular2-moment';
import {TournamentListOverviewComponent} from './tournament/tournament-list-overview/tournament-list-overview.component';

import {MySiteComponent} from './my-site/my-site.component';
import {PageNotFoundComponent} from './not-found.component';
import {AppRoutingModule} from './app-routing.module';

import 'hammerjs';
import {CustomFormsModule} from 'ng2-validation';
import {AuthGuard} from './service/auth-guard.service';
import {
   CreateTeamDialogComponent,
   RegisterTeamDialogComponent, StartTournamentDialogComponent,
  TournamentPreparationComponent,

} from './tournament/tournament-preparation/tournament-preparation.component';
import {TournamentEffectService} from './store/effects/tournament-effect.service';
import {TournamentService} from './service/tournament.service';
import {PlayerListOverviewComponent} from './player/player-list-overview/player-list-overview.component';
import {PlayersEffectService} from './store/effects/players-effect.service';
import {PlayersService} from './service/players.service';
import {PlayerListComponent} from './player/player-list/player-list.component';
import {PlayerFormComponent} from './player/player-form/player-form.component';
import { RegisterPageComponent } from './auth/register-page/register-page.component';
import { PasswordForgetComponent } from './auth/password-forget/password-forget.component';
import { TournamentRegistrationListComponent } from './tournament/tournament-registration-list/tournament-registration-list.component';
import {
  TournamentPlayerListComponent
} from './tournament/tournament-player-list/tournament-player-list.component';
import {TournamentRankingService} from './service/tournament-ranking.service';

import {AuthenticationReducer} from './store/reducers/authenticationReducer';
import {TournamentsReducer} from './store/reducers/tournamentsReducer';
import {PlayersReducer} from './store/reducers/playersReducer';
import {TournamentReducer} from './store/reducers/tournamentReducer';
import {TournamentRegistrationReducer} from './store/reducers/tournamentRegistrationReducer';
import {TournamentRankingReducer} from './store/reducers/tournamentRankingReducer';
import {TournamentPlayerReducer} from './store/reducers/tournamentPlayerReducer';
import {TournamentArmyListReducer} from './store/reducers/tournamentArmyListReducer';
import {TournamentGameService} from './service/tournament-game.service';
import {TournamentGameReducer} from './store/reducers/tournamentGameReducer';
import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule,
  MdSelectModule, MdSidenavModule, MdSnackBarModule, MdTabsModule, MdToolbarModule, MdListModule, MdTooltip,
  MdTooltipModule, MdSort, MdSortModule, MdTableModule, MdPaginatorModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TournamentOverviewComponent} from 'app/tournament/tournament-overview/tournament-overview.component';

import {
  TournamentRoundOverviewComponent,
} from './tournament/tournament-round-overview/tournament-round-overview.component';
import { TournamentGameListComponent, GameResultDialogComponent } from './tournament/tournament-game-list/tournament-game-list.component';
import { TournamentRankingListComponent
} from './tournament/tournament-ranking-list/tournament-ranking-list.component';
import {MdlModule} from 'angular2-mdl';
import {RankingEffectService} from './store/effects/ranking-effect.service';
import {TournamentGameEffectService} from './store/effects/tournament-game-effect.service';
import {TruncatePipe} from '../pipes/truncate-pise';
import {TournamentFormDialogComponent} from './dialogs/tournament-form-dialog';
import { TournamentFinalRankingsComponent } from './tournament/tournament-final-rankings/tournament-final-rankings.component';
import {DateTimePickerModule} from 'ng-pick-datetime';
import { AboutComponent } from './about/about.component';
import {MySiteService} from './service/my-site.service';
import {MySiteEffectService} from './store/effects/my-registrations-effect.service';
import {MySiteReducer} from './store/reducers/mySiteReducer';
import { PlayerRegistrationsTableComponent } from './my-site/player-registrations-table/player-registrations-table.component';
import { PlayerGamesTableComponent } from './my-site/player-games-table/player-games-table.component';
import {GlobalEventService} from './service/global-event-service';
import { TournamentGameTableComponent } from './tournament/tournament-game-table/tournament-game-table.component';
import {WindowRefService} from './service/window-ref-service';
import {TournamentTeamReducer} from './store/reducers/tournamentTeamReducer';
import {TournamentTeamService} from './service/tournament-team.service';
import {TournamentTeamEffectService} from './store/effects/tournament-teams-effect.service';
import { TournamentTeamListComponent } from './tournament/tournament-team-list/tournament-team-list.component';
import { TournamentTeamRegistrationListComponent } from './tournament/tournament-team-registration-list/tournament-team-registration-list.component';
import {MdlExpansionPanelModule} from '@angular-mdl/expansion-panel';
import {ShowTeamRegistrationDialogComponent} from './dialogs/show-team-registration-dialog';
import {ShowTeamDialogComponent} from './dialogs/show-team-dialog';
import {NewTournamentPlayerDialogComponent} from './dialogs/add-tournament-player-dialog';
import { GamesListComponent } from './games/games-list/games-list.component';
import {PrintArmyListsDialogComponent} from './dialogs/print-army-lists-dialog';
import { TournamentTeamRoundOverviewComponent } from './team-tournament/tournament-team-round-overview/tournament-team-round-overview.component';
import {TournamentTeamGameReducer} from './store/reducers/tournamentTeamGameReducer';
import {KillRoundDialogComponent} from './dialogs/round-overview/kill-round-dialog';
import {PairAgainDialogComponent} from './dialogs/round-overview/pair-again-dialog';
import {TournamentTeamRankingReducer} from './store/reducers/tournamentTeamRankingReducer';
import {AddArmyListsDialogComponent} from './dialogs/add-army-lists-dialog';
import {PrintRankingsDialogComponent} from './dialogs/print-rankings-dialog';
import {PrintGamesDialogComponent} from './dialogs/print-games-dialog';
import { TournamentTeamRankingListComponent } from './team-tournament/tournament-team-ranking-list/tournament-team-ranking-list.component';
import {ShowTeamRankingDialogComponent} from './dialogs/show-team-ranking-dialog';
import {MdlSelectModule} from '@angular-mdl/select';
import {AngularFireOfflineModule} from 'angularfire2-offline';
import {ShowArmyListDialogComponent} from './dialogs/show-army-lists-dialog';
import {
  TeamMatchDialogComponent,
  TournamentTeamGameListComponent
} from './team-tournament/tournament-team-game-list/tournament-team-game-list.component';
import {NewRoundDialogComponent} from './dialogs/round-overview/new-round-dialog';
import {FinishTournamentDialogComponent} from './dialogs/finish-tournament-dialog';
import { TournamentTeamFinalRankingsComponent } from './team-tournament/tournament-team-final-rankings/tournament-team-final-rankings.component';
import {AngularFireModule} from 'angularfire2';
import {NgxPaginationModule} from 'ngx-pagination';
import { GameListOverviewComponent } from './games/game-list-overview/game-list-overview.component';
import {GamesReducer} from './store/reducers/gamesReducer';
import {GamesEffectService} from './store/effects/games-effect.service';
import {GamesService} from './service/games.service';
import {TournamentInfoDialogComponent} from './dialogs/tournament-overview/tournament-info-dialog';
import {AddPlayerRegistrationDialogComponent} from './dialogs/tournament-preparation/add-player-registration-dialog';
import {
  PlayerRegistrationInfoDialogComponent
} from './dialogs/tournament-preparation/player-registration-info-dialog';
import {ShowSingleArmyListDialogComponent} from './dialogs/mini-dialog/show-single-army-list-dialog';
import {ShowSoloRankingsComponent} from "app/dialogs/mini-dialog/show-solo-rankings-dialog";
import {CdkTableModule} from "@angular/cdk";
import {Ng2PageScrollModule} from "ng2-page-scroll";


const reducers = {
  routerState: routerReducer,
  tournaments: TournamentsReducer,
  players: PlayersReducer,
  games: GamesReducer,
  authenticationStoreState: AuthenticationReducer,
  mySiteSoreData: MySiteReducer,

  actualTournament: TournamentReducer,
  actualTournamentRegistrations: TournamentRegistrationReducer,
  actualTournamentRankings: TournamentRankingReducer,
  actualTournamentTeamRankings: TournamentTeamRankingReducer,
  actualTournamentGames: TournamentGameReducer,
  actualTournamentTeamGames: TournamentTeamGameReducer,
  actualTournamentPlayers: TournamentPlayerReducer,
  actualTournamentArmyLists: TournamentArmyListReducer,
  actualTournamentTeams: TournamentTeamReducer,

};

// const developmentReducer: ActionReducer<ApplicationState> = compose(storeFreeze, combineReducers)(reducers);
const developmentReducer: ActionReducer<ApplicationState> = combineReducers(reducers);
const productionReducer: ActionReducer<ApplicationState> = combineReducers(reducers);

export function storeReducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}


export const firebaseConfProd = {
  apiKey: 'AIzaSyBHTHAaFv7_d11CYY6V9We_gD1tK1WiBQs',
  authDomain: 'madson-org-opentournament.firebaseapp.com',
  databaseURL: 'https://madson-org-opentournament.firebaseio.com',
  projectId: 'madson-org-opentournament',
  storageBucket: 'madson-org-opentournament.appspot.com',
  messagingSenderId: '736115725028'
};

export const firebaseConfDev = {
  apiKey: 'AIzaSyAMFwFtLKudN3GfqikkimvZOvWzXbTaJ-o',
  authDomain: 'devopentournament.firebaseapp.com',
  databaseURL: 'https://devopentournament.firebaseio.com',
  projectId: 'devopentournament',
  storageBucket: 'devopentournament.appspot.com',
  messagingSenderId: '965241334913'
};


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    EffectsModule.run(AuthEffectService),
    EffectsModule.run(TournamentEffectService),
    EffectsModule.run(TournamentsEffectService),
    EffectsModule.run(PlayersEffectService),
    EffectsModule.run(GamesEffectService),
    EffectsModule.run(RankingEffectService),
    EffectsModule.run(TournamentGameEffectService),
    EffectsModule.run(MySiteEffectService),
    EffectsModule.run(TournamentTeamEffectService),
    StoreModule.provideStore(storeReducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    MomentModule,
    AppRoutingModule,
    CustomFormsModule,
    CdkTableModule,
    BrowserAnimationsModule,
    MdlModule,
    MdButtonModule, MdCheckboxModule, MdCardModule, MdIconModule, MdSelectModule,
    MdSidenavModule, MdToolbarModule, MdSnackBarModule, MdInputModule, MdTabsModule,
    MdListModule, MdDialogModule, MdTooltipModule, MdSortModule, MdTableModule,
    MdPaginatorModule,
    DateTimePickerModule,
    MdlExpansionPanelModule,
    MdlSelectModule,
    AngularFireOfflineModule,
    NgxPaginationModule,
    Ng2PageScrollModule
  ],
  declarations: [
    AppComponent,
    TournamentListComponent,
    GameEditComponent,
    LoginPageComponent,
    HomePageComponent,
    TournamentListOverviewComponent,
    MySiteComponent,
    PageNotFoundComponent,
    TournamentPreparationComponent,
    PlayerListOverviewComponent,
    PlayerListComponent,
    PlayerFormComponent,
    RegisterPageComponent,
    PasswordForgetComponent,
    TournamentRegistrationListComponent,
    TournamentPlayerListComponent,
    AddArmyListsDialogComponent,
    NewTournamentPlayerDialogComponent,
    StartTournamentDialogComponent,
    TournamentOverviewComponent,
    TournamentRoundOverviewComponent,
    TournamentGameListComponent,
    TournamentRankingListComponent,
    TruncatePipe,
    PairAgainDialogComponent,
    GameResultDialogComponent,
    KillRoundDialogComponent,
    NewRoundDialogComponent,
    TournamentFormDialogComponent,
    FinishTournamentDialogComponent,
    TournamentFinalRankingsComponent,
    AboutComponent,
    PlayerRegistrationsTableComponent,
    PlayerGamesTableComponent,
    TournamentGameTableComponent,
    CreateTeamDialogComponent,
    RegisterTeamDialogComponent,
    TournamentTeamListComponent,
    TournamentTeamRegistrationListComponent,
    ShowTeamRegistrationDialogComponent,
    ShowTeamDialogComponent,
    GamesListComponent,
    PrintArmyListsDialogComponent,
    TournamentTeamRoundOverviewComponent,
    PrintRankingsDialogComponent,
    PrintGamesDialogComponent,
    TournamentTeamRankingListComponent,
    ShowTeamRankingDialogComponent,
    ShowArmyListDialogComponent,
    TournamentTeamGameListComponent,
    TeamMatchDialogComponent,
    TournamentTeamFinalRankingsComponent,
    GameListOverviewComponent,
    TournamentInfoDialogComponent,
    AddPlayerRegistrationDialogComponent,
    PlayerRegistrationInfoDialogComponent,
    ShowSingleArmyListDialogComponent,
    ShowSoloRankingsComponent
  ],
  providers: [
    LoginService,
    TournamentsService,
    AuthGuard,
    TournamentService,
    PlayersService,
    GamesService,
    TournamentRankingService,
    TournamentGameService,
    TournamentTeamService,
    MySiteService,
    GlobalEventService,
    WindowRefService,
  ],
  entryComponents: [
    AddArmyListsDialogComponent,
    NewTournamentPlayerDialogComponent,
    StartTournamentDialogComponent,
    PairAgainDialogComponent,
    GameResultDialogComponent,
    KillRoundDialogComponent,
    NewRoundDialogComponent,
    TournamentFormDialogComponent,
    FinishTournamentDialogComponent,
    CreateTeamDialogComponent,
    RegisterTeamDialogComponent,
    ShowTeamRegistrationDialogComponent,
    ShowTeamDialogComponent,
    PrintArmyListsDialogComponent,
    PrintRankingsDialogComponent,
    PrintGamesDialogComponent,
    ShowTeamRankingDialogComponent,
    ShowArmyListDialogComponent,
    TeamMatchDialogComponent,
    TournamentInfoDialogComponent,
    AddPlayerRegistrationDialogComponent,
    PlayerRegistrationInfoDialogComponent,
    ShowSingleArmyListDialogComponent,
    ShowSoloRankingsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
