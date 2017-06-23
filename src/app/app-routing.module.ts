import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameEditComponent} from './game-edit/game-edit.component';
import {TournamentListOverviewComponent} from './tournament/tournament-list-overview/tournament-list-overview.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {PageNotFoundComponent} from './not-found.component';
import {MySiteComponent} from './my-site/my-site.component';
import {AuthGuard} from './service/auth-guard.service';
import {PlayerListOverviewComponent} from './player/player-list-overview/player-list-overview.component';
import {PlayerFormComponent} from './player/player-form/player-form.component';
import {RegisterPageComponent} from './auth/register-page/register-page.component';
import {PasswordForgetComponent} from './auth/password-forget/password-forget.component';
import {TournamentOverviewComponent} from './tournament/tournament-overview/tournament-overview.component';
import {AboutComponent} from './about/about.component';
import {GameListOverviewComponent} from './games/game-list-overview/game-list-overview.component';


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'about', component: AboutComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'password-forget', component: PasswordForgetComponent},
  {path: 'tournaments', component: TournamentListOverviewComponent},
  {path: 'players', component: PlayerListOverviewComponent},
  {path: 'games', component: GameListOverviewComponent},
  {path: 'my-site', component: MySiteComponent, canLoad: [AuthGuard], canActivate: [AuthGuard]},
  {path: 'tournament/:id', component: TournamentOverviewComponent},
  {path: 'player-profile', component: PlayerFormComponent},
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
