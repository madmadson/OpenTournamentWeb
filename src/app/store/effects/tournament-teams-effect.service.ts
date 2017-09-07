import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION,
  ArmyListForTeamRegistrationPushAction,
  SubscribeTournamentTeamRegistrationsAction,
  SubscribeTournamentTeamsAction,
  TEAM_REGISTRATION_CHANGE_ACTION,
  TeamRegistrationChangeAction,
  TOURNAMENT_TEAM_ERASE_ACTION,
  TOURNAMENT_TEAM_PUSH_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION,
  TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION,
  TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION,
  TOURNAMENT_TEAMS_SUBSCRIBE_ACTION,
  TournamentTeamEraseAction,
  TournamentTeamPushAction,
  TournamentTeamRegistrationAcceptAction,
  TournamentTeamRegistrationEraseAction,
  TournamentTeamRegistrationPushAction,
  UPDATE_TEAM_ACTION,
  UpdateTeamAction
} from '../actions/tournament-teams-actions';
import {TournamentTeamService} from '../../service/tournament-team.service';
import {
  SubscribeTournamentTeamGamesAction,
  TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION
} from '../actions/tournament-team-games-actions';
import {
  SubscribeTournamentTeamRankingsAction,
  TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION
} from '../actions/tournament-team-rankings-actions';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class TournamentTeamEffectService {

  @Effect({dispatch: false}) subscribeTeamReg: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION')
    .map((action: SubscribeTournamentTeamRegistrationsAction) => this.tournamentTeamService.subscribeOnTournamentTeamRegistrations(action.payload));

  @Effect({dispatch: false}) pushReg: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION')
    .map((action: TournamentTeamRegistrationPushAction) => this.tournamentTeamService.pushTournamentTeamRegistration(action.payload));

  @Effect({dispatch: false}) acceptTeamReg: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION')
    .map((action: TournamentTeamRegistrationAcceptAction) => this.tournamentTeamService.acceptTournamentTeamRegistration(action.payload));

  @Effect({dispatch: false}) eraseTeamReg: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION)
    .debug('TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION')
    .map((action: TournamentTeamRegistrationEraseAction) => this.tournamentTeamService.eraseTournamentTeamRegistration(action.payload));


  @Effect({dispatch: false}) subscribeTournamentTeams: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAMS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAMS_SUBSCRIBE_ACTION')
    .map((action: SubscribeTournamentTeamsAction) => this.tournamentTeamService.subscribeOnTournamentTeams(action.payload));

  @Effect({dispatch: false}) subscribeTeamGames: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAM_GAMES_SUBSCRIBE_ACTION')
    .map((action: SubscribeTournamentTeamGamesAction) => this.tournamentTeamService.subscribeOnTournamentTeamGames(action.payload));

  @Effect({dispatch: false}) subscribeTeamRankings = this.actions$
    .ofType(TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION)
    .debug('TOURNAMENT_TEAM_RANKINGS_SUBSCRIBE_ACTION')
    .map((action: SubscribeTournamentTeamRankingsAction) => this.tournamentTeamService.subscribeOnTournamentTeamRankings(action.payload));

  @Effect({dispatch: false}) pushTeam: Observable<void> = this.actions$
    .ofType(TOURNAMENT_TEAM_PUSH_ACTION)
    .debug('TOURNAMENT_TEAM_PUSH_ACTION')
    .map((action: TournamentTeamPushAction) => this.tournamentTeamService.pushTournamentTeam(action.payload));

  @Effect({dispatch: false}) erase = this.actions$
    .ofType(TOURNAMENT_TEAM_ERASE_ACTION)
    .debug('TOURNAMENT_TEAM_ERASE_ACTION')
    .map((action: TournamentTeamEraseAction) => this.tournamentTeamService.eraseTournamentTeam(action.payload));

  @Effect({dispatch: false}) changeRegistration: Observable<void> = this.actions$
    .ofType(TEAM_REGISTRATION_CHANGE_ACTION)
    .debug('TEAM_REGISTRATION_CHANGE_ACTION')
    .map((action: TeamRegistrationChangeAction) => this.tournamentTeamService.teamRegistrationChange(action.payload));

  @Effect({dispatch: false}) armyListForTeamRegistration = this.actions$
    .ofType(ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION)
    .debug('ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION')
    .map((action: ArmyListForTeamRegistrationPushAction) => this.tournamentTeamService.armyListForTeamRegistration(action.payload));

  @Effect({dispatch: false}) updateTeamAction: Observable<void> = this.actions$
    .ofType(UPDATE_TEAM_ACTION)
    .debug('UPDATE_TEAM_ACTION')
    .map((action: UpdateTeamAction) => this.tournamentTeamService.updateTeam(action.payload));


  constructor(
    private actions$: Actions,
    private tournamentTeamService: TournamentTeamService
  ) { }
}
