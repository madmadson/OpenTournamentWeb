import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tournament} from '../../../../shared/model/tournament';
import {Registration} from '../../../../shared/model/registration';
import {ArmyList} from '../../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';

import {
  TournamentPlayerPushAction, TournamentSubscribeAction,
  TournamentUnsubscribeAction, TournamentPlayerEraseAction, RegistrationEraseAction,
  ArmyListEraseAction, RegistrationPushAction, TournamentPairAgainAction, GameResultEnteredAction,
  TournamentNewRoundAction, AddDummyPlayerAction, PublishRoundAction, TournamentKillRoundAction,
  RegistrationAcceptAction, EndTournamentAction, UndoTournamentEndAction, SwapPlayerAction, UploadTournamentAction,
  TeamTournamentNewRoundAction, TournamentKillTeamRoundAction, TournamentPairAgainTeamAction, ScenarioSelectedAction,
  SwapTeamAction, TeamGameResultEnteredAction, ScenarioSelectedTeamTournamentAction, EndTeamTournamentAction,
  UndoTeamTournamentEndAction, UploadTeamTournamentAction, PlayerRegistrationChangeAction,
  ArmyListForRegistrationPushAction, ArmyListForTournamentPlayerPushAction,
} from '../../store/actions/tournament-actions';


import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {AuthenticationStoreState} from 'app/store/authentication-state';
import {GameResult} from '../../../../shared/dto/game-result';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {
  TournamentSetAction
} from '../../store/actions/tournaments-actions';
import {SwapGames} from '../../../../shared/dto/swap-player';
import {GlobalEventService} from '../../service/global-event-service';
import {Subscription} from 'rxjs/Subscription';
import {WindowRefService} from '../../service/window-ref-service';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {
  TournamentTeamEraseAction,
  TournamentTeamPushAction, TournamentTeamRegistrationAcceptAction,
  TournamentTeamRegistrationPushAction,
  TournamentTeamRegistrationEraseAction, AddDummyTeamAction, TeamRegistrationChangeAction,
  ArmyListForTeamRegistrationPushAction,
} from '../../store/actions/tournament-teams-actions';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';
import {TournamentTeamEraseModel} from '../../../../shared/dto/tournament-team-erase';
import {ScenarioSelectedModel} from '../../../../shared/dto/scenario-selected-model';
import {RegistrationPush} from '../../../../shared/dto/registration-push';
import {PlayerRegistrationChange} from '../../../../shared/dto/playerRegistration-change';
import {ArmyListRegistrationPush} from '../../../../shared/dto/armyList-registration-push';
import {ArmyListTournamentPlayerPush} from '../../../../shared/dto/armyList-tournamentPlayer-push';
import {TeamRegistrationChange} from '../../../../shared/dto/team-registration-change';
import {ArmyListTeamPush} from '../../../../shared/dto/team-armyList-push';

@Component({
  selector: 'tournament-overview',
  templateUrl: './tournament-overview.component.html',
  styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit, OnDestroy {

  private fullScreenModeSub: Subscription;
  private swapPlayerModeSub: Subscription;

  currentUserId: string;
  actualTournament: Tournament;
  actualTournamentRegisteredPlayers$: Observable<Registration[]>;
  actualTournamentArmyList$: Observable<ArmyList[]>;
  allActualTournamentPlayers$: Observable<TournamentPlayer[]>;
  actualTournamentTeams$: Observable<TournamentTeam[]>;
  actualTournamentTeamRegistrations$: Observable<TournamentTeam[]>;

  actualTournamentRankings$:  Observable<TournamentRanking[]>;
  actualTournamentTeamRankings$:  Observable<TournamentRanking[]>;
  actualTournamentGames$:  Observable<TournamentGame[]>;
  actualTournamentTeamGames$:  Observable<TournamentGame[]>;

  authenticationStoreState$: Observable<AuthenticationStoreState>;

  selectedIndex: number;

  fullscreenMode: boolean;
  swapPlayerMode: boolean;

  smallScreen: boolean;
  onlyHamburgerMenu: boolean;

  isAdmin: boolean;

  constructor(private store: Store<ApplicationState>,
              private activeRouter: ActivatedRoute,
              private messageService: GlobalEventService,
              private winRef: WindowRefService) {

     this.fullScreenModeSub = messageService.subscribe('fullScreenMode', (payload: boolean) => {
      this.fullscreenMode = payload;
    });
    this.swapPlayerModeSub = messageService.subscribe('swapPlayerMode', (payload: boolean) => {
      this.swapPlayerMode = payload;
    });


    this.activeRouter.params.subscribe(
      params => {
        this.store.dispatch(new TournamentSubscribeAction(params['id']));
      }
    );
  }

  ngOnInit() {
    this.actualTournamentArmyList$ = this.store.select(state => state.actualTournamentArmyLists.actualTournamentArmyLists);
    this.actualTournamentRegisteredPlayers$ = this.store.select(
      state => state.actualTournamentRegistrations.actualTournamentRegisteredPlayers);
    this.authenticationStoreState$ = this.store.select(state => state.authenticationStoreState);
    this.allActualTournamentPlayers$ =  this.store.select(
      state => state.actualTournamentPlayers.actualTournamentPlayers);

    this.actualTournamentRankings$ =  this.store.select(
      state => state.actualTournamentRankings.actualTournamentRankings);

    this.actualTournamentTeamRankings$ =  this.store.select(
      state => state.actualTournamentTeamRankings.actualTournamentTeamRankings);

    this.actualTournamentGames$ =  this.store.select(
      state => state.actualTournamentGames.actualTournamentGames);

    this.actualTournamentTeamGames$ =  this.store.select(
      state => state.actualTournamentTeamGames.actualTournamentTeamGames);

    this.actualTournamentTeams$ =  this.store.select(
      state => state.actualTournamentTeams.teams);

    this.actualTournamentTeamRegistrations$ =  this.store.select(
      state => state.actualTournamentTeams.registeredTeams);

    this.store.select(state => state)
      .subscribe(state => {
        this.actualTournament = state.actualTournament.actualTournament;
        if (state.actualTournament.actualTournament) {

          if (state.actualTournament.actualTournament.finished) {
            this.selectedIndex = state.actualTournament.actualTournament.actualRound + 1;
          } else {
            this.selectedIndex = state.actualTournament.actualTournament.actualRound;
          }
        }

        if (state.authenticationStoreState) {
          this.currentUserId =  state.authenticationStoreState.currentUserId;

          this.isAdmin = this.checkIfAdmin();
        }
      });

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.onlyHamburgerMenu = true;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.onlyHamburgerMenu = false;
    } else {
      this.smallScreen = false;
      this.onlyHamburgerMenu = false;
    }

  }

  ngOnDestroy() {
    this.store.dispatch(new TournamentUnsubscribeAction());
    this.fullScreenModeSub.unsubscribe();
    this.swapPlayerModeSub.unsubscribe();
  }

  checkIfAdmin(): boolean {
    if (this.actualTournament && this.currentUserId) {
      return (this.currentUserId === this.actualTournament.creatorUid);
    } else {
      return false;
    }
  }

  getRoundPageTitle(index: number): string {
    if (this.smallScreen) {
      return 'R' + index;
    } else {
      return 'Round' + index;
    }
  }
  getPrepPageTitle(): string {
    if (this.smallScreen) {
      return 'R0';
    } else {
      return 'Setup';
    }
  }

  getArrayForNumber(round: number): number[]  {

    return  round ? _.range(1, (round + 1)) : [];
  };

  getRankingsForRound(round: number): Observable<TournamentRanking[]> {
     return this.actualTournamentRankings$.map(rankings => rankings.filter(rank => {
       return (rank.tournamentRound === round);
     }));
  }

  getTeamRankingsForRound(round: number): Observable<TournamentRanking[]> {
    return this.actualTournamentTeamRankings$.map(rankings => rankings.filter(rank => {
      return (rank.tournamentRound === round);
    }));
  }

  getFinalPlayerRankings(): Observable<TournamentRanking[]> {
    return this.actualTournamentRankings$.map(rankings => rankings.filter(rank => {
      return (rank.tournamentRound === (this.actualTournament.actualRound + 1 ));
    }));
  }

  getFinalTeamRankings(): Observable<TournamentRanking[]> {
    return this.actualTournamentTeamRankings$.map(rankings => rankings.filter(rank => {
      return (rank.tournamentRound === (this.actualTournament.actualRound + 1 ));
    }));
  }

  getGamesForRound(round: number): Observable<TournamentGame[]> {
    return this.actualTournamentGames$.map(games => games.filter(game => {
      return (game.tournamentRound === round);
    }));
  }

  getTeamGamesForRound(round: number): Observable<TournamentGame[]> {
    return this.actualTournamentTeamGames$.map(games => games.filter(game => {
      return (game.tournamentRound === round);
    }));
  }

  handleStartTournament(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TournamentNewRoundAction(config));
  }

  handleStartTeamTournament(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TeamTournamentNewRoundAction(config));
  }

  handleEditTournament(tournament: Tournament ) {
    this.store.dispatch(new TournamentSetAction(tournament));
  }

  handleAddDummyPlayer() {
    this.store.dispatch(new AddDummyPlayerAction(this.actualTournament.id));
  }

  handleAddDummyTeam() {
    this.store.dispatch(new AddDummyTeamAction(this.actualTournament.id));
  }

  handleAddTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.store.dispatch(new TournamentPlayerPushAction(tournamentPlayer));
  }

  handleAddTournamentRegistration(registrationPush: RegistrationPush) {
    console.log('add reg ' + JSON.stringify(registrationPush));
    this.store.dispatch(new RegistrationPushAction(registrationPush));
  }

  handleAddArmyListForRegistration(armyListRegistrationPush: ArmyListRegistrationPush) {
    this.store.dispatch(new ArmyListForRegistrationPushAction(armyListRegistrationPush));
  }

  handleAddArmyListForTournamentPlayer(armyListTournamentPlayerPush: ArmyListTournamentPlayerPush) {
    this.store.dispatch(new ArmyListForTournamentPlayerPushAction(armyListTournamentPlayerPush));
  }


  handleAddArmyListForTeamRegistration(armyListTeamPush: ArmyListTeamPush) {
    this.store.dispatch(new ArmyListForTeamRegistrationPushAction(armyListTeamPush));
  }

  handleAddArmyListForTeamTournamentPlayer(armyListTeamPush: ArmyListTeamPush) {
    console.log('push player army list for team');
  }

  handleDeleteArmyList(armyList: ArmyList) {
    this.store.dispatch(new ArmyListEraseAction(armyList));
  }

  handleAcceptRegistration(acceptedRegistration: Registration) {
    this.store.dispatch(new RegistrationAcceptAction(acceptedRegistration));
  }

  handleDeleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.store.dispatch(new TournamentPlayerEraseAction(tournamentPlayer));
  }

  handleDeleteRegistration(registrationPush: RegistrationPush) {
    this.store.dispatch(new RegistrationEraseAction(registrationPush));
  }

  handleEndTournament(config: TournamentManagementConfiguration) {
    this.store.dispatch(new EndTournamentAction(config));
  }

  handleEndTeamTournament(config: TournamentManagementConfiguration) {
    this.store.dispatch(new EndTeamTournamentAction(config));
  }

  handlePairAgain(config: TournamentManagementConfiguration ) {
    if (this.actualTournament.teamSize === 0) {
      this.store.dispatch(new TournamentPairAgainAction(config));
    } else if (this.actualTournament.teamSize > 0) {
      this.store.dispatch(new TournamentPairAgainTeamAction(config));
    }
  }

  handleNewRound(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TournamentNewRoundAction(config));
  }

  handleNewRoundTeamMatch(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TeamTournamentNewRoundAction(config));
  }

  handleGameResult(gameResult: GameResult) {
     this.store.dispatch(new GameResultEnteredAction(gameResult));
  }

  handleScenarioSelected(scenarioSelected: ScenarioSelectedModel) {
    this.store.dispatch(new ScenarioSelectedAction(scenarioSelected));
  }

  handleScenarioSelectedForTeamTournament(scenarioSelected: ScenarioSelectedModel) {
    this.store.dispatch(new ScenarioSelectedTeamTournamentAction(scenarioSelected));
  }

  handleSwapPlayer(swapPlayer: SwapGames) {
    this.store.dispatch(new SwapPlayerAction(swapPlayer));
  }

  handleSwapTeam(swapTeam: SwapGames) {
    this.store.dispatch(new SwapTeamAction(swapTeam));
  }

  handleTeamGameResult(gameResult: GameResult) {
    this.store.dispatch(new TeamGameResultEnteredAction(gameResult));
  }

  handlePublishRound(round: PublishRound) {
    this.store.dispatch(new PublishRoundAction(round));
  }

  handleKillRound(config: TournamentManagementConfiguration) {
    if (this.actualTournament.teamSize === 0) {
      this.store.dispatch(new TournamentKillRoundAction(config));
    } else if (this.actualTournament.teamSize > 0) {
      this.store.dispatch(new TournamentKillTeamRoundAction(config));
    }

  }

  handleUndoTournamentEnd(config: TournamentManagementConfiguration) {
    this.store.dispatch(new UndoTournamentEndAction(config));
  }

  handleUndoTeamTournamentEnd(config: TournamentManagementConfiguration) {
    this.store.dispatch(new UndoTeamTournamentEndAction(config));
  }

  handleUploadTournament() {
    this.store.dispatch(new UploadTournamentAction(this.actualTournament.id));
  }

  handleUploadTeamTournament() {
    this.store.dispatch(new UploadTeamTournamentAction(this.actualTournament.id));
  }

  handleRegisterTeamForTeamTournament(team: TournamentTeam) {
    this.store.dispatch(new TournamentTeamRegistrationPushAction(team));
  }

  handleAcceptTeamRegistration(teamRegPush: TeamRegistrationPush) {
    this.store.dispatch(new TournamentTeamRegistrationAcceptAction(teamRegPush));
  }

  handleEraseTeamRegistration(teamRegPush: TeamRegistrationPush) {
    this.store.dispatch(new TournamentTeamRegistrationEraseAction(teamRegPush));
  }

  handlePlayerRegChange(regChange: PlayerRegistrationChange) {
    this.store.dispatch(new PlayerRegistrationChangeAction(regChange));
  }

  handleTeamChange(teamChange: TeamRegistrationChange) {
    this.store.dispatch(new TeamRegistrationChangeAction(teamChange));
  }

  handleCreateTeamForTeamTournament(team: TournamentTeam) {
    this.store.dispatch(new TournamentTeamPushAction(team));
  }

  handleEraseTeam(eraseModel: TournamentTeamEraseModel) {
    this.store.dispatch(new TournamentTeamEraseAction(eraseModel));
  }
}
