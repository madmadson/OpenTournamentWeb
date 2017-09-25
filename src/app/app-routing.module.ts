import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GameEditComponent} from './game-edit/game-edit.component';
import {TournamentListOverviewComponent} from './tournaments/tournament-list-overview/tournament-list-overview.component';
import {LoginPageComponent} from './auth/login-page/login-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {PageNotFoundComponent} from './not-found.component';

import {AuthGuard} from './service/auth-guard.service';
import {PlayerListOverviewComponent} from './player/player-list-overview/player-list-overview.component';
import {PlayerFormComponent} from './player/player-form/player-form.component';
import {RegisterPageComponent} from './auth/register-page/register-page.component';
import {PasswordForgetComponent} from './auth/password-forget/password-forget.component';
import {AboutComponent} from './about/about.component';
import {GameListOverviewComponent} from './games/game-list-overview/game-list-overview.component';
import {TournamentRegistrationOverviewComponent} from './tournament/registration/tournament-registration-overview/tournament-registration-overview.component';
import {TournamentPlayerOverviewComponent} from './tournament/tournament-player/tournament-player-overview/tournament-player-overview.component';
import {TournamentRoundOverviewComponent} from './tournament/round/tournament-round-overview/tournament-round-overview.component';
import {TournamentRankingsOverviewComponent} from './tournament/rankings/tournament-ranking-overview/tournament-ranking-overview.component';
import {TournamentFinalRankingsOverviewComponent} from './tournament/final-rankings/tournament-final-ranking-overview/tournament-final-ranking-overview.component';
import {MySiteProfileComponent} from './my-site/profile/my-site-profile.component';
import {MySiteTournamentsComponent} from './my-site/tournaments/my-site-tournaments.component';
import {MySiteRegistrationsComponent} from './my-site/registrations/my-site-registrations.component';
import {MySiteGamesComponent} from './my-site/games/my-site-games.component';
import {TournamentTeamOverviewComponent} from './tournament/tournament-team/tournament-team-overview/tournament-team-overview.component';


const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'about', component: AboutComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'password-forget', component: PasswordForgetComponent},
  {path: 'tournaments', component: TournamentListOverviewComponent},
  {path: 'players', component: PlayerListOverviewComponent},
  {path: 'games', component: GameListOverviewComponent},
  {path: 'my-site/tournaments', component: MySiteTournamentsComponent, canLoad: [AuthGuard], canActivate: [AuthGuard]},
  {path: 'my-site/profile', component: MySiteProfileComponent, canLoad: [AuthGuard], canActivate: [AuthGuard]},
  {path: 'my-site/registrations', component: MySiteRegistrationsComponent, canLoad: [AuthGuard], canActivate: [AuthGuard]},
  {path: 'my-site/games', component: MySiteGamesComponent, canLoad: [AuthGuard], canActivate: [AuthGuard]},
  {path: 'tournament/:id/registrations', component: TournamentRegistrationOverviewComponent},
  {path: 'tournament/:id/players', component: TournamentPlayerOverviewComponent},
  {path: 'tournament/:id/teams', component: TournamentTeamOverviewComponent},
  {path: 'tournament/:id/finalRankings', component: TournamentFinalRankingsOverviewComponent},
  {path: 'tournament/:id/round/:round', component: TournamentRoundOverviewComponent},
  {path: 'tournament/:id/round/:round/rankings', component: TournamentRankingsOverviewComponent},
  {path: 'player-profile', component: PlayerFormComponent},
  {path: 'game', component: GameEditComponent},
  {path: 'tournaments', redirectTo: '/home', pathMatch: 'full'},
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
