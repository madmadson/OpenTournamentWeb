import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Tournament} from '../../../../shared/model/tournament';
import {Observable} from 'rxjs/Observable';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {ArmyList} from '../../../../shared/model/armyList';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {SwapGames} from '../../../../shared/dto/swap-player';
import {Player} from '../../../../shared/model/player';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {GameResult} from '../../../../shared/dto/game-result';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {MdDialog, MdSnackBar} from '@angular/material';
import {GlobalEventService} from '../../service/global-event-service';
import {WindowRefService} from '../../service/window-ref-service';

import * as _ from 'lodash';
import {KillRoundDialogComponent} from '../../dialogs/round-overview/kill-round-dialog';
import {PairAgainDialogComponent} from '../../dialogs/round-overview/pair-again-dialog';
import {PrintRankingsDialogComponent} from '../../dialogs/print-rankings-dialog';
import {PrintGamesDialogComponent} from '../../dialogs/print-games-dialog';
import {ScenarioSelectedModel} from '../../../../shared/dto/scenario-selected-model';
import {NewRoundDialogComponent} from "../../dialogs/round-overview/new-round--dialog";

@Component({
  selector: 'tournament-team-round-overview',
  templateUrl: './tournament-team-round-overview.component.html',
  styleUrls: ['./tournament-team-round-overview.component.scss']
})
export class TournamentTeamRoundOverviewComponent implements OnInit, OnDestroy {

  private swapPlayerModeSub: Subscription;

  @Input() round: number;
  @Input() actualTournament: Tournament;

  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyLists$: Observable<ArmyList[]>;

  @Input() playerRankingsForRound$: Observable<TournamentRanking[]>;
  @Input() teamRankingsForRound$: Observable<TournamentRanking[]>;

  @Input() playerGamesForRound$: Observable<TournamentGame[]>;
  @Input() teamGamesForRound$: Observable<TournamentGame[]>;

  @Output() onPairTeamMatchAgain = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onNewRoundTeamMatch = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onKillTeamMatchRound = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onTeamGameResult = new EventEmitter<GameResult>();
  @Output() onScenarioSelectedForTeamTournament = new EventEmitter<ScenarioSelectedModel>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onSwapTeam = new EventEmitter<SwapGames>();
  @Output() onPublishRound = new EventEmitter<PublishRound>();
  @Output() onEndTournament = new EventEmitter<TournamentManagementConfiguration>();

  userPlayerData: Player;
  currentUserId: string;

  allGamesFinished: boolean;
  allGamesUntouched: boolean;

  armyLists$: Observable<ArmyList[]>;

  allGames: TournamentGame[];
  allGamesFiltered: TournamentGame[];

  gamesFullscreenMode: boolean;
  rankingsFullscreenMode: boolean;
  swapPlayerMode: boolean;

  gamesTableMode: boolean;
  smallScreen: boolean;

  constructor(public dialog: MdDialog,
              private messageService: GlobalEventService,
              private snackBar: MdSnackBar,
              private winRef: WindowRefService) {

    this.smallScreen = this.winRef.nativeWindow.screen.width < 800;

    this.swapPlayerModeSub = messageService.subscribe('swapPlayerMode', (payload: boolean) => {
      this.swapPlayerMode = payload;
    });
  }

  ngOnInit() {

    this.armyLists$ = this.actualTournamentArmyLists$;

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;
    });

    this.teamGamesForRound$.subscribe((games: TournamentGame[]) => {

      this.allGames = games;
      this.allGamesFiltered = games;

      const unfinishedGames = _.find(games, function (game: TournamentGame) {
        return !game.finished;
      });
      this.allGamesFinished = !unfinishedGames;

      const startedGames = _.find(games, function (game: TournamentGame) {
        return game.finished;
      });
      this.allGamesUntouched = !startedGames;
    });

  }

  ngOnDestroy() {
    this.swapPlayerModeSub.unsubscribe();
  }

  changeToTableMode(mode: boolean) {

    this.gamesTableMode = mode;

    this.snackBar.open('Note: TableMode is only for presentation.', '', {
      duration: 5000
    });
  }

  openGamesFullScreenMode(mode: boolean) {
    this.gamesFullscreenMode = mode;

    this.messageService.broadcast('fullScreenMode', mode);
  }

  openRankingsFullScreenMode(mode: boolean) {
    this.rankingsFullscreenMode = mode;

    this.messageService.broadcast('fullScreenMode', mode);
  }

  handleTeamGameResult(gameResult: GameResult) {

    this.onTeamGameResult.emit(gameResult);

  }

  handleScenarioSelectedForTeamTournament(scenarioSelect: ScenarioSelectedModel) {

    this.onScenarioSelectedForTeamTournament.emit(scenarioSelect);

  }

  handleSwapPlayer(swapPlayer: SwapGames) {

    this.onSwapPlayer.emit(swapPlayer);
  }

  handleSwapTeam(swapTeam: SwapGames) {

    this.onSwapTeam.emit(swapTeam);
  }

  publishRound() {
    this.onPublishRound.emit({tournamentId: this.actualTournament.id, roundToPublish: this.round});
  }

  search(searchString: string) {

    if (searchString === '') {
      this.allGamesFiltered = this.allGames;
    }

    this.allGamesFiltered = _.filter(this.allGames, function (game) {
      return game.playerOnePlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        game.playerTwoPlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        game.playingField.toString() === searchString;
    });

  }

  openNewTeamRoundDialog() {
    const dialogRef = this.dialog.open(NewRoundDialogComponent, {
      data: {
        round: this.round,
        allPlayers$: this.teamRankingsForRound$,
        teamMatch: true
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onNewRound
      .subscribe((config: TournamentManagementConfiguration) => {
        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          this.onNewRoundTeamMatch.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openKillRoundDialog() {
    const dialogRef = this.dialog.open(KillRoundDialogComponent, {
      data: {
        round: this.round
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onKillRound
      .subscribe((config: TournamentManagementConfiguration) => {

        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          config.round = this.round;
          this.onKillTeamMatchRound.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openPairAgainDialog() {
    const dialogRef = this.dialog.open(PairAgainDialogComponent, {
      data: {
        round: this.round
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onPairAgain
      .subscribe((config: TournamentManagementConfiguration) => {

        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          config.round = this.round;
          this.onPairTeamMatchAgain.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  printRankings() {
    this.dialog.open(PrintRankingsDialogComponent, {
      data: {
        tournament: this.actualTournament,
        rankings$: this.teamRankingsForRound$,
        round: this.round
      }
    });
  }

  printGames() {
    this.dialog.open(PrintGamesDialogComponent, {
      data: {
        tournament: this.actualTournament,
        games$: this.teamGamesForRound$,
        round: this.round
      }
    });
  }
}

