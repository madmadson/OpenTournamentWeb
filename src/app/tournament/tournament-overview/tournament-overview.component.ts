import {Component, OnDestroy, OnInit} from '@angular/core';
import {Tournament} from '../../../../shared/model/tournament';
import {Registration} from '../../../../shared/model/registration';
import {ArmyList} from '../../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Store} from '@ngrx/store';

import {ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';

import {
  ArmyListEraseAction,
  ArmyListForRegistrationPushAction,
  ArmyListForTournamentPlayerPushAction,
  DropPlayerPushAction,
  DropTeamPushAction,
  EndTeamTournamentAction,
  EndTournamentAction,
  GameResultEnteredAction,
  PlayerRegistrationChangeAction,
  PublishRoundAction,
  RegistrationAcceptAction,
  RegistrationEraseAction,
  ScenarioSelectedAction,
  ScenarioSelectedTeamTournamentAction,
  SwapPlayerAction,
  SwapTeamAction,
  TeamGameResultEnteredAction,
  TeamTournamentNewRoundAction,
  TournamentKillRoundAction,
  TournamentKillTeamRoundAction,
  TournamentNewRoundAction,
  TournamentPairAgainAction,
  TournamentPairAgainTeamAction,
  TournamentPlayerEraseAction,
  TournamentPlayerPushAction,
  UndoDropPlayerPushAction,
  UndoDropTeamPushAction,
  UndoTeamTournamentEndAction,
  UndoTournamentEndAction,
  UploadTeamTournamentAction,
  UploadTournamentAction,
} from '../store/tournament-actions';


import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {GameResult} from '../../../../shared/dto/game-result';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {
  CoOrganizatorAddAction,
  CoOrganizatorDeleteAction,
  TournamentSetAction
} from '../../store/actions/tournaments-actions';
import {SwapGames} from '../../../../shared/dto/swap-player';
import {GlobalEventService} from '../../service/global-event-service';
import {Subscription} from 'rxjs/Subscription';
import {WindowRefService} from '../../service/window-ref-service';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {
  ArmyListForTeamRegistrationPushAction,
  TeamRegistrationChangeAction,
  TournamentTeamEraseAction,
  TournamentTeamPushAction,
  TournamentTeamRegistrationAcceptAction,
  TournamentTeamRegistrationEraseAction,
  TournamentTeamRegistrationPushAction,
  UpdateTeamAction,
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
import {DropPlayerPush} from '../../../../shared/dto/drop-player-push';
import {ClearTeamGameResultAction} from '../../store/actions/tournament-team-games-actions';
import {ClearPlayerGameResultAction} from 'app/store/actions/tournament-games-actions';
import {Player} from '../../../../shared/model/player';
import {CoOrganizatorPush} from '../../../../shared/dto/co-organizator-push';
import {TeamUpdate} from '../../../../shared/dto/team-update';
import {AppState} from '../../store/reducers/index';
import {TournamentService} from '../actual-tournament.service';

@Component({
  selector: 'tournament-overview',
  templateUrl: './tournament-overview.component.html',
  styleUrls: ['./tournament-overview.component.scss']
})
export class TournamentOverviewComponent implements OnInit, OnDestroy {

  private fullScreenModeSub: Subscription;
  private swapPlayerModeSub: Subscription;


  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allActualTournamentPlayers: TournamentPlayer[];

  actualTournamentRegisteredPlayers$: Observable<Registration[]>;
  actualTournamentArmyList$: Observable<ArmyList[]>;
  allActualTournamentPlayers$: Observable<TournamentPlayer[]>;
  actualTournamentTeams$: Observable<TournamentTeam[]>;
  actualTournamentTeamRegistrations$: Observable<TournamentTeam[]>;

  actualTournamentRankings$: Observable<TournamentRanking[]>;
  actualTournamentTeamRankings$: Observable<TournamentRanking[]>;
  actualTournamentGames$: Observable<TournamentGame[]>;
  actualTournamentTeamGames$: Observable<TournamentGame[]>;


  fullscreenMode: boolean;
  swapPlayerMode: boolean;

  smallScreen: boolean;
  onlyHamburgerMenu: boolean;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;


  constructor(private tournamentService: TournamentService,

              private store: Store<AppState>,
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
        this.tournamentService.subscribeOnFirebase(params['id']);
        // this.registrationService.subscribeOnFirebase(params['id']);
      }
    );

    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);


      // this.store.select(state => state)
      // .subscribe(state => {
      //   this.actualTournament = state.actualTournament.actualTournament;
      //   if (state.actualTournament.actualTournament) {
      //
      //     if (state.actualTournament.actualTournament.finished) {
      //       this.selectedIndex = state.actualTournament.actualTournament.actualRound + 1;
      //     } else {
      //       this.selectedIndex = state.actualTournament.actualTournament.actualRound;
      //     }
      //   }
      //
      //   if (state.authentication) {
      //     this.currentUserId = state.authentication.currentUserId;
      //     this.userPlayerData = state.authentication.userPlayerData;
      //
      //     this.isAdmin = this.checkIfAdmin();
      //
      //     this.isCoOrganizer = this.checkIfCoOrganizer();
      //   }
      // });
  }

  ngOnInit() {

    this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
    });
    this.userPlayerData$.subscribe((player: Player) => {
      this.userPlayerData = player;
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
    });



    // this.actualTournamentArmyList$ = this.store.select(state => state.actualTournament.actualTournamentArmyLists);
    // this.actualTournamentRegisteredPlayers$ = this.store.select(
    //   state => state.actualTournament.actualTournamentRegisteredPlayers);
    // this.store.select(state => state.authentication);
    // this.allActualTournamentPlayers$ = this.store.select(
    //   state => state.actualTournament.actualTournamentPlayers);
    //
    // this.allActualTournamentPlayers$.subscribe(players => {
    //     this.allActualTournamentPlayers = players;
    // });
    //
    // this.rankings$ = this.store.select(
    //   state => state.actualTournament.rankings);
    //
    // this.actualTournamentTeamRankings$ = this.store.select(
    //   state => state.actualTournament.actualTournamentTeamRankings);
    //
    // this.games$ = this.store.select(
    //   state => state.actualTournament.games);
    //
    // this.actualTournamentTeamGames$ = this.store.select(
    //   state => state.actualTournament.actualTournamentTeamGames);
    //
    // this.actualTournamentTeams$ = this.store.select(
    //   state => state.actualTournament.actualTournamentTeams);
    //
    // this.actualTournamentTeamRegistrations$ = this.store.select(
    //   state => state.actualTournament.actualTournamentRegisteredTeams);



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
    this.tournamentService.unsubscribeOnFirebase();
   // this.registrationService.unsubscribeOnFirebase();
    this.fullScreenModeSub.unsubscribe();
    this.swapPlayerModeSub.unsubscribe();
  }

  setIsAdmin(): void {
    if (this.actualTournament && this.userPlayerData) {
      this.isAdmin  = this.userPlayerData.userUid === this.actualTournament.creatorUid;
    } else {
      this.isAdmin = false;
    }
  }

  setIsCoAdmin(): boolean {

    const that = this;

    if (this.actualTournament && this.userPlayerData) {
      const isCoOrganizer =  _.findIndex(this.actualTournament.coOrganizators, function (coOrganizerEmail: string) {

        return that.userPlayerData.userEmail === coOrganizerEmail;
        }
      );
      return isCoOrganizer !== -1;
    } else {
      return false;
    }
  }

  setIsTournamentPlayer(): boolean {
    const that = this;

    const foundPlayer = _.find(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      if (that.userPlayerData) {
        return that.userPlayerData.id === player.playerId;
      }
    });

    if (foundPlayer) {
      this.isTournamentPlayer = true;
      return true;
    }
    return false;
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

  getArrayForNumber(round: number): number[] {

    return round ? _.range(1, (round + 1)) : [];
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

  handleStartTournament(config: TournamentManagementConfiguration) {
    this.store.dispatch(new TournamentNewRoundAction(config));
  }

  handleStartTeamTournament(config: TournamentManagementConfiguration) {
    this.store.dispatch(new TeamTournamentNewRoundAction(config));
  }

  handleEditTournament(tournament: Tournament) {
    this.store.dispatch(new TournamentSetAction(tournament));
  }

  handleAddCoOrganizator(coOrganizer: CoOrganizatorPush) {
    this.store.dispatch(new CoOrganizatorAddAction(coOrganizer));
  }

  handleDeleteCoOrganizator(coOrganizer: CoOrganizatorPush) {
    this.store.dispatch(new CoOrganizatorDeleteAction(coOrganizer));
  }

  handleUpdateTeam(team: TeamUpdate) {
    this.store.dispatch(new UpdateTeamAction(team));
  }

  handleClearPlayerGameResult(game: TournamentGame) {
    this.store.dispatch(new ClearPlayerGameResultAction(game));
  }

  handleClearTeamGameResult(game: TournamentGame) {
    this.store.dispatch(new ClearTeamGameResultAction(game));
  }

  handleAddTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.store.dispatch(new TournamentPlayerPushAction(tournamentPlayer));
  }

  handleAddTournamentRegistration(registrationPush: RegistrationPush) {
    console.log('add reg ' + JSON.stringify(registrationPush));
   //  this.store.dispatch(new RegistrationPushAction(registrationPush));
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

  handlePairAgain(config: TournamentManagementConfiguration) {
    if (this.actualTournament.teamSize === 0) {
      this.store.dispatch(new TournamentPairAgainAction(config));
    } else if (this.actualTournament.teamSize > 0) {
      this.store.dispatch(new TournamentPairAgainTeamAction(config));
    }
  }

  handleNewRound(config: TournamentManagementConfiguration) {
    this.store.dispatch(new TournamentNewRoundAction(config));
  }

  handleNewRoundTeamMatch(config: TournamentManagementConfiguration) {
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

  handleDropPlayer(dropPlayerPush: DropPlayerPush) {
    this.store.dispatch(new DropPlayerPushAction(dropPlayerPush));
  }

  handleUndoDropPlayer(ranking: TournamentRanking) {
    this.store.dispatch(new UndoDropPlayerPushAction(ranking));
  }

  handleDropTeam(dropPlayerPush: DropPlayerPush) {
    this.store.dispatch(new DropTeamPushAction(dropPlayerPush));
  }

  handleUndoDropTeam(ranking: TournamentRanking) {
    this.store.dispatch(new UndoDropTeamPushAction(ranking));
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
