import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  TOURNAMENT_TEAM_ERASE_ACTION,
  TOURNAMENT_TEAM_PUSH_ACTION, TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION, TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION,
  TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION,
  TOURNAMENT_TEAMS_SUBSCRIBE_ACTION
} from '../actions/tournament-teams-actions';
import {TournamentTeamService} from '../../service/tournament-team.service';


@Injectable()
export class TournamentTeamEffectService {

  @Effect({dispatch: false}) subscribeReg = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION')
    .map(action => this.tournamentTeamService.subscribeOnTournamentTeamRegistrations(action.payload));

  @Effect({dispatch: false}) pushReg = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION')
    .map(action => this.tournamentTeamService.pushTournamentTeamRegistration(action.payload));

  @Effect({dispatch: false}) acceptTeamReg = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION')
    .map(action => this.tournamentTeamService.acceptTournamentTeamRegistration(action.payload));

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENT_TEAMS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAMS_SUBSCRIBE_ACTION')
    .map(action => this.tournamentTeamService.subscribeOnTournamentTeams(action.payload));

  @Effect({dispatch: false}) push = this.actions$
    .ofType(TOURNAMENT_TEAM_PUSH_ACTION)
    .debug('TOURNAMENT_TEAM_PUSH_ACTION')
    .map(action => this.tournamentTeamService.pushTournamentTeam(action.payload));

  @Effect({dispatch: false}) erase = this.actions$
    .ofType(TOURNAMENT_TEAM_ERASE_ACTION)
    .debug('TOURNAMENT_TEAM_ERASE_ACTION')
    .map(action => this.tournamentTeamService.eraseTournamentTeam(action.payload));


  constructor(
    private actions$: Actions,
    private tournamentTeamService: TournamentTeamService
  ) { }
}
