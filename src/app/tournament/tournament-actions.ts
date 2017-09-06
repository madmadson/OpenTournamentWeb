import {Action} from '@ngrx/store';
import {Registration} from '../../../shared/model/registration';
import {RegistrationPush} from '../../../shared/dto/registration-push';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyListTournamentPlayerPush} from '../../../shared/dto/armyList-tournamentPlayer-push';
import {ArmyList} from '../../../shared/model/armyList';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {ScenarioSelectedModel} from '../../../shared/dto/scenario-selected-model';
import {GameResult} from '../../../shared/dto/game-result';
import {SwapGames} from '../../../shared/dto/swap-player';
import {DropPlayerPush} from '../../../shared/dto/drop-player-push';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {PublishRound} from '../../../shared/dto/publish-round';
import {PlayerRegistrationChange} from '../../../shared/dto/playerRegistration-change';
import {ArmyListRegistrationPush} from '../../../shared/dto/armyList-registration-push';

export const SET_ACTUAL_TOURNAMENT_ACTION = 'SET_ACTUAL_TOURNAMENT_ACTION';
export const UNSET_ACTUAL_TOURNAMENT_ACTION = 'UNSET_ACTUAL_TOURNAMENT_ACTION';
export const CHANGE_ACTUAL_TOURNAMENT_ACTION = 'CHANGE_ACTUAL_TOURNAMENT_ACTION';

export const ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION = 'ADD_ACTUAL_TOURNAMENT_REGISTRATION_ACTION';
export const CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION = 'CHANGE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION';
export const REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION = 'REMOVE_ACTUAL_TOURNAMENT_REGISTRATION_ACTION';
export const CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION = 'CLEAR_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION';
export const ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATIONS_ACTION = 'ADD_ALL_ACTUAL_TOURNAMENT_REGISTRATION_ACTION';
export const LOAD_REGISTRATIONS_FINISHED_ACTION = 'LOAD_REGISTRATIONS_FINISHED_ACTION';

export const ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION = 'ADD_ACTUAL_TOURNAMENT_PLAYER_ACTION';
export const CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION = 'CHANGE_ACTUAL_TOURNAMENT_PLAYER_ACTION';
export const REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION = 'REMOVE_ACTUAL_TOURNAMENT_PLAYER_ACTION';
export const CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION = 'CLEAR_ACTUAL_TOURNAMENT_PLAYERS_ACTION';
export const ADD_ALL_ACTUAL_TOURNAMENT_PLAYERS_ACTION = 'ADD_ALL_ACTUAL_TOURNAMENT_PLAYER_ACTION';
export const LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION = 'LOAD_TOURNAMENT_PLAYERS_FINISHED_ACTION';
export const CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION = 'CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION';

export const ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION = 'ADD_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION';
export const CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION = 'CHANGE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION';
export const REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION = 'REMOVE_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION';
export const CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION = 'CLEAR_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION';
export const ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LISTS_ACTION = 'ADD_ALL_ACTUAL_TOURNAMENT_ARMY_LIST_ACTION';

export const ADD_ACTUAL_TOURNAMENT_RANKING_ACTION = 'ADD_ACTUAL_TOURNAMENT_RANKING_ACTION';
export const CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION = 'CHANGE_ACTUAL_TOURNAMENT_RANKING_ACTION';
export const REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION = 'REMOVE_ACTUAL_TOURNAMENT_RANKING_ACTION';
export const CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION = 'CLEAR_ACTUAL_TOURNAMENT_RANKINGS_ACTION';
export const ADD_ALL_ACTUAL_TOURNAMENT_RANKINGS_ACTION = 'ADD_ALL_ACTUAL_TOURNAMENT_RANKING_ACTION';
export const LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION = 'LOAD_TOURNAMENT_RANKINGS_FINISHED_ACTION';

export const ADD_ACTUAL_TOURNAMENT_GAME_ACTION = 'ADD_ACTUAL_TOURNAMENT_GAME_ACTION';
export const CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION = 'CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION';
export const REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION = 'REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION';
export const CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION = 'CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION';
export const ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION = 'ADD_ALL_ACTUAL_TOURNAMENT_GAME_ACTION';
export const LOAD_TOURNAMENT_GAMES_FINISHED_ACTION = 'LOAD_TOURNAMENT_GAMES_FINISHED_ACTION';


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

export const ARMY_LIST_FOR_REGISTRATION_PUSH_ACTION = 'ARMY_LIST_FOR_REGISTRATION_PUSH_ACTION';
export class ArmyListForRegistrationPushAction implements Action {

  readonly type = 'ARMY_LIST_FOR_REGISTRATION_PUSH_ACTION';
  constructor(public payload: ArmyListRegistrationPush) {
  }
}

export const ARMY_LIST_FOR_TOURNAMENT_PLAYER_PUSH_ACTION = 'ARMY_LIST_FOR_TOURNAMENT_PLAYER_PUSH_ACTION';
export class ArmyListForTournamentPlayerPushAction implements Action {

  readonly type = 'ARMY_LIST_FOR_TOURNAMENT_PLAYER_PUSH_ACTION';
  constructor(public payload: ArmyListTournamentPlayerPush) {
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

export const UNDO_TEAM_TOURNAMENT_END_ACTION = 'UNDO_TEAM_TOURNAMENT_END_ACTION';
export class UndoTeamTournamentEndAction implements Action {

  readonly type = 'UNDO_TEAM_TOURNAMENT_END_ACTION';
  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const UPLOAD_TOURNAMENT_ACTION = 'UPLOAD_TOURNAMENT_ACTION';
export class UploadTournamentAction implements Action {

  readonly type = 'UPLOAD_TOURNAMENT_ACTION';
  constructor(public payload: string) {
  }
}

export const UPLOAD_TEAM_TOURNAMENT_ACTION = 'UPLOAD_TEAM_TOURNAMENT_ACTION';
export class UploadTeamTournamentAction implements Action {

  readonly type = 'UPLOAD_TEAM_TOURNAMENT_ACTION';
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

export const DROP_PLAYER_PUSH_ACTION = 'DROP_PLAYER_PUSH_ACTION';
export class DropPlayerPushAction implements Action {

  readonly type = 'DROP_PLAYER_PUSH_ACTION';
  constructor(public payload: DropPlayerPush) {
  }
}

export const UNDO_DROP_PLAYER_PUSH_ACTION = 'UNDO_DROP_PLAYER_PUSH_ACTION';
export class UndoDropPlayerPushAction implements Action {

  readonly type = 'UNDO_DROP_PLAYER_PUSH_ACTION';
  constructor(public payload: TournamentRanking) {
  }
}

export const DROP_TEAM_PUSH_ACTION = 'DROP_TEAM_PUSH_ACTION';
export class DropTeamPushAction implements Action {

  readonly type = 'DROP_TEAM_PUSH_ACTION';
  constructor(public payload: DropPlayerPush) {
  }
}

export const UNDO_DROP_TEAM_PUSH_ACTION = 'UNDO_DROP_TEAM_PUSH_ACTION';
export class UndoDropTeamPushAction implements Action {

  readonly type = 'UNDO_DROP_TEAM_PUSH_ACTION';
  constructor(public payload: TournamentRanking) {
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

export const END_TEAM_TOURNAMENT_ACTION = 'END_TEAM_TOURNAMENT_ACTION';
export class EndTeamTournamentAction implements Action {

  readonly type = 'END_TEAM_TOURNAMENT_ACTION';
  constructor(public payload: TournamentManagementConfiguration) {
  }
}

export const PLAYER_REGISTRATION_CHANGE_ACTION = 'PLAYER_REGISTRATION_CHANGE_ACTION';
export class PlayerRegistrationChangeAction implements Action {

  readonly type = 'PLAYER_REGISTRATION_CHANGE_ACTION';
  constructor(public payload: PlayerRegistrationChange) {
  }
}
