///<reference path="store/global-store-data.ts"/>
///<reference path="store/tournament-data.ts"/>
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
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
import {TournamentOverviewComponent} from './tournament/tournament-list-overview/tournament-list-overview.component';

import {MyTournamentsComponent} from './tournament/my-tournaments/my-tournaments.component';
import {PageNotFoundComponent} from './not-found.component';
import {AppRoutingModule} from './app-routing.module';

import 'hammerjs';
import {TournamentNewComponent} from './tournament/tournament-new/tournament-new.component';
import {DateTimePickerModule} from 'ng2-date-time-picker';
import {CustomFormsModule} from 'ng2-validation';
import {AuthGuard} from './service/auth-guard.service';
import {
  AddArmyListsDialogComponent, NewTournamentPlayerDialogComponent,
  RegisterDialogComponent, StartTournamentDialogComponent,
  TournamentPreparationComponent
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
import { TournamentPlayerListComponent } from './tournament/tournament-player-list/tournament-player-list.component';
import { PlayerSearchComponent } from './player/player-search/player-search.component';
import {RankingService} from './service/ranking.service';


import {AuthenticationReducer} from './store/reducers/authenticationReducer';
import {TournamentsReducer} from './store/reducers/tournamentsReducer';
import {PlayersReducer} from './store/reducers/playersReducer';
import {TournamentReducer} from "./store/reducers/tournamentReducer";


const reducers = {
  routerState: routerReducer,
  tournamentStoreData: TournamentsReducer,
  playerStoreData: PlayersReducer,
  authenticationStoreData: AuthenticationReducer,

  actualTournamentStoreData: TournamentReducer,

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


const firebaseConfProd = {
  apiKey: 'AIzaSyBHTHAaFv7_d11CYY6V9We_gD1tK1WiBQs',
  authDomain: 'madson-org-opentournament.firebaseapp.com',
  databaseURL: 'https://madson-org-opentournament.firebaseio.com',
  projectId: 'madson-org-opentournament',
  storageBucket: 'madson-org-opentournament.appspot.com',
  messagingSenderId: '736115725028'
};

const firebaseConfDev = {
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
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfDev),
    ReactiveFormsModule,
    EffectsModule.run(AuthEffectService),
    EffectsModule.run(TournamentEffectService),
    EffectsModule.run(TournamentsEffectService),
    EffectsModule.run(PlayersEffectService),
    StoreModule.provideStore(storeReducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    MomentModule,
    AppRoutingModule,
    DateTimePickerModule,
    CustomFormsModule,
    MaterialModule,
  ],
  declarations: [
    AppComponent,
    TournamentListComponent,
    GameEditComponent,
    LoginPageComponent,
    HomePageComponent,
    TournamentOverviewComponent,
    MyTournamentsComponent,
    PageNotFoundComponent,
    TournamentNewComponent,
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
    PlayerSearchComponent,
    NewTournamentPlayerDialogComponent,
    StartTournamentDialogComponent,
  ],
  providers: [
    LoginService,
    TournamentsService,
    AuthGuard,
    TournamentService,
    PlayersService,
    RankingService
  ],
  entryComponents: [
    RegisterDialogComponent,
    AddArmyListsDialogComponent,
    NewTournamentPlayerDialogComponent,
    StartTournamentDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
