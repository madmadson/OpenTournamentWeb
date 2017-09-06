import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';

import {
  ARMY_LIST_ERASE_ACTION, TOURNAMENT_PLAYER_PUSH_ACTION, REGISTRATION_ERASE_ACTION,
  REGISTRATION_PUSH_ACTION, TOURNAMENT_PLAYER_ERASE_ACTION, REGISTRATION_ACCEPT_ACTION,
  TOURNAMENT_PAIR_AGAIN_ACTION, GAME_RESULT_ENTERED_ACTION, TOURNAMENT_NEW_ROUND_ACTION, PUBLISH_ROUND_ACTION,
  TOURNAMENT_KILL_ROUND_ACTION, END_TOURNAMENT_ACTION, UNDO_TOURNAMENT_END_ACTION, SWAP_PLAYER_ACTION,
  UPLOAD_TOURNAMENT_ACTION, TEAM_TOURNAMENT_NEW_ROUND_ACTION, TOURNAMENT_KILL_TEAM_ROUND_ACTION,
  SCENARIO_SELECTED_ACTION, TOURNAMENT_PAIR_AGAIN_TEAM_ACTION, SWAP_TEAM_ACTION, TEAM_GAME_RESULT_ENTERED_ACTION,
  SCENARIO_SELECTED_TEAM_TOURNAMENT_ACTION, END_TEAM_TOURNAMENT_ACTION, UNDO_TEAM_TOURNAMENT_END_ACTION,
  UPLOAD_TEAM_TOURNAMENT_ACTION, PLAYER_REGISTRATION_CHANGE_ACTION, ARMY_LIST_FOR_REGISTRATION_PUSH_ACTION,
  ARMY_LIST_FOR_TOURNAMENT_PLAYER_PUSH_ACTION, DROP_PLAYER_PUSH_ACTION, UNDO_DROP_PLAYER_PUSH_ACTION,
  DROP_TEAM_PUSH_ACTION, UNDO_DROP_TEAM_PUSH_ACTION, EndTournamentAction, EndTeamTournamentAction,
  TournamentNewRoundAction, TeamTournamentNewRoundAction, TournamentKillRoundAction, TournamentKillTeamRoundAction,
  UndoTournamentEndAction, UndoTeamTournamentEndAction, UploadTournamentAction, UploadTeamTournamentAction,
  GameResultEnteredAction, TeamGameResultEnteredAction, ScenarioSelectedAction, ScenarioSelectedTeamTournamentAction,
  SwapPlayerAction, SwapTeamAction, DropPlayerPushAction, UndoDropPlayerPushAction, DropTeamPushAction,
  UndoDropTeamPushAction, PublishRoundAction, TournamentPairAgainAction, TournamentPairAgainTeamAction,
  RegistrationPushAction, RegistrationEraseAction, RegistrationAcceptAction,
  TournamentPlayerEraseAction, ArmyListForRegistrationPushAction, ArmyListForTournamentPlayerPushAction,
  ArmyListEraseAction, TournamentPlayerPushAction, PlayerRegistrationChangeAction
} from '../../tournament/tournament-actions';
import {TournamentService} from '../../tournament/actual-tournament.service';
import {
  CLEAR_TEAM_GAME_RESULT_ACTION, ClearTeamGameResultAction
} from '../actions/tournament-team-games-actions';
import {CLEAR_PLAYER_GAME_RESULT_ACTION, ClearPlayerGameResultAction} from 'app/store/actions/tournament-games-actions';


@Injectable()
export class TournamentEffectService {

  @Effect({dispatch: false}) endTournament = this.actions$
    .ofType(END_TOURNAMENT_ACTION)
    .debug('END_TOURNAMENT_ACTION')
    .map((action: EndTournamentAction) => this.tournamentService.endTournament(action.payload));

  @Effect({dispatch: false}) endTeamTournament = this.actions$
    .ofType(END_TEAM_TOURNAMENT_ACTION)
    .debug('END_TEAM_TOURNAMENT_ACTION')
    .map((action: EndTeamTournamentAction) => this.tournamentService.endTeamTournament(action.payload));

  @Effect({dispatch: false}) pairNewRound = this.actions$
    .ofType(TOURNAMENT_NEW_ROUND_ACTION)
    .debug('TOURNAMENT_NEW_ROUND_ACTION')
    .map((action: TournamentNewRoundAction) => this.tournamentService.pairNewRound(action.payload));

  @Effect({dispatch: false}) pairNewRoundTeam = this.actions$
    .ofType(TEAM_TOURNAMENT_NEW_ROUND_ACTION)
    .debug('TEAM_TOURNAMENT_NEW_ROUND_ACTION')
    .map((action: TeamTournamentNewRoundAction) => this.tournamentService.pairNewTeamTournamentRound(action.payload));

  @Effect({dispatch: false}) killRound = this.actions$
    .ofType(TOURNAMENT_KILL_ROUND_ACTION)
    .debug('TOURNAMENT_KILL_ROUND_ACTION')
    .map((action: TournamentKillRoundAction) => this.tournamentService.killRound(action.payload));

  @Effect({dispatch: false}) killTeamRound = this.actions$
    .ofType(TOURNAMENT_KILL_TEAM_ROUND_ACTION)
    .debug('TOURNAMENT_KILL_TEAM_ROUND_ACTION')
    .map((action: TournamentKillTeamRoundAction) => this.tournamentService.killTeamRound(action.payload));

  @Effect({dispatch: false}) undoTournamentEnd = this.actions$
    .ofType(UNDO_TOURNAMENT_END_ACTION)
    .debug('UNDO_TOURNAMENT_END_ACTION')
    .map((action: UndoTournamentEndAction) => this.tournamentService.undoTournamentEnd(action.payload));

  @Effect({dispatch: false}) undoTeamTournamentEnd = this.actions$
    .ofType(UNDO_TEAM_TOURNAMENT_END_ACTION)
    .debug('UNDO_TEAM_TOURNAMENT_END_ACTION')
    .map((action: UndoTeamTournamentEndAction) => this.tournamentService.undoTeamTournamentEnd(action.payload));

  @Effect({dispatch: false}) uploadTournament = this.actions$
    .ofType(UPLOAD_TOURNAMENT_ACTION)
    .debug('UPLOAD_TOURNAMENT_ACTION')
    .map((action: UploadTournamentAction) => this.tournamentService.uploadTournament(action.payload));

  @Effect({dispatch: false}) uploadTeamTournament = this.actions$
    .ofType(UPLOAD_TEAM_TOURNAMENT_ACTION)
    .debug('UPLOAD_TEAM_TOURNAMENT_ACTION')
    .map((action: UploadTeamTournamentAction) => this.tournamentService.uploadTeamTournament(action.payload));

  @Effect({dispatch: false}) gameResultEntered = this.actions$
    .ofType(GAME_RESULT_ENTERED_ACTION)
    .debug('GAME_RESULT_ENTERED_ACTION')
    .map((action: GameResultEnteredAction) => this.tournamentService.gameResultEntered(action.payload));

  @Effect({dispatch: false}) teamGameResultEntered = this.actions$
    .ofType(TEAM_GAME_RESULT_ENTERED_ACTION)
    .debug('TEAM_GAME_RESULT_ENTERED_ACTION')
    .map((action: TeamGameResultEnteredAction) => this.tournamentService.teamGameResultEntered(action.payload));

  @Effect({dispatch: false}) scenarioSelectedAction = this.actions$
    .ofType(SCENARIO_SELECTED_ACTION)
    .debug('SCENARIO_SELECTED_ACTION')
    .map((action: ScenarioSelectedAction) => this.tournamentService.scenarioSelectedAction(action.payload));

  @Effect({dispatch: false}) scenarioSelectedTeamTournamentAction = this.actions$
    .ofType(SCENARIO_SELECTED_TEAM_TOURNAMENT_ACTION)
    .debug('SCENARIO_SELECTED_TEAM_TOURNAMENT_ACTION')
    .map((action: ScenarioSelectedTeamTournamentAction) => this.tournamentService.scenarioSelectedTeamTournamentAction(action.payload));

  @Effect({dispatch: false}) swapPlayer = this.actions$
    .ofType(SWAP_PLAYER_ACTION)
    .debug('SWAP_PLAYER_ACTION')
    .map((action: SwapPlayerAction) => this.tournamentService.swapPlayer(action.payload));

  @Effect({dispatch: false}) swapTeam = this.actions$
    .ofType(SWAP_TEAM_ACTION)
    .debug('SWAP_TEAM_ACTION')
    .map((action: SwapTeamAction) => this.tournamentService.swapTeam(action.payload));

  @Effect({dispatch: false}) dropPlayer = this.actions$
    .ofType(DROP_PLAYER_PUSH_ACTION)
    .debug('DROP_PLAYER_PUSH_ACTION')
    .map((action: DropPlayerPushAction) => this.tournamentService.dropPlayer(action.payload));

  @Effect({dispatch: false}) undoDropPlayer = this.actions$
    .ofType(UNDO_DROP_PLAYER_PUSH_ACTION)
    .debug('UNDO_DROP_PLAYER_PUSH_ACTION')
    .map((action: UndoDropPlayerPushAction) => this.tournamentService.undoDropPlayer(action.payload));

  @Effect({dispatch: false}) dropTeam = this.actions$
    .ofType(DROP_TEAM_PUSH_ACTION)
    .debug('DROP_TEAM_PUSH_ACTION')
    .map((action: DropTeamPushAction) => this.tournamentService.dropTeam(action.payload));

  @Effect({dispatch: false}) undoDropTeam = this.actions$
    .ofType(UNDO_DROP_TEAM_PUSH_ACTION)
    .debug('UNDO_DROP_TEAM_PUSH_ACTION')
    .map((action: UndoDropTeamPushAction) => this.tournamentService.undoDropTeam(action.payload));

  @Effect({dispatch: false}) publishRound = this.actions$
    .ofType(PUBLISH_ROUND_ACTION)
    .debug('PUBLISH_ROUND_ACTION')
    .map((action: PublishRoundAction) => this.tournamentService.publishRound(action.payload));

  @Effect({dispatch: false}) pairAgainTournament = this.actions$
    .ofType(TOURNAMENT_PAIR_AGAIN_ACTION)
    .debug('TOURNAMENT_PAIR_AGAIN_ACTION')
    .map((action: TournamentPairAgainAction) => this.tournamentService.pairAgainRound(action.payload));

  @Effect({dispatch: false}) pairAgainTeamTournament = this.actions$
    .ofType(TOURNAMENT_PAIR_AGAIN_TEAM_ACTION)
    .debug('TOURNAMENT_PAIR_AGAIN_TEAM_ACTION')
    .map((action: TournamentPairAgainTeamAction) => this.tournamentService.pairAgainTeamTournament(action.payload));


  @Effect({dispatch: false}) pushRegistration = this.actions$
    .ofType(REGISTRATION_PUSH_ACTION)
    .debug('REGISTRATION_PUSH_ACTION')
    .map((action: RegistrationPushAction) => this.tournamentService.pushRegistration(action.payload));

  @Effect({dispatch: false}) eraseRegistration = this.actions$
    .ofType(REGISTRATION_ERASE_ACTION)
    .debug('REGISTRATION_ERASE_ACTION')
    .map((action: RegistrationEraseAction) => this.tournamentService.eraseRegistration(action.payload));

  @Effect({dispatch: false}) pushTournamentPlayer = this.actions$
    .ofType(REGISTRATION_ACCEPT_ACTION)
    .debug('REGISTRATION_ACCEPT_ACTION')
    .map((action: RegistrationAcceptAction) => this.tournamentService.pushTournamentPlayer(action.payload));

  @Effect({dispatch: false}) eraseTournamentPlayer = this.actions$
    .ofType(TOURNAMENT_PLAYER_ERASE_ACTION)
    .debug('TOURNAMENT_PLAYER_ERASE_ACTION')
    .map((action: TournamentPlayerEraseAction) => this.tournamentService.eraseTournamentPlayer(action.payload));

  @Effect({dispatch: false}) pushArmyListForRegistration = this.actions$
    .ofType(ARMY_LIST_FOR_REGISTRATION_PUSH_ACTION)
    .debug('ARMY_LIST_FOR_REGISTRATION_PUSH_ACTION')
    .map((action: ArmyListForRegistrationPushAction) => this.tournamentService.pushArmyListForRegistration(action.payload));

  @Effect({dispatch: false}) pushArmyListForTournamentPlayer = this.actions$
    .ofType(ARMY_LIST_FOR_TOURNAMENT_PLAYER_PUSH_ACTION)
    .debug('ARMY_LIST_FOR_TOURNAMENT_PLAYER_PUSH_ACTION')
    .map((action: ArmyListForTournamentPlayerPushAction) => this.tournamentService.pushArmyListForTournamentPlayer(action.payload));

  @Effect({dispatch: false}) eraseArmyList = this.actions$
    .ofType(ARMY_LIST_ERASE_ACTION)
    .debug('ARMY_LIST_ERASE_ACTION')
    .map((action: ArmyListEraseAction) => this.tournamentService.eraseArmyList(action.payload));

  @Effect({dispatch: false}) pushNewTournamentPlayer = this.actions$
    .ofType(TOURNAMENT_PLAYER_PUSH_ACTION)
    .debug('TOURNAMENT_PLAYER_PUSH_ACTION')
    .map((action: TournamentPlayerPushAction) => this.tournamentService.pushNewTournamentPlayer(action.payload));

  @Effect({dispatch: false}) playerRegistrationChangeAction = this.actions$
    .ofType(PLAYER_REGISTRATION_CHANGE_ACTION)
    .debug('PLAYER_REGISTRATION_CHANGE_ACTION')
    .map((action: PlayerRegistrationChangeAction) => this.tournamentService.playerRegistrationChangeAction(action.payload));

  @Effect({dispatch: false}) clearPlayerGameResult = this.actions$
    .ofType(CLEAR_PLAYER_GAME_RESULT_ACTION)
    .debug('CLEAR_PLAYER_GAME_RESULT_ACTION')
    .map((action: ClearPlayerGameResultAction) => this.tournamentService.clearPlayerGameResult(action.payload));

  @Effect({dispatch: false}) clearTeamGameResult = this.actions$
    .ofType(CLEAR_TEAM_GAME_RESULT_ACTION)
    .debug('CLEAR_TEAM_GAME_RESULT_ACTION')
    .map((action: ClearTeamGameResultAction) => this.tournamentService.clearTeamGameResult(action.payload));

  constructor(
    private actions$: Actions,
    private tournamentService: TournamentService
  ) { }
}
