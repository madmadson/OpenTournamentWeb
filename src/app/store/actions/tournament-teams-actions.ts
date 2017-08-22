import {Action} from '@ngrx/store';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';
import {TournamentTeamEraseModel} from '../../../../shared/dto/tournament-team-erase';
import {TeamRegistrationChange} from '../../../../shared/dto/team-registration-change';
import {ArmyListTeamPush} from "../../../../shared/dto/team-armyList-push";
import {TeamUpdate} from "../../../../shared/dto/team-update";


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

export const TEAM_REGISTRATION_CHANGE_ACTION = 'TEAM_REGISTRATION_CHANGE_ACTION';
export class TeamRegistrationChangeAction implements Action {

  readonly type = 'TEAM_REGISTRATION_CHANGE_ACTION';
  constructor(public payload: TeamRegistrationChange) {
  }
}

export const ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION = 'ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION';
export class ArmyListForTeamRegistrationPushAction implements Action {

  readonly type = 'ARMY_LIST_FOR_TEAM_REGISTRATION_PUSH_ACTION';
  constructor(public payload: ArmyListTeamPush) {
  }
}

export const UPDATE_TEAM_ACTION = 'UPDATE_TEAM_ACTION';
export class UpdateTeamAction implements Action {

  readonly type = 'UPDATE_TEAM_ACTION';
  constructor(public payload: TeamUpdate) {
  }
}
