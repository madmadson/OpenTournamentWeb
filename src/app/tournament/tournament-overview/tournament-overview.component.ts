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
  ArmyListEraseAction, RegistrationPushAction, ArmyListPushAction, TournamentPairAgainAction, GameResultEnteredAction,
  TournamentNewRoundAction, AddDummyPlayerAction, PublishRoundAction, TournamentKillRoundAction,
  RegistrationAcceptAction, EndTournamentAction, UndoTournamentEndAction, SwapPlayerAction, UploadTournamentAction
} from '../../store/actions/tournament-actions';


import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {AuthenticationStoreState} from 'app/store/authentication-state';
import {GameResult} from '../../../../shared/dto/game-result';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {
  TournamentSetAction
} from '../../store/actions/tournaments-actions';
import {SwapPlayer} from '../../../../shared/dto/swap-player';
import {GlobalEventService} from '../../service/global-event-service';
import {Subscription} from 'rxjs/Subscription';
import {WindowRefService} from '../../service/window-ref-service';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {
  TournamentTeamEraseAction,
  TournamentTeamPushAction, TournamentTeamRegistrationAcceptAction,
  TournamentTeamRegistrationPushAction
} from '../../store/actions/tournament-teams-actions';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';
import {TournamentTeamEraseModel} from '../../../../shared/dto/tournament-team-erase';

@Component({
  selector: 'tournament-overview',
  templateUrl: './tournament-overview.component.html',
  styleUrls: ['./tournament-overview.component.css']
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
  actualTournamentGames$:  Observable<TournamentGame[]>;

  authenticationStoreState$: Observable<AuthenticationStoreState>;

  selectedIndex: number;

  fullscreenMode: boolean;
  swapPlayerMode: boolean;

  smallScreen: boolean;

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

    this.actualTournamentGames$ =  this.store.select(
      state => state.actualTournamentGames.actualTournamentGames);

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
        }
      });

    this.smallScreen = this.winRef.nativeWindow.screen.width < 800;
  }

  ngOnDestroy() {
    this.store.dispatch(new TournamentUnsubscribeAction());
    this.fullScreenModeSub.unsubscribe();
    this.swapPlayerModeSub.unsubscribe();
  }

  getRoundPageTitle(index: number): string {
    if (this.smallScreen) {
      return 'R ' + index;
    } else {
      return 'Round ' + index;
    }
  }
  getPrepPageTitle(): string {
    if (this.smallScreen) {
      return 'R 0';
    } else {
      return 'Tournament Preparation';
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
  getFinalRanking(): Observable<TournamentRanking[]> {
    return this.actualTournamentRankings$.map(rankings => rankings.filter(rank => {
      return (rank.tournamentRound === (this.actualTournament.actualRound + 1 ));
    }));
  }

  getGamesForRound(round: number): Observable<TournamentGame[]> {
    return this.actualTournamentGames$.map(games => games.filter(game => {
      return (game.tournamentRound === round);
    }));
  }

  handleStartTournament(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TournamentNewRoundAction(config));
  }

  handleEditTournament(tournament: Tournament ) {
    this.store.dispatch(new TournamentSetAction(tournament));
  }

  handleAddDummyPlayer() {
    this.store.dispatch(new AddDummyPlayerAction(this.actualTournament.id));
  }

  handleAddTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.store.dispatch(new TournamentPlayerPushAction(tournamentPlayer));
  }

  handleAddTournamentRegistration(registration: Registration) {
    this.store.dispatch(new RegistrationPushAction(
      {tournament: this.actualTournament, registration: registration}));
  }

  handleAddArmyList(armyList: ArmyList) {
    this.store.dispatch(new ArmyListPushAction(armyList));
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

  handleDeleteRegistration(registration: Registration) {
    this.store.dispatch(new RegistrationEraseAction(
      {tournament: this.actualTournament, registration: registration}));
  }
  handleEndTournament(config: TournamentManagementConfiguration) {
    this.store.dispatch(new EndTournamentAction(config));
  }

  handlePairAgain(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TournamentPairAgainAction(config));
  }

  handleNewRound(config: TournamentManagementConfiguration ) {
    this.store.dispatch(new TournamentNewRoundAction(config));
  }

  handleGameResult(gameResult: GameResult) {
     this.store.dispatch(new GameResultEnteredAction(gameResult));
  }

  handleSwapPlayer(swapPlayer: SwapPlayer) {
    this.store.dispatch(new SwapPlayerAction(swapPlayer));
  }

  handlePublishRound(round: PublishRound) {
    this.store.dispatch(new PublishRoundAction(round));
  }
  handleKillRound(config: TournamentManagementConfiguration) {
    this.store.dispatch(new TournamentKillRoundAction(config));
  }

  handleUndoTournamentEnd(config: TournamentManagementConfiguration) {
    this.store.dispatch(new UndoTournamentEndAction(config));
  }

  handleUploadTournament() {
    this.store.dispatch(new UploadTournamentAction(this.actualTournament.id));
  }

  handleRegisterTeamForTeamTournament(team: TournamentTeam) {
    this.store.dispatch(new TournamentTeamRegistrationPushAction(team));
  }

  handleAcceptTeamRegistration(teamRegPush: TeamRegistrationPush) {
    this.store.dispatch(new TournamentTeamRegistrationAcceptAction(teamRegPush));
  }

  handleCreateTeamForTeamTournament(team: TournamentTeam) {
    this.store.dispatch(new TournamentTeamPushAction(team));
  }

  handleEraseTeam(eraseModel: TournamentTeamEraseModel) {
    this.store.dispatch(new TournamentTeamEraseAction(eraseModel));
  }
}
