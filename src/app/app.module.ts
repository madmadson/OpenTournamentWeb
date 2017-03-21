import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {MaterialModule} from "@angular/material";
import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {TournamentListComponent} from "./tournament-list/tournament-list.component";
import {AngularFireModule, AuthProviders, AuthMethods} from "angularfire2";
import {GameEditComponent} from "./game-edit/game-edit.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {StoreModule, combineReducers, ActionReducer} from "@ngrx/store";
import "rxjs/Rx";
import {INITIAL_APPLICATION_STATE, ApplicationState} from "./store/application-state";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {compose} from "@ngrx/core/compose";
import {environment} from "../environments/environment";
import {uiState} from "./store/reducers/uiStateReducer";
import {storeData} from "./store/reducers/uiStoreDataReducer";
import {storeFreeze} from "ngrx-store-freeze";
import {EffectsModule} from "@ngrx/effects";
import {LoginEffectService} from "./store/effects/social-login-effect.service";
import {LoginService} from "./service/login.service";


const reducers = {
  uiState: uiState,
  storeData: storeData
};

const developmentReducer: ActionReducer<ApplicationState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<ApplicationState> = combineReducers(reducers);

export function storeReducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  }
  else {
    return developmentReducer(state, action);
  }
}

let fbConfig = {
  apiKey: "AIzaSyAMFwFtLKudN3GfqikkimvZOvWzXbTaJ-o",
  authDomain: "devopentournament.firebaseapp.com",
  databaseURL: "https://devopentournament.firebaseio.com",
  storageBucket: "devopentournament.appspot.com",
  messagingSenderId: "965241334913"
};

const fbAuthConfig = {
  provider: AuthProviders.Anonymous,
  method: AuthMethods.Anonymous,
};

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'login-page', component: LoginPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TournamentListComponent,
    GameEditComponent,
    LoginPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    MaterialModule,
    AngularFireModule.initializeApp(fbConfig, fbAuthConfig),
    ReactiveFormsModule,
    EffectsModule.run(LoginEffectService),
    StoreModule.provideStore(storeReducer, INITIAL_APPLICATION_STATE),
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
