import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TournamentListComponent} from './tournaments/tournament-list/tournament-list.component';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {GameEditComponent} from './game-edit/game-edit.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {StoreModule} from '@ngrx/store';
import 'rxjs/Rx';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import {environment} from '../environments/environment';

import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';

import {AuthEffectService} from './store/effects/auth-effect.service';

import {AuthService} from './service/auth.service';
import {TournamentsService} from './tournaments/tournaments.service';

import {MomentModule} from 'angular2-moment';
import {TournamentListOverviewComponent} from './tournaments/tournament-list-overview/tournament-list-overview.component';


import {PageNotFoundComponent} from './not-found.component';
import {AppRoutingModule} from './app-routing.module';

import 'hammerjs';
import {CustomFormsModule} from 'ng2-validation';
import {AuthGuard} from './service/auth-guard.service';

import {TournamentService} from './tournament/actual-tournament.service';
import {PlayerListOverviewComponent} from './player/player-list-overview/player-list-overview.component';
import {PlayersService} from './player/players.service';
import {PlayerListComponent} from './player/player-list/player-list.component';
import {PlayerFormComponent} from './player/player-form/player-form.component';
import {RegisterPageComponent} from './auth/register-page/register-page.component';
import {PasswordForgetComponent} from './auth/password-forget/password-forget.component';
import {TournamentRegistrationListComponent} from './tournament/registration/tournament-registration-list/tournament-registration-list.component';
import {TournamentPlayerListComponent} from './tournament/tournament-player/tournament-player-list/tournament-player-list.component';

import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDatepickerModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressSpinnerModule,
  MdSelectModule,
  MdSidenavModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTableModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {TournamentRoundOverviewComponent, } from './tournament/round/tournament-round-overview/tournament-round-overview.component';

import {TruncatePipe} from '../pipes/truncate-pise';
import {TournamentFormDialogComponent} from './dialogs/tournament-form-dialog';
import {AboutComponent} from './about/about.component';

import {GlobalEventService} from './service/global-event-service';
import {WindowRefService} from './service/window-ref-service';


import {ShowTeamRegistrationDialogComponent} from './dialogs/show-team-registration-dialog';
import {ShowTeamDialogComponent} from './dialogs/show-team-dialog';
import {NewTournamentPlayerDialogComponent} from './dialogs/add-tournament-player-dialog';
import {PrintArmyListsDialogComponent} from './dialogs/print-army-lists-dialog';

import {KillRoundDialogComponent} from './dialogs/round-overview/kill-round-dialog';
import {PairAgainDialogComponent} from './dialogs/round-overview/pair-again-dialog';

import {AddArmyListsDialogComponent} from './dialogs/add-army-lists-dialog';
import {PrintRankingsDialogComponent} from './dialogs/print-rankings-dialog';
import {PrintGamesDialogComponent} from './dialogs/print-games-dialog';

import {AngularFireOfflineModule} from 'angularfire2-offline';
import {ShowArmyListDialogComponent} from './dialogs/show-army-lists-dialog';

import {NewRoundDialogComponent} from './dialogs/round-overview/new-round-dialog';
import {FinishTournamentDialogComponent} from './dialogs/finish-tournament-dialog';
import {AngularFireModule} from 'angularfire2';

import {GameListOverviewComponent} from './games/game-list-overview/game-list-overview.component';

import {TournamentInfoDialogComponent} from './dialogs/tournament-overview/tournament-info-dialog';
import {AddPlayerRegistrationDialogComponent} from './dialogs/tournament-preparation/add-player-registration-dialog';
import {PlayerRegistrationInfoDialogComponent} from './dialogs/tournament-preparation/player-registration-info-dialog';
import {ShowSingleArmyListDialogComponent} from './dialogs/mini-dialog/show-single-army-list-dialog';
import {ShowSoloRankingsComponent} from 'app/dialogs/mini-dialog/show-solo-rankings-dialog';
import {CdkTableModule} from '@angular/cdk/table';
import {Ng2PageScrollModule} from 'ng2-page-scroll';
import {AddCoOrganizatorDialogComponent} from './dialogs/add-co-organizator-dialog';


import {GamesService} from './games/games.service';
import {reducers} from './store/reducers/index';
import {ActualTournamentRegistrationService} from './tournament/actual-tournament-registration.service';
import {TournamentRegistrationOverviewComponent} from './tournament/registration/tournament-registration-overview/tournament-registration-overview.component';
import {ActualTournamentPlayerService} from './tournament/actual-tournament-player.service';
import {ActualTournamentArmyListService} from './tournament/actual-tournament-army-list.service';
import {TournamentPlayerOverviewComponent} from './tournament/tournament-player/tournament-player-overview/tournament-player-overview.component';
import {StartTournamentDialogComponent} from './dialogs/actualTournament/start-tournament-dialog';
import {ActualTournamentRankingService} from './tournament/actual-tournament-ranking.service';
import {ActualTournamentGamesService} from './tournament/actual-tournament-games.service';
import {PairingService} from './tournament/pairing.service';
import {GameMatchingService} from 'app/tournament/game-matching.service';
import {GameResultService} from './tournament/game-result.service';
import {TournamentGamesComponent} from './tournament/round/tournament-game-list/tournament-games.component';
import {GameResultDialogComponent} from './dialogs/game-result-dialog';
import {SwappingService} from './tournament/swapping.service';
import {TournamentRankingsComponent} from './tournament/rankings/tournament-ranking-list/tournament-rankings.component';
import {TournamentRankingsOverviewComponent} from 'app/tournament/rankings/tournament-ranking-overview/tournament-ranking-overview.component';
import {GamesListComponent} from './games/games-list/games-list.component';
import {TournamentFinalRankingsOverviewComponent} from 'app/tournament/final-rankings/tournament-final-ranking-overview/tournament-final-ranking-overview.component';
import {EloService} from './tournament/elo.service';
import {MySiteProfileComponent} from './my-site/profile/my-site-profile.component';
import {MySiteTournamentsComponent} from 'app/my-site/tournaments/my-site-tournaments.component';
import {MyTournamentsService} from 'app/my-site/tournaments/my-tournaments.service';
import {MyGamesService} from './my-site/games/my-games.service';
import {MyRegistrationsService} from './my-site/registrations/my-registrations.service';
import {MySiteRegistrationsComponent} from './my-site/registrations/my-site-registrations.component';
import {MyRegistrationListComponent} from './my-site/registrations/my-registrations-table/my-registration-list.component';
import {MySiteGamesComponent} from './my-site/games/my-site-games.component';
import {ActualTournamentTeamRegistrationService} from 'app/tournament/actual-tournament-team-registration.service';
import {ActualTournamentTeamsService} from 'app/tournament/actual-tournament-teams.service';
import {CreateTeamRegistrationDialogComponent} from './dialogs/team/create-team-registration-dialog';
import {TournamentTeamRegistrationListComponent} from './tournament/registration/tournament-registration-team-list/tournament-team-registration-list.component';
import {TournamentTeamOverviewComponent} from './tournament/tournament-team/tournament-team-overview/tournament-team-overview.component';
import {TournamentTeamListComponent} from 'app/tournament/tournament-team/tournament-team-list/tournament-team-list.component';
import {TeamPairingService} from 'app/tournament/team-pairing.service';
import {TournamentTeamGamesComponent} from 'app/tournament/round/tournament-team-game-list/tournament-team-games.component';
import {ActualTournamentTeamGamesService} from 'app/tournament/actual-tournament-team-games.service';
import {ActualTournamentTeamRankingService} from './tournament/actual-tournament-team-ranking.service';
import {TeamMatchDialogComponent} from 'app/dialogs/team-game-result-dialog';
import {ByeService} from './tournament/bye-service';
import {TournamentTeamRankingsComponent} from 'app/tournament/rankings/tournament-team-ranking-list/tournament-team-rankings.component';
import {UploadTournamentDialogComponent} from './dialogs/upload-tournament-dialog';
import {CreateTeamDialogComponent} from './dialogs/create-team-dialog';
import {ShowPlayerListDialogComponent} from './dialogs/mini-dialog/show-player-list-dialog';


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
      AuthEffectService]),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    MomentModule,
    AppRoutingModule,
    CustomFormsModule,
    CdkTableModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCheckboxModule, MdCardModule, MdIconModule, MdSelectModule,
    MdSidenavModule, MdToolbarModule, MdSnackBarModule, MdInputModule, MdTabsModule,
    MdListModule, MdDialogModule, MdTooltipModule, MdSortModule, MdTableModule,
    MdMenuModule, MdProgressSpinnerModule, MdSlideToggleModule, MdDatepickerModule,
    MdPaginatorModule, MdNativeDateModule,
    AngularFireOfflineModule,
    Ng2PageScrollModule
  ],
  declarations: [
    AppComponent,
    TournamentListComponent,
    GameEditComponent,
    LoginPageComponent,
    HomePageComponent,
    AboutComponent,
    PageNotFoundComponent,

    TournamentListOverviewComponent,
    TournamentRegistrationOverviewComponent,
    TournamentPlayerOverviewComponent,
    TournamentTeamOverviewComponent,
    GamesListComponent,
    MySiteProfileComponent,
    MySiteTournamentsComponent,
    MySiteRegistrationsComponent,
    MySiteGamesComponent,
    MyRegistrationListComponent,


    PlayerListOverviewComponent,
    PlayerListComponent,
    PlayerFormComponent,
    RegisterPageComponent,
    PasswordForgetComponent,
    TournamentRegistrationListComponent,
    TournamentPlayerListComponent,


    TournamentRoundOverviewComponent,

    TournamentRankingsOverviewComponent,
    TournamentRankingsComponent,
    TruncatePipe,
    TournamentTeamGamesComponent,

    TournamentFinalRankingsOverviewComponent,

    TournamentGamesComponent,

    GameListOverviewComponent,
    ShowSoloRankingsComponent,

    TournamentTeamListComponent,
    TournamentTeamRegistrationListComponent,

    PairAgainDialogComponent,
    GameResultDialogComponent,
    KillRoundDialogComponent,
    NewRoundDialogComponent,
    TournamentFormDialogComponent,
    FinishTournamentDialogComponent,
    PrintArmyListsDialogComponent,
    PrintGamesDialogComponent,
    ShowTeamDialogComponent,
    ShowTeamRegistrationDialogComponent,
    PrintRankingsDialogComponent,
    ShowArmyListDialogComponent,
    TournamentInfoDialogComponent,
    AddPlayerRegistrationDialogComponent,
    TeamMatchDialogComponent,
    PlayerRegistrationInfoDialogComponent,
    ShowSingleArmyListDialogComponent,
    AddCoOrganizatorDialogComponent,
    CreateTeamDialogComponent,
    CreateTeamRegistrationDialogComponent,
    TournamentTeamRankingsComponent,
    UploadTournamentDialogComponent,
    AddArmyListsDialogComponent,
    NewTournamentPlayerDialogComponent,
    StartTournamentDialogComponent,
    ShowPlayerListDialogComponent
  ],
  providers: [
    AuthService,
    TournamentsService,
    AuthGuard,
    TournamentService,
    ActualTournamentRegistrationService,
    ActualTournamentPlayerService,
    ActualTournamentArmyListService,
    ActualTournamentRankingService,
    ActualTournamentGamesService,
    PlayersService,
    GamesService,
    MyGamesService,
    MyTournamentsService,
    MyRegistrationsService,
    GlobalEventService,
    WindowRefService,
    PairingService,
    GameMatchingService,
    GameResultService,
    SwappingService,
    EloService,
    ActualTournamentTeamRegistrationService,
    ActualTournamentTeamsService,
    TeamPairingService,
    ActualTournamentTeamGamesService,
    ActualTournamentTeamRankingService,
    ByeService
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
    ShowTeamRegistrationDialogComponent,
    ShowTeamDialogComponent,
    PrintArmyListsDialogComponent,
    PrintRankingsDialogComponent,
    PrintGamesDialogComponent,
    ShowArmyListDialogComponent,
    TeamMatchDialogComponent,
    TournamentInfoDialogComponent,
    AddPlayerRegistrationDialogComponent,
    PlayerRegistrationInfoDialogComponent,
    ShowSingleArmyListDialogComponent,
    ShowSoloRankingsComponent,
    AddCoOrganizatorDialogComponent,
    CreateTeamRegistrationDialogComponent,
    UploadTournamentDialogComponent,
    ShowPlayerListDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
