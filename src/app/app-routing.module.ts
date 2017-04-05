import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GameEditComponent} from "./game-edit/game-edit.component";
import {TournamentOverviewComponent} from "./tournament/tournament-list-overview/tournament-list-overview.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {PageNotFoundComponent} from "./not-found.component";
import {MyTournamentsComponent} from "./tournament/my-tournaments/my-tournaments.component";
import {TournamentNewComponent} from "./tournament/tournament-new/tournament-new.component";
import {AuthGuard} from "./auth-guard.service";
import {TournamentPreparationComponent} from "./tournament/tournament-preparation/tournament-preparation.component";
import {RegistrationFormComponent} from "./tournament/registration-form/registration-form.component";
import {PlayerListOverviewComponent} from "./player/player-list-overview/player-list-overview.component";
import {PlayerFormComponent} from "./player/player-form/player-form.component";


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'tournaments', component: TournamentOverviewComponent},
  {path: 'players', component: PlayerListOverviewComponent},
  {path: 'my-tournaments', component: MyTournamentsComponent, canLoad: [AuthGuard], canActivate: [AuthGuard]},
  {path: 'tournament/:id', component: TournamentPreparationComponent},
  {path: 'tournament-new', component: TournamentNewComponent},
  {path: 'profile-new', component: PlayerFormComponent},
  {path: 'tournament/:id/register', component: RegistrationFormComponent},
  {path: 'game', component: GameEditComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
