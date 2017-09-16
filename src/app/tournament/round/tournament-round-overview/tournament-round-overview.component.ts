import {Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';


import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {Player} from '../../../../../shared/model/player';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TournamentService} from '../../actual-tournament.service';
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
import {NewRoundDialogComponent} from '../../../dialogs/round-overview/new-round-dialog';
import {CHANGE_SEARCH_FIELD_GAMES_ACTION, SHOW_ONLY_MY_GAME_ACTION} from '../../store/tournament-actions';
import {getAllScenarios} from '../../../../../shared/model/szenarios';
import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/common';
import {FinishTournamentDialogComponent} from '../../../dialogs/finish-tournament-dialog';
import {TeamPairingService} from '../../team-pairing.service';
import {ActualTournamentTeamGamesService} from '../../actual-tournament-team-games.service';
import {TeamMatchClearModel} from '../../../../../shared/dto/team-match-clear';
import {TournamentTeam} from '../../../../../shared/model/tournament-team';
import {ActualTournamentTeamsService} from '../../actual-tournament-teams.service';
import {ActualTournamentTeamRankingService} from '../../actual-tournament-team-ranking.service';


@Component({
  selector: 'tournament-round-overview',
  templateUrl: './tournament-round-overview.component.html',
  styleUrls: ['./tournament-round-overview.component.scss']
})
export class TournamentRoundOverviewComponent implements OnInit, OnDestroy {

  _tournamentId: string;
  round: number;

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allTournamentPlayers$: Observable<TournamentPlayer[]>;
  allActualTournamentPlayers: TournamentPlayer[];

  allTeams$: Observable<TournamentTeam[]>;
  allTeams: TournamentTeam[];

  allTournamentGames$: Observable<TournamentGame[]>;
  allTournamentGamesFiltered$: Observable<TournamentGame[]>;
  allTournamentGames: TournamentGame[];
  gamesForRound$: Observable<TournamentGame[]>;
  finishedGamesForRound$: Observable<TournamentGame[]>;
  unfinishedGamesForRound$: Observable<TournamentGame[]>;

  loadGames$: Observable<boolean>;

  allTournamentTeamGames$: Observable<TournamentGame[]>;
  allTournamentTeamGamesFiltered$: Observable<TournamentGame[]>;
  allTournamentTeamGames: TournamentGame[];
  teamGamesForRound$: Observable<TournamentGame[]>;

  loadTeamGames$: Observable<boolean>;

  allTournamentRankings$: Observable<TournamentRanking[]>;
  allTournamentRankings: TournamentRanking[];
  rankingsForRound$: Observable<TournamentRanking[]>;

  allTournamentTeamRankings$: Observable<TournamentRanking[]>;
  allTournamentTeamRankings: TournamentRanking[];
  teamRankingsForRound$: Observable<TournamentRanking[]>;

  allArmyLists$: Observable<ArmyList[]>;

  allGamesFinished: boolean;
  allGamesUntouched: boolean;

  showOnlyMyGameState: boolean;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;

  selectedScenario: string;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualTournamentTeamSub: Subscription;
  private allActualTournamentGamesSub: Subscription;
  private allActualTournamentTeamGamesSub: Subscription;
  private allActualTournamentRankingsSub: Subscription;
  private allActualTournamentTeamRankingsSub: Subscription;

  scenarios: string[];
  searchField$: Observable<string>;
  onlyMyGameFilter$: Observable<boolean>;

  @ViewChild('searchField') searchField: ElementRef;

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;

  private isTeamTournament: boolean;
  private myTeam: string;

  constructor(@Inject(DOCUMENT) private document: any,
              private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private armyListService: ActualTournamentArmyListService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private teamService: ActualTournamentTeamsService,
              private rankingService: ActualTournamentRankingService,
              private teamRankingService: ActualTournamentTeamRankingService,
              private gamesService: ActualTournamentGamesService,
              private teamGamesService: ActualTournamentTeamGamesService,
              private pairingService: PairingService,
              private teamPairingService: TeamPairingService,
              private gameResultService: GameResultService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              private router: Router,
              private pageScrollService: PageScrollService) {

    this.round = +this.activeRouter.snapshot.paramMap.get('round');
    this._tournamentId = this.activeRouter.snapshot.paramMap.get('id');

    // console.log('create round: ' + this.round + ' for tournament: ' + this._tournamentId);

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);

    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);
    this.allTeams$ = this.store.select(state => state.actualTournamentTeams.teams);

    this.allTournamentRankings$ = this.store.select(state => state.actualTournamentRankings.rankings);
    this.allTournamentTeamRankings$ = this.store.select(state => state.actualTournamentTeamRankings.teamRankings);

    this.allTournamentGames$ = this.store.select(state => state.actualTournamentGames.games);
    this.loadGames$ = this.store.select(state => state.actualTournamentGames.loadGames);

    this.allTournamentTeamGames$ = this.store.select(state => state.actualTournamentTeamGames.teamGames);
    this.loadTeamGames$ = this.store.select(state => state.actualTournamentTeamGames.loadTeamGames);

    this.searchField$ = this.store.select(state => state.actualTournamentGames.gamesSearch);
    this.onlyMyGameFilter$ = this.store.select(state => state.actualTournamentGames.onlyMyGameFilter);

    this.subscribeOnServices(this._tournamentId, this.round);

    this.scenarios = getAllScenarios();
  }

  ngOnInit() {

    this.activeRouter.params.subscribe(params => {

        const incomingTournamentId = params['id'];
        const incomingRound: number = +params['round'];

        // console.log('incomingTournamentId: ' + incomingTournamentId);
        // console.log('incomingRound: ' + incomingRound);

        if (incomingTournamentId !== this._tournamentId) {
          console.log('other tournament to display');

          this.unsubscribeOnServices();
          this.subscribeOnServices(incomingTournamentId, incomingRound);
        } else if (incomingRound !== this.round) {
          console.log('other round to display');

          this.round = incomingRound;

          this.createDataObservables(incomingRound);
        }
      }
    );
    Observable.fromEvent(this.searchField.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this.store.dispatch({type: CHANGE_SEARCH_FIELD_GAMES_ACTION, payload: this.searchField.nativeElement.value});
      });
  }


  ngOnDestroy() {

    console.log('destroy round: ' + this.round + ' for tournament: ' + this._tournamentId);

    this.unsubscribeOnServices();
  }

  private subscribeOnServices(incomingTournamentId: string, incomingRound: number) {

    this.tournamentService.subscribeOnFirebase(incomingTournamentId);
    this.tournamentPlayerService.subscribeOnFirebase(incomingTournamentId);
    this.armyListService.subscribeOnFirebase(incomingTournamentId);

    this.teamService.subscribeOnFirebase(incomingTournamentId);

    this.rankingService.subscribeOnFirebase(incomingTournamentId);
    this.teamRankingService.subscribeOnFirebase(incomingTournamentId);


    this.gamesService.subscribeOnFirebase(incomingTournamentId);
    this.teamGamesService.subscribeOnFirebase(incomingTournamentId);

    this.createDataObservables(incomingRound);

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {

      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();


      if (actualTournament) {
        this.isTeamTournament = (actualTournament.teamSize > 0);
      }

    });
    this.userPlayerDataSub = this.userPlayerData$.subscribe((player: Player) => {
      this.userPlayerData = player;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();

      if (this.isTeamTournament) {
        this.setMyTeam();
      }

    });

    this.allActualTournamentPlayersSub = this.allTournamentPlayers$.subscribe((allTournamentPlayers: TournamentPlayer[]) => {
      this.allActualTournamentPlayers = allTournamentPlayers;
      this.setIsTournamentPlayer();
    });

    this.allActualTournamentTeamSub = this.allTeams$.subscribe((allTeams: TournamentTeam[]) => {
      this.allTeams = allTeams;
      if (this.isTeamTournament) {
        this.setMyTeam();
      }
    });

    this.allActualTournamentGamesSub = this.allTournamentGames$.subscribe((allTournamentGames: TournamentGame[]) => {
      this.allTournamentGames = allTournamentGames;
    });

    this.allActualTournamentTeamGamesSub = this.allTournamentTeamGames$.subscribe((allTournamentTeamGames: TournamentGame[]) => {
      this.allTournamentTeamGames = allTournamentTeamGames;
    });

    this.allActualTournamentRankingsSub = this.allTournamentRankings$.subscribe((rankings: TournamentRanking[]) => {
      this.allTournamentRankings = rankings;
    });

    this.allActualTournamentTeamRankingsSub = this.allTournamentTeamRankings$.subscribe((teamRankings: TournamentRanking[]) => {
      this.allTournamentTeamRankings = teamRankings;
    });

  }

  private createDataObservables(incomingRound: number) {

    this.gamesForRound$ = this.allTournamentGames$.map(
      games => games.filter((game: TournamentGame) => {
        return game.tournamentRound === incomingRound;
      }));


    this.teamGamesForRound$ = this.allTournamentTeamGames$.map(
      games => games.filter((game: TournamentGame) => {
        return game.tournamentRound === incomingRound;
      }));

    this.allTournamentTeamGamesFiltered$ = Observable.combineLatest(
      this.allTournamentTeamGames$,
      this.searchField$,
      this.onlyMyGameFilter$,
      (allTeamGames, searchField, onlyMyGameFilter) => {
        if (!searchField && !onlyMyGameFilter) {
          return allTeamGames.filter(g => {
            if (!this.selectedScenario && g.tournamentRound === incomingRound) {
              this.selectedScenario = g.scenario;
            }
            return g.tournamentRound === incomingRound;
          });
        } else if (onlyMyGameFilter) {
          return allTeamGames.filter(g => {
            return (g.playerOnePlayerName === this.myTeam || g.playerTwoPlayerName ===  this.myTeam)
              && g.tournamentRound === incomingRound;
          });
        } else {
          return allTeamGames.filter((game: TournamentGame) => {
            const field = game.playingField;
            const p1 = game.playerOnePlayerName;
            const p2 = game.playerTwoPlayerName;
            return (+searchField === field || p1.startsWith(searchField) || p2.startsWith(searchField))
              && game.tournamentRound === incomingRound;
          });
        }
      });


    this.allTournamentGamesFiltered$ = Observable.combineLatest(
      this.allTournamentGames$,
      this.searchField$,
      this.onlyMyGameFilter$,
      (allGames, searchField, onlyMyGameFilter) => {
        if (!searchField && !onlyMyGameFilter) {
          return allGames.filter(g => {
            if (!this.selectedScenario && g.tournamentRound === incomingRound) {
              this.selectedScenario = g.scenario;
            }
            return g.tournamentRound === incomingRound;
          });
        } else if (onlyMyGameFilter) {
          return allGames.filter(g => {
            const searchedPlayerId = this.userPlayerData.id;
            return (g.playerOnePlayerId === searchedPlayerId || g.playerTwoPlayerId === searchedPlayerId)
              && g.tournamentRound === incomingRound;
          });
        } else {
          return allGames.filter((game: TournamentGame) => {
            const field = game.playingField;
            const p1 = game.playerOnePlayerName;
            const p2 = game.playerTwoPlayerName;
            return (+searchField === field || p1.startsWith(searchField) || p2.startsWith(searchField))
              && game.tournamentRound === incomingRound;
          });
        }
      });


    this.finishedGamesForRound$ = this.allTournamentGames$.map(
      games => games.filter(t => t.tournamentRound === incomingRound && t.finished));

    this.unfinishedGamesForRound$ = this.allTournamentGames$.map(
      games => games.filter(t => t.tournamentRound === incomingRound && !t.finished));

    this.rankingsForRound$ = this.allTournamentRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === incomingRound));

    this.teamRankingsForRound$ = this.allTournamentTeamRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === incomingRound));
  }

  private unsubscribeOnServices() {

    this.tournamentService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.teamService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();

    this.rankingService.unsubscribeOnFirebase();
    this.teamRankingService.unsubscribeOnFirebase();

    this.gamesService.unsubscribeOnFirebase();
    this.teamGamesService.unsubscribeOnFirebase();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualTournamentTeamSub.unsubscribe();

    this.allActualTournamentGamesSub.unsubscribe();
    this.allActualTournamentRankingsSub.unsubscribe();

    this.allActualTournamentTeamGamesSub.unsubscribe();
    this.allActualTournamentTeamRankingsSub.unsubscribe();
  }

  changeScenario(): void {

    this.tournamentService.wholeRoundScenarioSelected({
      scenario: this.selectedScenario,
      tournamentId: this.actualTournament.id,
      round: this.round
    });

    this.snackBar.open('Scenario selected', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  showOnlyMyGame(show: boolean): void {

    this.store.dispatch({type: SHOW_ONLY_MY_GAME_ACTION, payload: show});
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

      _.forEach(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
        if (that.userPlayerData && that.userPlayerData.id === player.playerId) {
          that.isTournamentPlayer = true;
        }
      });
    }
  }

  setMyTeam(): void {
    const that = this;

    if (this.allTeams && this.userPlayerData) {

      this.myTeam = '';

      _.forEach(this.allTeams, function (team: TournamentTeam) {
        if (team.registeredPlayerIds.indexOf(that.userPlayerData.id) !== -1) {
          that.myTeam = team.teamName;
        }
      });
    }
  }

  checkOrganizerIsParing(): boolean {

    if (this.actualTournament) {
      return ((!this.isAdmin && !this.isCoOrganizer) &&
        (this.actualTournament.actualRound > this.actualTournament.visibleRound) &&
        (this.round === this.actualTournament.actualRound));
    }
    return false;
  }

  showRankingsOfRound() {
    this.router.navigate(['/tournament', this.actualTournament.id, 'round', (this.round ), 'rankings']);
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
          if (this.isTeamTournament) {
            this.teamPairingService.killTeamRankingsAndGames(config);
          }

          this.pairingService.killRound(config);

          this.snackBar.open('Round ' + config.round + ' successfully killed with fire!', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });

          if (this.round === 1) {
            if (this.isTeamTournament) {
              this.router.navigate(['/tournament', this.actualTournament.id, 'teams']);
            } else {
              this.router.navigate(['/tournament', this.actualTournament.id, 'players']);
            }

          } else {
            this.router.navigate(['/tournament', this.actualTournament.id, 'round', (this.round - 1)]);
          }

        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
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
        teamMatch: this.isTeamTournament
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onPairAgain
      .subscribe((config: TournamentManagementConfiguration) => {

        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          config.round = this.round;

          if (!this.isTeamTournament) {
            this.pairingService.pairRoundAgain(config, this.allActualTournamentPlayers, this.allTournamentRankings);
          } else {
            this.teamPairingService.pairTeamRoundAgain(config,
              this.actualTournament, this.allTeams, this.allActualTournamentPlayers,
              this.allTournamentRankings, this.allTournamentTeamRankings);
          }

          this.snackBar.open('Round created successfully again.', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openNewRoundDialog() {
    const dialogRef = this.dialog.open(NewRoundDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        round: this.round,
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        teamMatch: false
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onNewRound
      .subscribe((config: TournamentManagementConfiguration) => {
        if (config !== undefined) {
          this.pairingService.pairNewRound(config, this.allActualTournamentPlayers, this.allTournamentRankings);

          this.snackBar.open('Round created successfully.', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });

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
        allActualTournamentPlayers: this.allActualTournamentPlayers
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onEndTournament
      .subscribe(() => {

        this.tournamentService.endTournament(this.actualTournament);

        this.snackBar.open('Tournament ended successfully ', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });

        this.router.navigate(['/tournament', this.actualTournament.id, 'finalRankings']);


      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }


  handleClearPlayerGameResult(game: TournamentGame) {

    const clearedGame = clearTournamentGame(game);

    this.gameResultService.gameResultEntered(
      {
        gameBefore: game,
        gameAfter: clearedGame
      },
      this.actualTournament,
      this.allTournamentRankings,
      this.allTournamentGames
    );

    this.snackBar.open('Game cleared successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleClearTeamPlayerGameResult(teamMatchClear: TeamMatchClearModel) {

    console.log('teamplayergame: ' + JSON.stringify(teamMatchClear.playerMatchesForTeamOne[0]));

    // this.gameResultService.clearGameForTeamMatchOnly(teamMatchClear.teamMatch);

    const clearedGame = clearTournamentGame(teamMatchClear.playerMatchesForTeamOne[0]);

    this.gameResultService.gameResultEntered(
      {
        gameBefore: teamMatchClear.playerMatchesForTeamOne[0],
        gameAfter: clearedGame
      },
      this.actualTournament,
      this.allTournamentRankings,
      this.allTournamentGames
    );
  }

  handleClearTeamGameResult(teamMatchClear: TeamMatchClearModel) {

    const that = this;

    this.gameResultService.clearGameForTeamMatch(teamMatchClear.teamMatch);

    _.forEach(teamMatchClear.playerMatchesForTeamOne, function (playerGame: TournamentGame) {
      const clearedGame = clearTournamentGame(playerGame);

      that.gameResultService.gameResultEntered(
        {
          gameBefore: playerGame,
          gameAfter: clearedGame
        },
        that.actualTournament,
        that.allTournamentRankings,
        that.allTournamentGames
      );
    });
    this.snackBar.open('TeamGame cleared successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleGameResultEntered(gameResult: GameResult) {


    if (this.selectedScenario) {
      gameResult.gameAfter.scenario = this.selectedScenario;
    }

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

  handleTeamGameResultEntered(gameResult: GameResult) {

    if (this.selectedScenario) {
      gameResult.gameAfter.scenario = this.selectedScenario;
    }

    this.gameResultService.teamGameResultEntered(
      gameResult,
      this.actualTournament,
      this.allTournamentRankings,
      this.allTournamentTeamRankings,
      this.allTournamentGames,
      this.allTournamentTeamGames);


    this.snackBar.open('TeamGameResult entered successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }


  doRandomGameResultsForAllGames() {

    const that = this;

    _.forEach(this.allTournamentGames, function (game: TournamentGame) {

      if (!game.finished) {

        console.log('update game: ' + game.playerOnePlayerName + ' VS ' + game.playerTwoPlayerName);

        const gameAfter = _.cloneDeep(game);

        const winner = Math.floor((Math.random() * 2) + 1);

        if (winner === 1) {
          gameAfter.playerOneScore = 1;
        } else {
          gameAfter.playerTwoScore = 1;
        }
        gameAfter.playerTwoScore = winner === 2 ? 1 : 0;
        gameAfter.finished = true;

        that.gameResultService.gameResultEntered(
          {
            gameBefore: game,
            gameAfter: gameAfter,
          },
          that.actualTournament,
          that.allTournamentRankings,
          that.allTournamentGames);
      }
    });
  };

  startAutoScroll() {

    const that = this;

    this.onReachBottomOfPageEvent = new EventEmitter();

    this.onReachBottomOfPageEvent.subscribe(function (x) {

      if (!x) {
        that.onReachBottomOfPageEvent.complete();
      }
      that.autoScrollToTop();
    });

    this.onReachTopOfPageEvent = new EventEmitter();

    this.onReachTopOfPageEvent.subscribe(function (x) {

      if (!x) {
        that.onReachTopOfPageEvent.complete();
      }
      that.autoScrollToBottom();
    });

    this.autoScrollToBottom();
  }

  autoScrollToBottom() {

    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#bottom',
      pageScrollDuration: 30000,
      pageScrollFinishListener: this.onReachBottomOfPageEvent
    });
    this.pageScrollService.start(pageScrollInstance);
  }

  autoScrollToTop() {

    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#top',
      pageScrollDuration: 15000,
      pageScrollFinishListener: this.onReachTopOfPageEvent
    });
    this.pageScrollService.start(pageScrollInstance);
  }

}



