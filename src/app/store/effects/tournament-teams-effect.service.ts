import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  ADD_DUMMY_TEAM_ACTION, ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION, TEAM_REGISTRATION_CHANGE_ACTION,
  TOURNAMENT_TEAM_ERASE_ACTION,
  TOURNAMENT_TEAM_PUSH_ACTION, TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION, TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION,
  TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION,
  TOURNAMENT_TEAMS_SUBSCRIBE_ACTION
} from '../actions/tournament-teams-actions';
import {TournamentTeamService} from '../../service/tournament-team.service';
import {TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION} from '../actions/tournament-team-games-actions';
import {TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION} from '../actions/tournament-team-rankings-actions';



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

  @Effect({dispatch: false}) eraseTeamReg = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION')
    .map(action => this.tournamentTeamService.eraseTournamentTeamRegistration(action.payload));

  @Effect({dispatch: false}) addDummyTeam = this.actions$
    .ofType(ADD_DUMMY_TEAM_ACTION)
    .debug('ADD_DUMMY_TEAM_ACTION')
    .map(action => this.tournamentTeamService.addDummyTeam(action.payload));

  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(TOURNAMENT_TEAMS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAMS_SUBSCRIBE_ACTION')
    .map(action => this.tournamentTeamService.subscribeOnTournamentTeams(action.payload));

  @Effect({dispatch: false}) subscribeTeamGames = this.actions$
    .ofType(TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION')
    .map(action => this.tournamentTeamService.subscribeOnTournamentTeamGames(action.payload));

  @Effect({dispatch: false}) subscribeTeamRankings = this.actions$
    .ofType(TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION')
    .map(action => this.tournamentTeamService.subscribeOnTournamentTeamRankings(action.payload));

  @Effect({dispatch: false}) push = this.actions$
    .ofType(TOURNAMENT_TEAM_PUSH_ACTION)
    .debug('TOURNAMENT_TEAM_PUSH_ACTION')
    .map(action => this.tournamentTeamService.pushTournamentTeam(action.payload));

  @Effect({dispatch: false}) erase = this.actions$
    .ofType(TOURNAMENT_TEAM_ERASE_ACTION)
    .debug('TOURNAMENT_TEAM_ERASE_ACTION')
    .map(action => this.tournamentTeamService.eraseTournamentTeam(action.payload));

  @Effect({dispatch: false}) changeRegistration = this.actions$
    .ofType(TEAM_REGISTRATION_CHANGE_ACTION)
    .debug('TEAM_REGISTRATION_CHANGE_ACTION')
    .map(action => this.tournamentTeamService.teamRegistrationChange(action.payload));

  @Effect({dispatch: false}) armyListForTeamRegistration = this.actions$
    .ofType(ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION)
    .debug('ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION')
    .map(action => this.tournamentTeamService.armyListForTeamRegistration(action.payload));


  constructor(
    private actions$: Actions,
    private tournamentTeamService: TournamentTeamService
  ) { }
}
