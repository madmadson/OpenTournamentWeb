import {Action} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';
import {Registration} from '../../../../shared/model/registration';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';

import {GameResult} from '../../../../shared/dto/game-result';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {RegistrationPush} from '../../../../shared/dto/registration-push';
import {SwapGames} from "../../../../shared/dto/swap-player";
import {ScenarioSelectedModel} from "../../../../shared/dto/scenario-selected-model";


export const TOURNAMENT_SUBSCRIBE_ACTION = 'TOURNAMENT_SUBSCRIBE_ACTION';

export class TournamentSubscribeAction implements Action {

  readonly type = 'TOURNAMENT_SUBSCRIBE_ACTION';

  constructor(public payload: string) {
  }
}

export const TOURNAMENT_UNSUBSCRIBE_ACTION = 'TOURNAMENT_UNSUBSCRIBE_ACTION';

export class TournamentUnsubscribeAction implements Action {

  readonly type = 'TOURNAMENT_UNSUBSCRIBE_ACTION';

  constructor() {
  }
}

export const SET_ACTUAL_TOURNAMENT_ACTION = 'SET_ACTUAL_TOURNAMENT_ACTION';

export class SetActualTournamentAction implements Action {

  readonly type = 'SET_ACTUAL_TOURNAMENT_ACTION';

  constructor(public payload: Tournament) {
  }
}

export const TOURNAMENT_REGISTRATION_ADDED = 'TOURNAMENT_REGISTRATION_ADDED';

export class TournamentRegistrationAdded implements Action {

  readonly type = 'TOURNAMENT_REGISTRATION_ADDED';

  constructor(public payload: Registration) {
  }
}

export const TOURNAMENT_REGISTRATION_CHANGED = 'TOURNAMENT_REGISTRATION_CHANGED';

export class TournamentRegistrationChanged implements Action {

  readonly type = 'TOURNAMENT_REGISTRATION_CHANGED';

  constructor(public payload: Registration) {
  }
}

export const TOURNAMENT_REGISTRATION_DELETED = 'TOURNAMENT_REGISTRATION_DELETED';

export class TournamentRegistrationDeleted implements Action {

  readonly type = 'TOURNAMENT_REGISTRATION_DELETED';

  constructor(public payload: string) {
  }
}

export const REGISTRATION_PUSH_ACTION = 'REGISTRATION_PUSH_ACTION';

export class RegistrationPushAction implements Action {

  readonly type = 'REGISTRATION_PUSH_ACTION';

  constructor(public payload: RegistrationPush) {
  }
}

export const REGISTRATION_ERASE_ACTION = 'REGISTRATION_ERASE_ACTION';

export class RegistrationEraseAction implements Action {

  readonly type = 'REGISTRATION_ERASE_ACTION';

  constructor(public payload: RegistrationPush) {
  }
}

export const CLEAR_TOURNAMENT_REGISTRATION_ACTION = 'CLEAR_TOURNAMENT_REGISTRATION_ACTION';

export class ClearRegistrationAction implements Action {

  readonly type = 'CLEAR_TOURNAMENT_REGISTRATION_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_PLAYER_ADDED = 'TOURNAMENT_PLAYER_ADDED';

export class TournamentPlayerAdded implements Action {

  readonly type = 'TOURNAMENT_PLAYER_ADDED';

  constructor(public payload: TournamentPlayer) {
  }
}

export const TOURNAMENT_PLAYER_CHANGED = 'TOURNAMENT_PLAYER_CHANGED';

export class TournamentPlayerChanged implements Action {

  readonly type = 'TOURNAMENT_PLAYER_CHANGED';

  constructor(public payload: TournamentPlayer) {
  }
}

export const TOURNAMENT_PLAYER_DELETED = 'TOURNAMENT_PLAYER_DELETED';

export class TournamentPlayerDeleted implements Action {

  readonly type = 'TOURNAMENT_PLAYER_DELETED';

  constructor(public payload: string) {
  }
}

export const CLEAR_TOURNAMENT_PLAYER_ACTION = 'CLEAR_TOURNAMENT_PLAYER_ACTION';

export class ClearTournamentPlayerAction implements Action {

  readonly type = 'CLEAR_TOURNAMENT_PLAYER_ACTION';

  constructor() {
  }
}

export const REGISTRATION_ACCEPT_ACTION = 'REGISTRATION_ACCEPT_ACTION';

export class RegistrationAcceptAction implements Action {

  readonly type = 'REGISTRATION_ACCEPT_ACTION';

  constructor(public payload: Registration) {
  }
}


export const TOURNAMENT_PLAYER_PUSH_ACTION = 'TOURNAMENT_PLAYER_PUSH_ACTION';

export class TournamentPlayerPushAction implements Action {

  readonly type = 'TOURNAMENT_PLAYER_PUSH_ACTION';

  constructor(public payload: TournamentPlayer) {
  }
}

export const TOURNAMENT_PLAYER_ERASE_ACTION = 'TOURNAMENT_PLAYER_ERASE_ACTION';

export class TournamentPlayerEraseAction implements Action {

  readonly type = 'TOURNAMENT_PLAYER_ERASE_ACTION';

  constructor(public payload: TournamentPlayer) {
  }
}

export const ARMY_LIST_PUSH_ACTION = 'ARMY_LIST_PUSH_ACTION';

export class ArmyListPushAction implements Action {

  readonly type = 'ARMY_LIST_PUSH_ACTION';

  constructor(public payload: ArmyList) {
  }
}

export const ARMY_LIST_ERASE_ACTION = 'ARMY_LIST_ERASE_ACTION';

export class ArmyListEraseAction implements Action {

  readonly type = 'ARMY_LIST_ERASE_ACTION';

  constructor(public payload: ArmyList) {
  }
}

export const ARMY_LIST_ADDED_ACTION = 'ARMY_LIST_ADDED_ACTION';

export class AddArmyListAction implements Action {

  readonly type = 'ARMY_LIST_ADDED_ACTION';

  constructor(public payload: ArmyList) {
  }
}

export const ARMY_LIST_DELETED_ACTION = 'ARMY_LIST_DELETED_ACTION';

export class ArmyListDeletedAction implements Action {

  readonly type = 'ARMY_LIST_DELETED_ACTION';

  constructor(public payload: string) {
  }
}

export const CLEAR_ARMY_LISTS_ACTION = 'CLEAR_ARMY_LISTS_ACTION';

export class ClearArmyListsAction implements Action {

  readonly type = 'CLEAR_ARMY_LISTS_ACTION';

  constructor() {
  }
}

export const TOURNAMENT_PAIR_AGAIN_ACTION = 'TOURNAMENT_PAIR_AGAIN_ACTION';

export class TournamentPairAgainAction implements Action {

  readonly type = 'TOURNAMENT_PAIR_AGAIN_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const TOURNAMENT_PAIR_AGAIN_TEAM_ACTION = 'TOURNAMENT_PAIR_AGAIN_TEAM_ACTION';

export class TournamentPairAgainTeamAction implements Action {

  readonly type = 'TOURNAMENT_PAIR_AGAIN_TEAM_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const TOURNAMENT_NEW_ROUND_ACTION = 'TOURNAMENT_NEW_ROUND_ACTION';
export class TournamentNewRoundAction implements Action {

  readonly type = 'TOURNAMENT_NEW_ROUND_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const TEAM_TOURNAMENT_NEW_ROUND_ACTION = 'TEAM_TOURNAMENT_NEW_ROUND_ACTION';
export class TeamTournamentNewRoundAction implements Action {

  readonly type = 'TEAM_TOURNAMENT_NEW_ROUND_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const TOURNAMENT_KILL_ROUND_ACTION = 'TOURNAMENT_KILL_ROUND_ACTION';

export class TournamentKillRoundAction implements Action {

  readonly type = 'TOURNAMENT_KILL_ROUND_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const TOURNAMENT_KILL_TEAM_ROUND_ACTION = 'TOURNAMENT_KILL_TEAM_ROUND_ACTION';

export class TournamentKillTeamRoundAction implements Action {

  readonly type = 'TOURNAMENT_KILL_TEAM_ROUND_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const UNDO_TOURNAMENT_END_ACTION = 'UNDO_TOURNAMENT_END_ACTION';

export class UndoTournamentEndAction implements Action {

  readonly type = 'UNDO_TOURNAMENT_END_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const UPLOAD_TOURNAMENT_ACTION = 'UPLOAD_TOURNAMENT_ACTION';

export class UploadTournamentAction implements Action {

  readonly type = 'UPLOAD_TOURNAMENT_ACTION';

  constructor(public payload: string) {
  }
}


export const ADD_DUMMY_PLAYER_ACTION = 'ADD_DUMMY_PLAYER_ACTION';

export class AddDummyPlayerAction implements Action {

  readonly type = 'ADD_DUMMY_PLAYER_ACTION';

  constructor(public payload: string) {
  }
}

export const GAME_RESULT_ENTERED_ACTION = 'GAME_RESULT_ENTERED_ACTION';

export class GameResultEnteredAction implements Action {

  readonly type = 'GAME_RESULT_ENTERED_ACTION';

  constructor(public payload: GameResult) {
  }
}

export const TEAM_GAME_RESULT_ENTERED_ACTION = 'TEAM_GAME_RESULT_ENTERED_ACTION';
export class TeamGameResultEnteredAction implements Action {

  readonly type = 'TEAM_GAME_RESULT_ENTERED_ACTION';

  constructor(public payload: GameResult) {
  }
}

export const SCENARIO_SELECTED_ACTION = 'SCENARIO_SELECTED_ACTION';
export class ScenarioSelectedAction implements Action {

  readonly type = 'SCENARIO_SELECTED_ACTION';

  constructor(public payload: ScenarioSelectedModel) {
  }
}

export const SCENARIO_SELECTED_TEAM_TOURNAMENT_ACTION = 'SCENARIO_SELECTED_TEAM_TOURNAMENT_ACTION';
export class ScenarioSelectedTeamTournamentAction implements Action {

  readonly type = 'SCENARIO_SELECTED_TEAM_TOURNAMENT_ACTION';

  constructor(public payload: ScenarioSelectedModel) {
  }
}

export const SWAP_PLAYER_ACTION = 'SWAP_PLAYER_ACTION';

export class SwapPlayerAction implements Action {

  readonly type = 'SWAP_PLAYER_ACTION';

  constructor(public payload: SwapGames) {
  }
}

export const SWAP_TEAM_ACTION = 'SWAP_TEAM_ACTION';
export class SwapTeamAction implements Action {

  readonly type = 'SWAP_TEAM_ACTION';
  constructor(public payload: SwapGames) {
  }
}

export const PUBLISH_ROUND_ACTION = 'PUBLISH_ROUND_ACTION';
export class PublishRoundAction implements Action {

  readonly type = 'PUBLISH_ROUND_ACTION';
  constructor(public payload: PublishRound) {
  }
}

export const END_TOURNAMENT_ACTION = 'END_TOURNAMENT_ACTION';

export class EndTournamentAction implements Action {

  readonly type = 'END_TOURNAMENT_ACTION';

  constructor(public payload: TournamentManagementConfiguration) {
  }
}
