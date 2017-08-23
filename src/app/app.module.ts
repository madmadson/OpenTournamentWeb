
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TournamentListComponent} from './tournaments/tournament-list/tournament-list.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {GameEditComponent} from './game-edit/game-edit.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import { StoreModule} from '@ngrx/store';
import 'rxjs/Rx';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {environment} from '../environments/environment';

import {EffectsModule} from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import {AuthEffectService} from './store/effects/auth-effect.service';
import {TournamentsEffectService} from './store/effects/tournaments-effect.service';
import {LoginService} from './service/auth.service';
import {TournamentsService} from './service/tournaments.service';

import {MomentModule} from 'angular2-moment';
import {TournamentListOverviewComponent} from './tournaments/tournament-list-overview/tournament-list-overview.component';

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


import {TournamentGameService} from './service/tournament-game.service';

import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule,
  MdSelectModule, MdSidenavModule, MdSnackBarModule, MdTabsModule, MdToolbarModule, MdListModule, MdTooltip,
  MdTooltipModule, MdSort, MdSortModule, MdTableModule, MdPaginatorModule, MdSlideToggleModule,
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

import { PlayerRegistrationsTableComponent } from './my-site/player-registrations-table/player-registrations-table.component';
import { PlayerGamesTableComponent } from './my-site/player-games-table/player-games-table.component';
import {GlobalEventService} from './service/global-event-service';
import { TournamentGameTableComponent } from './tournament/tournament-game-table/tournament-game-table.component';
import {WindowRefService} from './service/window-ref-service';

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

import {KillRoundDialogComponent} from './dialogs/round-overview/kill-round-dialog';
import {PairAgainDialogComponent} from './dialogs/round-overview/pair-again-dialog';

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

import {TournamentInfoDialogComponent} from './dialogs/tournament-overview/tournament-info-dialog';
import {AddPlayerRegistrationDialogComponent} from './dialogs/tournament-preparation/add-player-registration-dialog';
import {
  PlayerRegistrationInfoDialogComponent
} from './dialogs/tournament-preparation/player-registration-info-dialog';
import {ShowSingleArmyListDialogComponent} from './dialogs/mini-dialog/show-single-army-list-dialog';
import {ShowSoloRankingsComponent} from 'app/dialogs/mini-dialog/show-solo-rankings-dialog';
import {CdkTableModule} from '@angular/cdk';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {AddCoOrganizatorDialogComponent} from './dialogs/add-co-organizator-dialog';


import {GamesService} from './games/games.service';
import {reducers} from './store/reducers/index';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    EffectsModule.forRoot([
      AuthEffectService,
      TournamentEffectService,
      TournamentsEffectService,
      PlayersEffectService,
      RankingEffectService,
      TournamentGameEffectService,
      MySiteEffectService,
      TournamentTeamEffectService]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    MomentModule,
    AppRoutingModule,
    CustomFormsModule,
    CdkTableModule,
    BrowserAnimationsModule,
    MdlModule,
    MdButtonModule, MdCheckboxModule, MdCardModule, MdIconModule, MdSelectModule,
    MdSidenavModule, MdToolbarModule, MdSnackBarModule, MdInputModule, MdTabsModule,
    MdListModule, MdDialogModule, MdTooltipModule, MdSortModule, MdTableModule,
    MdSlideToggleModule,
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
    ShowSoloRankingsComponent,
    AddCoOrganizatorDialogComponent
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
    ShowSoloRankingsComponent,
    AddCoOrganizatorDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
