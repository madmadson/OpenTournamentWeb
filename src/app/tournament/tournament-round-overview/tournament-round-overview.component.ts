import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../shared/model/armyList';
import {Player} from '../../../../shared/model/player';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Tournament} from '../../../../shared/model/tournament';

import {MdDialog, MdSnackBar} from '@angular/material';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';

import * as _ from 'lodash';
import {GameResult} from '../../../../shared/dto/game-result';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {SwapGames} from '../../../../shared/dto/swap-player';
import {GlobalEventService} from 'app/service/global-event-service';
import {WindowRefService} from '../../service/window-ref-service';
import {Subscription} from 'rxjs/Subscription';
import {KillRoundDialogComponent} from '../../dialogs/round-overview/kill-round-dialog';
import {PairAgainDialogComponent} from '../../dialogs/round-overview/pair-again-dialog';
import {ScenarioSelectedModel} from '../../../../shared/dto/scenario-selected-model';
import {PrintRankingsDialogComponent} from '../../dialogs/print-rankings-dialog';
import {PrintGamesDialogComponent} from '../../dialogs/print-games-dialog';
import {NewRoundDialogComponent} from '../../dialogs/round-overview/new-round-dialog';
import {FinishTournamentDialogComponent} from '../../dialogs/finish-tournament-dialog';
import {DropPlayerPush} from '../../../../shared/dto/drop-player-push';


@Component({
  selector: 'tournament-round-overview',
  templateUrl: './tournament-round-overview.component.html',
  styleUrls: ['./tournament-round-overview.component.scss']
})
export class TournamentRoundOverviewComponent implements OnInit, OnDestroy {

  private swapPlayerModeSub: Subscription;

  @Input() round: number;
  @Input() actualTournament: Tournament;
  @Input() isAdmin: boolean;

  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyLists$: Observable<ArmyList[]>;
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() gamesForRound$: Observable<TournamentGame[]>;

  @Output() onPairAgain = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onNewRound = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onKillRound = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onScenarioSelected = new EventEmitter<ScenarioSelectedModel>();
  @Output() onPublishRound = new EventEmitter<PublishRound>();
  @Output() onEndTournament = new EventEmitter<TournamentManagementConfiguration>();

  @Output() onDropPlayer = new EventEmitter<DropPlayerPush>();
  @Output() onUndoDropPlayer = new EventEmitter<TournamentRanking>();

  @Output() onClearPlayerGameResult = new EventEmitter<TournamentGame>();

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

    this.gamesForRound$.subscribe((games: TournamentGame[]) => {

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

  printRankings() {
    this.dialog.open(PrintRankingsDialogComponent, {
      data: {
        tournament: this.actualTournament,
        rankings$: this.rankingsForRound$,
        round: this.round,
        teamMatch: false
      }
    });
  }

  printGames() {
    this.dialog.open(PrintGamesDialogComponent, {
      data: {
        tournament: this.actualTournament,
        games$: this.gamesForRound$,
        round: this.round,
        teamMatch: false
      }
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

  handleGameResult(gameResult: GameResult) {

    this.onGameResult.emit(gameResult);

  }

  handleClearPlayerGameResult(game: TournamentGame) {
    this.onClearPlayerGameResult.emit(game);
  }

  handleScenarioSelected(scenarioSelectedModel: ScenarioSelectedModel) {

    this.onScenarioSelected.emit(scenarioSelectedModel);

  }

  handleSwapPlayer(swapPlayer: SwapGames) {

    this.onSwapPlayer.emit(swapPlayer);
  }

  handleDropPlayer(dropPlayerPush: DropPlayerPush) {
    this.onDropPlayer.emit(dropPlayerPush);
  }

  handleUndoDropPlayer(ranking: TournamentRanking) {
    this.onUndoDropPlayer.emit(ranking);
  }

  publishRound() {
    this.onPublishRound.emit({tournamentId: this.actualTournament.id, roundToPublish: this.round});
  }

  search(searchString: string) {

    console.log('searchString: ' + searchString);

    if (searchString === '') {
      this.allGamesFiltered = this.allGames;
    }

    this.allGamesFiltered = _.filter(this.allGames, function (game) {
      return game.playerOnePlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        game.playerTwoPlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        game.playingField.toString() === searchString;
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
          this.onKillRound.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openPairAgainDialog() {
    const dialogRef = this.dialog.open(PairAgainDialogComponent, {
      data: {
        round: this.round,
        teamMatch: false
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onPairAgain
      .subscribe((config: TournamentManagementConfiguration) => {

        if (config !== undefined) {
          console.log('pair again');
          config.tournamentId = this.actualTournament.id;
          config.round = this.round;
          this.onPairAgain.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openNewRoundDialog() {
    const dialogRef = this.dialog.open(NewRoundDialogComponent, {
      data: {
        round: this.round,
        allPlayers$: this.rankingsForRound$,
        teamMatch: false
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onNewRound
      .subscribe((config: TournamentManagementConfiguration) => {
        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          this.onNewRound.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openFinishTournamentDialog() {
    const dialogRef = this.dialog.open(FinishTournamentDialogComponent, {
      data: {
        round: this.round,
        allPlayers$: this.rankingsForRound$
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onEndTournament
      .subscribe(() => {
        this.onEndTournament.emit({
          tournamentId: this.actualTournament.id,
          round: (this.round + 1),
          teamRestriction: false,
          metaRestriction: false,
          originRestriction: false,
          countryRestriction: false,
        });
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }
}



