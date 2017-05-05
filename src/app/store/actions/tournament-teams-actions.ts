import {Action} from '@ngrx/store';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {TeamRegistrationPush} from "../../../../shared/dto/team-registration-push";
import {TournamentTeamEraseModel} from "../../../../shared/dto/tournament-team-erase";


export const TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION = 'TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION';

export class SubscribeTournamentTeamRegistrationsAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATIONS_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION = 'TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION';

export class TournamentTeamRegistrationPushAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATION_PUSH_ACTION';

  constructor(public payload: TournamentTeam) {
  }
}

export const TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION = 'TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION';

export class TournamentTeamRegistrationAcceptAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATION_ACCEPT_ACTION';

  constructor(public payload: TeamRegistrationPush) {
  }
}

export const TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION = 'TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION';

export class TournamentTeamRegistrationEraseAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATION_ERASE_ACTION';

  constructor(public payload: TeamRegistrationPush) {
  }
}

export const TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION = 'TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION';

export class ClearTournamentTeamRegistrationsAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATIONS_CLEAR_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION = 'TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION';

export class AddTournamentTeamRegistrationAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATION_ADDED_ACTION';

  constructor(public payload: TournamentTeam) {
  }
}

export const TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION = 'TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION';

export class DeleteTournamentTeamRegistrationAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATION_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION = 'TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION';

export class ChangeTournamentTeamRegistrationAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_REGISTRATION_CHANGED_ACTION';

  constructor(public payload: TournamentTeam) {
  }
}

export const TOURNAMENT_TEAMS_SUBSCRIBE_ACTION = 'TOURNAMENT_TEAMS_SUBSCRIBE_ACTION';

export class SubscribeTournamentTeamsAction implements Action {

  readonly type = 'TOURNAMENT_TEAMS_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_PUSH_ACTION = 'TOURNAMENT_TEAM_PUSH_ACTION';

export class TournamentTeamPushAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_PUSH_ACTION';

  constructor(public payload: TournamentTeam) {
  }
}

export const TOURNAMENT_TEAM_ERASE_ACTION = 'TOURNAMENT_TEAM_ERASE_ACTION';

export class TournamentTeamEraseAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_ERASE_ACTION';

  constructor(public payload: TournamentTeamEraseModel) {
  }
}

export const TOURNAMENT_TEAMS_CLEAR_ACTION = 'TOURNAMENT_TEAMS_CLEAR_ACTION';

export class ClearTournamentTeamsAction implements Action {

  readonly type = 'TOURNAMENT_TEAMS_CLEAR_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_TEAM_ADDED_ACTION = 'TOURNAMENT_TEAM_ADDED_ACTION';

export class AddTournamentTeamAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_ADDED_ACTION';

  constructor(public payload: TournamentTeam) {
  }
}

export const TOURNAMENT_TEAM_DELETED_ACTION = 'TOURNAMENT_TEAM_DELETED_ACTION';

export class DeleteTournamentTeamAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_TEAM_CHANGED_ACTION = 'TOURNAMENT_TEAM_CHANGED_ACTION';

export class ChangeTournamentTeamAction implements Action {

  readonly type = 'TOURNAMENT_TEAM_CHANGED_ACTION';

  constructor(public payload: TournamentTeam) {
  }
}
