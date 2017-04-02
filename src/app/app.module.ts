import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {AppComponent} from "./app.component";
import {TournamentListComponent} from "./tournament/tournament-list/tournament-list.component";
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";
import {GameEditComponent} from "./game-edit/game-edit.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {ActionReducer, combineReducers, StoreModule} from "@ngrx/store";
import "rxjs/Rx";
import {ApplicationState, INITIAL_APPLICATION_STATE} from "./store/application-state";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {compose} from "@ngrx/core/compose";
import {environment} from "../environments/environment";
import {uiState} from "./store/reducers/uiStateReducer";
import {storeData} from "./store/reducers/uiStoreDataReducer";
import {storeFreeze} from "ngrx-store-freeze";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffectService} from "./store/effects/auth-effect.service";
import {TournamentEffectService} from "./store/effects/tournament-effect.service";
import {LoginService} from "./service/auth.service";
import {TournamentService} from "./service/tournament.service";
import {routerReducer, RouterStoreModule} from "@ngrx/router-store";
import {TournamentEditComponent} from "./tournament/tournament-edit/tournament-edit.component";
import {MomentModule} from "angular2-moment";
import {TournamentOverviewComponent} from "./tournament/tournament-overview/tournament-overview.component";

import {MyTournamentsComponent} from "./tournament/my-tournaments/my-tournaments.component";
import {PageNotFoundComponent} from "./not-found.component";
import {AppRoutingModule} from "./app-routing.module";

import "hammerjs";
import {TournamentNewComponent} from "./tournament/tournament-new/tournament-new.component";
import {DateTimePickerModule} from "ng2-date-time-picker";
import {CustomFormsModule} from "ng2-validation";
import {AuthGuard} from "./auth-guard.service";

const reducers = {
  uiState: uiState,
  storeData: storeData,
  router: routerReducer
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

const fbConfig = {
  apiKey: 'AIzaSyAMFwFtLKudN3GfqikkimvZOvWzXbTaJ-o',
  authDomain: 'devopentournament.firebaseapp.com',
  databaseURL: 'https://devopentournament.firebaseio.com',
  storageBucket: 'devopentournament.appspot.com',
  messagingSenderId: '965241334913'
};

const fbAuthConfig = {
  provider: AuthProviders.Anonymous,
  method: AuthMethods.Anonymous,
};


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    AngularFireModule.initializeApp(fbConfig, fbAuthConfig),
    ReactiveFormsModule,
    EffectsModule.run(AuthEffectService),
    EffectsModule.run(TournamentEffectService),
    StoreModule.provideStore(storeReducer, INITIAL_APPLICATION_STATE),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    MomentModule,
    AppRoutingModule,
    DateTimePickerModule,
    CustomFormsModule
  ],
  declarations: [
    AppComponent,
    TournamentListComponent,
    GameEditComponent,
    LoginPageComponent,
    HomePageComponent,
    TournamentEditComponent,
    TournamentOverviewComponent,
    MyTournamentsComponent,
    PageNotFoundComponent,
    TournamentNewComponent
  ],
  providers: [LoginService, TournamentService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
