import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';


import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {Player} from '../../../../../shared/model/player';
import {MdDialog, MdSnackBar} from '@angular/material';
import {GlobalEventService} from 'app/service/global-event-service';
import {TournamentService} from '../../actual-tournament.service';
import {ActualTournamentRegistrationService} from '../../actual-tournament-registration.service';
import {ActualTournamentPlayerService} from '../../actual-tournament-player.service';
import {ActualTournamentArmyListService} from '../../actual-tournament-army-list.service';
import {ActualTournamentRankingService} from 'app/tournament/actual-tournament-ranking.service';
import {ActualTournamentGamesService} from '../../actual-tournament-games.service';
import {AppState} from '../../../store/reducers/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {KillRoundDialogComponent} from '../../../dialogs/round-overview/kill-round-dialog';
import {TournamentManagementConfiguration} from '../../../../../shared/dto/tournament-management-configuration';
import {PairingService} from '../../pairing.service';
import {clearTournamentGame, TournamentGame} from '../../../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../../shared/model/armyList';
import {PairAgainDialogComponent} from '../../../dialogs/round-overview/pair-again-dialog';
import {GameResult} from '../../../../../shared/dto/game-result';
import {GameResultService} from '../../game-result.service';


@Component({
  selector: 'tournament-ranking-overview',
  templateUrl: './tournament-ranking-overview.component.html',
  styleUrls: ['./tournament-ranking-overview.component.scss']
})
export class TournamentRankingsOverviewComponent implements OnInit, OnDestroy {

  round: number;

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allTournamentPlayers$: Observable<TournamentPlayer[]>;
  allActualTournamentPlayers: TournamentPlayer[];

  allTournamentGames$: Observable<TournamentGame[]>;
  allTournamentGames: TournamentGame[];
  gamesForRound$: Observable<TournamentGame[]>;
  finishedGamesForRound$: Observable<TournamentGame[]>;
  unfinishedGamesForRound$: Observable<TournamentGame[]>;
  loadGames$: Observable<boolean>;

  allTournamentRankings$: Observable<TournamentRanking[]>;
  allTournamentRankings: TournamentRanking[];
  rankingsForRound$: Observable<TournamentRanking[]>;

  allArmyLists$: Observable<ArmyList[]>;

  allGamesFinished: boolean;
  allGamesUntouched: boolean;

  gamesFullscreenMode: boolean;
  rankingsFullscreenMode: boolean;
  swapPlayerMode: boolean;

  gamesTableMode: boolean;
  smallScreen: boolean;

  showOnlyMyGameState: boolean;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualTournamentGamesSub: Subscription;
  private allActualTournamentRankingsSub: Subscription;

  constructor(private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private armyListService: ActualTournamentArmyListService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private rankingService: ActualTournamentRankingService,
              private gamesService: ActualTournamentGamesService,
              private pairingService: PairingService,
              private gameResultService: GameResultService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              private router: Router) {

    this.round = +this.activeRouter.snapshot.paramMap.get('round');

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
        this.armyListService.subscribeOnFirebase(params['id']);
        this.rankingService.subscribeOnFirebase(params['id']);
        this.gamesService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournament.actualTournamentPlayers);
    this.allTournamentGames$ = this.store.select(state => state.actualTournament.actualTournamentGames);
    this.allTournamentRankings$ = this.store.select(state => state.actualTournament.actualTournamentRankings);
    this.allArmyLists$ = this.store.select(state => state.actualTournament.actualTournamentArmyLists);

    this.gamesForRound$ = this.allTournamentGames$.map(
      games => games.filter(t => t.tournamentRound === this.round));

    this.finishedGamesForRound$ = this.allTournamentGames$.map(
      games => games.filter(t => t.tournamentRound === this.round && t.finished));

    this.unfinishedGamesForRound$ = this.allTournamentGames$.map(
      games => games.filter(t => t.tournamentRound === this.round && !t.finished));

    this.rankingsForRound$ = this.allTournamentRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === this.round));

    this.loadGames$ = this.store.select(state => state.actualTournament.loadGames);

  }

  ngOnInit() {

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
    });
    this.userPlayerDataSub = this.userPlayerData$.subscribe((player: Player) => {
      this.userPlayerData = player;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
    });

    this.allActualTournamentPlayersSub = this.allTournamentPlayers$.subscribe((allTournamentPlayers: TournamentPlayer[]) => {
      this.allActualTournamentPlayers = allTournamentPlayers;
    });

    this.allActualTournamentGamesSub = this.allTournamentGames$.subscribe((allTournamentGames: TournamentGame[]) => {
      this.allTournamentGames = allTournamentGames;
    });

    this.allActualTournamentRankingsSub = this.allTournamentRankings$.subscribe((rankings: TournamentRanking[]) => {
      this.allTournamentRankings = rankings;
    });

  }

  ngOnDestroy() {

    this.tournamentService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();
    this.rankingService.unsubscribeOnFirebase();
    this.gamesService.unsubscribeOnFirebase();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualTournamentGamesSub.unsubscribe();
    this.allActualTournamentRankingsSub.unsubscribe();
  }

  getArrayForNumber(round: number): number[] {

    return round ? _.range(1, (round + 1)) : [];
  };

  setIsAdmin(): void {
    if (this.actualTournament && this.userPlayerData) {
      this.isAdmin = this.userPlayerData.userUid === this.actualTournament.creatorUid;
    } else {
      this.isAdmin = false;
    }
  }

  setIsCoAdmin(): void {

    const that = this;

    if (this.actualTournament && this.userPlayerData) {

      this.isCoOrganizer = false;
      _.findIndex(this.actualTournament.coOrganizators, function (coOrganizerEmail: string) {

        if (that.userPlayerData.userEmail === coOrganizerEmail) {
          that.isCoOrganizer = true;
        }
      });
    }
  }

  setIsTournamentPlayer(): void {
    const that = this;

    if (this.allActualTournamentPlayers && this.userPlayerData) {

      this.isTournamentPlayer = false;

      _.find(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
        if (that.userPlayerData && that.userPlayerData.id === player.playerId) {
          that.isTournamentPlayer = true;
        }
      });
    }
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
          this.pairingService.killRound(config);

          this.snackBar.open('Round ' + config.round + ' successfully killed with fire!', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });

          if (this.round === 1) {
            this.router.navigate(['/tournament', this.actualTournament.id, 'players']);
          } else {
            this.router.navigate(['/tournament', this.actualTournament.id, 'round', (this.round - 1)]);
          }

        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  showGamesOfRound() {

    this.router.navigate(['/tournament', this.actualTournament.id, 'round', (this.round )]);

  }

  publishRound() {
    this.pairingService.publishRound({tournamentId: this.actualTournament.id, roundToPublish: this.round});
    this.snackBar.open('Round ' + this.round + ' successfully published', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
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
          config.tournamentId = this.actualTournament.id;
          config.round = this.round;
          this.pairingService.pairRoundAgain(config, this.allActualTournamentPlayers, this.allTournamentRankings);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }


  handleClearPlayerGameResult(game: TournamentGame) {

    const clearedGame = clearTournamentGame(game);

    this.gamesService.updatePlayerMatch(game);

    this.rankingService.updateRankingAfterGameResultEntered({
      gameResult: {
        gameBefore: game,
        gameAfter: clearedGame
      },
      actualTournament: this.actualTournament,
      allRankings: this.allTournamentRankings,
      allGames: this.allTournamentGames,
      reset: true
    });

    this.snackBar.open('Game cleared successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleGameResultEntered(gameResult: GameResult) {

    this.gameResultService.gameResultEntered(
      gameResult,
      this.actualTournament,
      this.allTournamentRankings,
      this.allTournamentGames);

    this.snackBar.open('GameResult entered successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}



