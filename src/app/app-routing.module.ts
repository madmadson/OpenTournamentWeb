import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {GameEditComponent} from "./game-edit/game-edit.component";
import {TournamentOverviewComponent} from "./tournament/tournament-overview/tournament-overview.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {PageNotFoundComponent} from "./not-found.component";
import {MyTournamentsComponent} from "./tournament/my-tournaments/my-tournaments.component";
import {TournamentEditComponent} from "./tournament/tournament-edit/tournament-edit.component";
import {TournamentNewComponent} from "./tournament/tournament-new/tournament-new.component";


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'login-page', component: LoginPageComponent},
  {path: 'tournaments', component: TournamentOverviewComponent},
  {path: 'my-tournaments', component: MyTournamentsComponent},
  {path: 'tournament/:id', component: TournamentEditComponent},
  {path: 'tournament-new', component: TournamentNewComponent},
  {path: 'game', component: GameEditComponent},
  {path: '', redirectTo: '/login-page', pathMatch: 'full'},
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
