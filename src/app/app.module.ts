
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {TournamentListComponent} from './tournament/tournament-list/tournament-list.component';
import {AngularFireModule} from 'angularfire2';
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
import {TournamentFormComponent} from './tournament/tournament-form/tournament-form.component';
import {CustomFormsModule} from 'ng2-validation';
import {AuthGuard} from './service/auth-guard.service';
import {
  AddArmyListsDialogComponent, NewTournamentPlayerDialogComponent,
  RegisterDialogComponent, StartTournamentDialogComponent,
  TournamentPreparationComponent,

} from './tournament/tournament-preparation/tournament-preparation.component';
import {TournamentRegistrationFormComponent} from './tournament/tournament-registration-form/tournament-registration-form.component';
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
  ShowArmyListInTournamentPlayerDialogComponent,
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
  MdTooltipModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TournamentOverviewComponent} from 'app/tournament/tournament-overview/tournament-overview.component';

import {
  PairAgainDialogComponent,
  TournamentRoundOverviewComponent,
  KillRoundDialogComponent, NewRoundDialogComponent, FinishTournamentDialogComponent,
} from './tournament/tournament-round-overview/tournament-round-overview.component';
import { TournamentGameListComponent, GameResultDialogComponent } from './tournament/tournament-game-list/tournament-game-list.component';
import { TournamentRankingListComponent,
          ShowArmyListInTournamentRankingDialogComponent
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

const reducers = {
  routerState: routerReducer,
  tournaments: TournamentsReducer,
  players: PlayersReducer,
  authenticationStoreState: AuthenticationReducer,
  mySiteSoreData: MySiteReducer,

  actualTournament: TournamentReducer,
  actualTournamentRegistrations: TournamentRegistrationReducer,
  actualTournamentRankings: TournamentRankingReducer,
  actualTournamentGames: TournamentGameReducer,
  actualTournamentPlayers: TournamentPlayerReducer,
  actualTournamentArmyLists: TournamentArmyListReducer,

};

const developmentReducer: ActionReducer<ApplicationState> = compose(storeFreeze, combineReducers)(reducers);
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
    AngularFireModule.initializeApp(firebaseConfDev),
    EffectsModule.run(AuthEffectService),
    EffectsModule.run(TournamentEffectService),
    EffectsModule.run(TournamentsEffectService),
    EffectsModule.run(PlayersEffectService),
    EffectsModule.run(RankingEffectService),
    EffectsModule.run(TournamentGameEffectService),
    EffectsModule.run(MySiteEffectService),
    StoreModule.provideStore(storeReducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    MomentModule,
    AppRoutingModule,
    CustomFormsModule,
    BrowserAnimationsModule,
    MdlModule,
    MdButtonModule, MdCheckboxModule, MdCardModule, MdIconModule, MdSelectModule,
    MdSidenavModule, MdToolbarModule, MdSnackBarModule, MdInputModule, MdTabsModule,
    MdListModule, MdDialogModule, MdTooltipModule,
    DateTimePickerModule,
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
    TournamentFormComponent,
    TournamentPreparationComponent,
    TournamentRegistrationFormComponent,
    PlayerListOverviewComponent,
    PlayerListComponent,
    PlayerFormComponent,
    RegisterPageComponent,
    PasswordForgetComponent,
    TournamentRegistrationListComponent,
    RegisterDialogComponent,
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
    ShowArmyListInTournamentRankingDialogComponent,
    ShowArmyListInTournamentPlayerDialogComponent,
    PlayerRegistrationsTableComponent,
  ],
  providers: [
    LoginService,
    TournamentsService,
    AuthGuard,
    TournamentService,
    PlayersService,
    TournamentRankingService,
    TournamentGameService,
    MySiteService
  ],
  entryComponents: [
    RegisterDialogComponent,
    AddArmyListsDialogComponent,
    NewTournamentPlayerDialogComponent,
    StartTournamentDialogComponent,
    PairAgainDialogComponent,
    GameResultDialogComponent,
    KillRoundDialogComponent,
    NewRoundDialogComponent,
    TournamentFormDialogComponent,
    FinishTournamentDialogComponent,
    ShowArmyListInTournamentRankingDialogComponent,
    ShowArmyListInTournamentPlayerDialogComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
