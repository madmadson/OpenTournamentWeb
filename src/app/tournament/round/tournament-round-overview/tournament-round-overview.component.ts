import {Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';


import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {Player} from '../../../../../shared/model/player';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TournamentService} from '../../actual-tournament.service';
import {TournamentPlayersService} from '../../actual-tournament-players.service';
import {ActualTournamentArmyListService} from '../../actual-tournament-army-list.service';
import {ActualTournamentRankingService} from 'app/tournament/actual-tournament-ranking.service';
import {PlayerGamesService} from '../../player-games.service';
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
import {TournamentTeam} from '../../../../../shared/model/tournament-team';
import {ActualTournamentTeamsService} from '../../actual-tournament-teams.service';
import {ActualTournamentTeamRankingService} from '../../actual-tournament-team-ranking.service';
import {TeamMatchClearModel} from '../../../../../shared/dto/player-match-team-clear-model';
import {getArrayForNumber} from '../../../../../shared/utils';
import {WindowRefService} from '../../../service/window-ref-service';
import {AfoListObservable, AfoObjectObservable, AngularFireOfflineDatabase} from 'angularfire2-offline';
import {ImportDialogComponent} from '../../../dialogs/import-dialog';


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
  allPlayers: TournamentPlayer[];

  allTeams$: Observable<TournamentTeam[]>;
  allTeams: TournamentTeam[];

  allPlayerGames$: Observable<TournamentGame[]>;
  allPlayerGamesFiltered$: Observable<TournamentGame[]>;
  allPlayerGames: TournamentGame[];
  playerGamesForRound$: Observable<TournamentGame[]>;
  playerGamesForRound: TournamentGame[];
  finishedGamesForRound$: Observable<TournamentGame[]>;
  unfinishedGamesForRound$: Observable<TournamentGame[]>;

  loadGames$: Observable<boolean>;

  allTeamGames$: Observable<TournamentGame[]>;
  allTeamGamesFiltered$: Observable<TournamentGame[]>;
  allTeamGames: TournamentGame[];
  teamGamesForRound$: Observable<TournamentGame[]>;
  teamGamesForRound: TournamentGame[];

  loadTeamGames$: Observable<boolean>;

  allPlayerRankings$: Observable<TournamentRanking[]>;
  allPlayerRankings: TournamentRanking[];
  playerRankingsForRound$: Observable<TournamentRanking[]>;
  playerRankingsForRound: TournamentRanking[];

  allTeamRankings$: Observable<TournamentRanking[]>;
  allTeamRankings: TournamentRanking[];
  teamRankingsForRound$: Observable<TournamentRanking[]>;
  teamRankingsForRound: TournamentRanking[];

  allArmyLists$: Observable<ArmyList[]>;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;
  isTeamTournament: boolean;
  myTeam: string;

  selectedScenario: string;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualTournamentTeamSub: Subscription;
  private allActualTournamentGamesSub: Subscription;
  private allActualTournamentTeamGamesSub: Subscription;
  private allActualTournamentRankingsSub: Subscription;
  private allActualTournamentTeamRankingsSub: Subscription;

  private playerGamesForRoundSub: Subscription;
  private teamGamesForRoundSub: Subscription;

  private playerRankingsForRoundSub: Subscription;
  private teamRankingsForRoundSub: Subscription;

  scenarios: string[];
  searchField$: Observable<string>;
  onlyMyGameFilter$: Observable<boolean>;

  @ViewChild('searchField') searchField: ElementRef;

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;

  isConnected$: Observable<boolean>;
  private onlineSub: Subscription;

  private blub$: AfoListObservable<any[]>;
  private blub2$: AfoListObservable<any[]>;
  private blub3$: AfoObjectObservable<any>;


  constructor(@Inject(DOCUMENT) private document: any,
              private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private armyListService: ActualTournamentArmyListService,
              private tournamentPlayerService: TournamentPlayersService,
              private teamService: ActualTournamentTeamsService,
              private rankingService: ActualTournamentRankingService,
              private teamRankingService: ActualTournamentTeamRankingService,
              private gamesService: PlayerGamesService,
              private teamGamesService: ActualTournamentTeamGamesService,
              private pairingService: PairingService,
              private teamPairingService: TeamPairingService,
              private gameResultService: GameResultService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              public router: Router,
              private pageScrollService: PageScrollService,
              private winRef: WindowRefService,
              private afoDatabase: AngularFireOfflineDatabase) {

    this.round = +this.activeRouter.snapshot.paramMap.get('round');
    this._tournamentId = this.activeRouter.snapshot.paramMap.get('id');

    this.blub$ = this.afoDatabase.list('tournament-team-games/' + this._tournamentId);
    this.blub2$ = this.afoDatabase.list('tournament-games/' + this._tournamentId);
    this.blub3$ = this.afoDatabase.object('tournaments/' + this._tournamentId);

    this.isConnected$ = Observable.merge(
      Observable.of(this.winRef.nativeWindow.navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));

    // console.log('create round: ' + this.round + ' for tournament: ' + this._tournamentId);

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);

    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);
    this.allTeams$ = this.store.select(state => state.actualTournamentTeams.teams);

    this.allPlayerRankings$ = this.store.select(state => state.actualTournamentRankings.rankings);
    this.allTeamRankings$ = this.store.select(state => state.actualTournamentTeamRankings.teamRankings);

    this.allPlayerGames$ = this.store.select(state => state.actualTournamentGames.games);
    this.loadGames$ = this.store.select(state => state.actualTournamentGames.loadGames);

    this.allTeamGames$ = this.store.select(state => state.actualTournamentTeamGames.teamGames);
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

          this.subscribeOnServices(incomingTournamentId, incomingRound);
        } else if (incomingRound !== this.round) {
          console.log('other round to display');

          this.round = incomingRound;

          this.subscribeOnServices(incomingTournamentId, incomingRound);
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

    this.unsubscribeServices();
    this.unsubscribeObservables();
  }

  private subscribeOnServices(incomingTournamentId: string, incomingRound: number) {

    this.tournamentService.subscribeOnOfflineFirebase(incomingTournamentId);
    this.tournamentPlayerService.subscribeOnOfflineFirebase(incomingTournamentId);
    this.armyListService.subscribeOnOfflineFirebase(incomingTournamentId);
    this.teamService.subscribeOnOfflineFirebase(incomingTournamentId);

    this.rankingService.subscribeOnOfflineFirebase(incomingTournamentId);
    this.teamRankingService.subscribeOnOfflineFirebase(incomingTournamentId);

    this.gamesService.subscribeOnOfflineFirebase(incomingTournamentId);
    this.teamGamesService.subscribeOnOfflineFirebase(incomingTournamentId);

    this.onlineSub = this.isConnected$.subscribe(online => {

      if (online) {
        console.log('online');

        this.snackBar.open('You are now online. Sync with server', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      } else {
        console.log('offline');

        this.snackBar.open('You are now offline. Write to browser DB', '', {
          extraClasses: ['snackBar-fail'],
          duration: 5000
        });
      }
    });


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
      this.allPlayers = allTournamentPlayers;
      this.setIsTournamentPlayer();
    });

    this.allActualTournamentTeamSub = this.allTeams$.subscribe((allTeams: TournamentTeam[]) => {
      this.allTeams = allTeams;
      if (this.isTeamTournament) {
        this.setMyTeam();
      }
    });

    this.allActualTournamentGamesSub = this.allPlayerGames$.subscribe((allTournamentGames: TournamentGame[]) => {
      this.allPlayerGames = allTournamentGames;
    });

    this.playerGamesForRoundSub = this.playerGamesForRound$.subscribe((gamesForRound: TournamentGame[]) => {
      this.playerGamesForRound = gamesForRound;
    });

    this.playerRankingsForRoundSub = this.playerRankingsForRound$.subscribe((rankings: TournamentRanking[]) => {
      this.playerRankingsForRound = rankings;
    });

    this.allActualTournamentTeamGamesSub = this.allTeamGames$.subscribe((allTournamentTeamGames: TournamentGame[]) => {
      this.allTeamGames = allTournamentTeamGames;
    });

    this.teamGamesForRoundSub = this.teamGamesForRound$.subscribe((gamesForRound: TournamentGame[]) => {
      this.teamGamesForRound = gamesForRound;
    });

    this.teamRankingsForRoundSub = this.teamRankingsForRound$.subscribe((rankings: TournamentRanking[]) => {
      this.teamRankingsForRound = rankings;
    });

    this.allActualTournamentRankingsSub = this.allPlayerRankings$.subscribe((rankings: TournamentRanking[]) => {
      this.allPlayerRankings = rankings;
    });

    this.allActualTournamentTeamRankingsSub = this.allTeamRankings$.subscribe((teamRankings: TournamentRanking[]) => {
      this.allTeamRankings = teamRankings;
    });
  }

  private unsubscribeServices() {

    this.tournamentService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.teamService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();

    this.rankingService.unsubscribeOnFirebase();
    this.teamRankingService.unsubscribeOnFirebase();

    this.gamesService.unsubscribeOnFirebase();
    this.teamGamesService.unsubscribeOnFirebase();
  }

  private unsubscribeObservables() {

    this.onlineSub.unsubscribe();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualTournamentTeamSub.unsubscribe();

    this.allActualTournamentGamesSub.unsubscribe();
    this.allActualTournamentRankingsSub.unsubscribe();

    this.allActualTournamentTeamGamesSub.unsubscribe();
    this.allActualTournamentTeamRankingsSub.unsubscribe();

    this.playerGamesForRoundSub.unsubscribe();
    this.teamGamesForRoundSub.unsubscribe();

    this.playerRankingsForRoundSub.unsubscribe();
    this.teamRankingsForRoundSub.unsubscribe();

  }

  private createDataObservables(incomingRound: number) {

    this.playerGamesForRound$ = this.allPlayerGames$.map(
      games => games.filter((game: TournamentGame) => {
        return game.tournamentRound === incomingRound;
      }));


    this.teamGamesForRound$ = this.allTeamGames$.map(
      games => games.filter((game: TournamentGame) => {
        return game.tournamentRound === incomingRound;
      }));

    this.allTeamGamesFiltered$ = Observable.combineLatest(
      this.allTeamGames$,
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
            return (g.playerOnePlayerName === this.myTeam || g.playerTwoPlayerName === this.myTeam)
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


    this.allPlayerGamesFiltered$ = Observable.combineLatest(
      this.allPlayerGames$,
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


    this.finishedGamesForRound$ = this.allPlayerGames$.map(
      games => games.filter(t => t.tournamentRound === incomingRound && t.finished));

    this.unfinishedGamesForRound$ = this.allPlayerGames$.map(
      games => games.filter(t => t.tournamentRound === incomingRound && !t.finished));

    this.playerRankingsForRound$ = this.allPlayerRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === incomingRound));

    this.teamRankingsForRound$ = this.allTeamRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === incomingRound));
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

    if (this.allPlayers && this.userPlayerData) {

      this.isTournamentPlayer = false;

      _.forEach(this.allPlayers, function (player: TournamentPlayer) {
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

  publishRound() {
    this.pairingService.publishRound({tournamentId: this.actualTournament.id, roundToPublish: this.round});
    this.snackBar.open('Round ' + this.round + ' successfully published', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
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
          if (this.isTeamTournament) {
            this.teamPairingService.killTeamRankingsAndGames(config, this.teamRankingsForRound, this.teamGamesForRound);
          }

          this.pairingService.killRound(config, this.playerRankingsForRound, this.playerGamesForRound);

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
            this.pairingService.pairRoundAgain(config,
              this.playerRankingsForRound,
              this.playerGamesForRound,
              this.allPlayers,
              this.allPlayerRankings);
          } else {
            this.teamPairingService.pairTeamRoundAgain(config,
              this.actualTournament,
              this.teamRankingsForRound,
              this.teamGamesForRound,
              this.allTeams,
              this.allPlayers,
              this.allPlayerRankings,
              this.allTeamRankings);
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
        allActualTournamentPlayers: this.allPlayers,
        teamMatch: this.isTeamTournament
      },
      width: '600px',
    });
    const eventSubscribe = dialogRef.componentInstance.onNewRound
      .subscribe((config: TournamentManagementConfiguration) => {
        if (config !== undefined) {

          if (!this.isTeamTournament) {
            this.pairingService.pairNewRound(config,
              this.allPlayers,
              this.allPlayerRankings);
          } else {
            this.teamPairingService.pairNewTeamRound(
              config,
              this.actualTournament,
              this.allTeams,
              this.allPlayers,
              this.allPlayerRankings,
              this.allTeamRankings);
          }
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
        allActualTournamentPlayers: this.allPlayers
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
      this.allPlayerRankings,
      this.allPlayerGames,
      true
    );

    this.snackBar.open('Game cleared successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleClearTeamPlayerGameResult(gameToReset: TournamentGame) {

    const teamMatch = _.find(this.allTeamGames, function (teamGame: TournamentGame) {
      return teamGame.playerOnePlayerName === gameToReset.playerOneTeamName;
    });
    this.gameResultService.clearGameForTeamMatchOnly(gameToReset, teamMatch);

    const clearedGame = clearTournamentGame(gameToReset);

    this.gameResultService.gameResultEntered(
      {
        gameBefore: gameToReset,
        gameAfter: clearedGame
      },
      this.actualTournament,
      this.allPlayerRankings,
      this.allPlayerGames,
      true
    );

    this.snackBar.open('TeamGame cleared successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleClearTeamGameResult(teamMatchClear: TeamMatchClearModel) {

    const that = this;

    this.gameResultService.clearGameForTeamMatch(teamMatchClear.teamMatch);
    this.gameResultService.clearRankingForTeamMatch(teamMatchClear.teamMatch,
      this.allTeamRankings);

    _.forEach(teamMatchClear.playerMatchesForTeamOne, function (playerGame: TournamentGame) {
      const clearedGame = clearTournamentGame(playerGame);

      that.gameResultService.gameResultEntered(
        {
          gameBefore: playerGame,
          gameAfter: clearedGame
        },
        that.actualTournament,
        that.allPlayerRankings,
        that.allPlayerGames,
        true
      );
    });
    this.snackBar.open('TeamGame cleared successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleGameResultEntered(gameResult: GameResult) {

    if (this.round > this.actualTournament.visibleRound) {
      this.pairingService.publishRound({tournamentId: this.actualTournament.id, roundToPublish: this.round});
    }

    if (this.selectedScenario) {
      gameResult.gameAfter.scenario = this.selectedScenario;
    }

    this.gameResultService.gameResultEntered(
      gameResult,
      this.actualTournament,
      this.allPlayerRankings,
      this.allPlayerGames,
      false
    );

    this.snackBar.open('GameResult entered successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleTeamGameResultEntered(teamGameResult: GameResult) {


    if (this.round > this.actualTournament.visibleRound) {
      this.pairingService.publishRound({tournamentId: this.actualTournament.id, roundToPublish: this.round});
    }

    if (this.selectedScenario) {
      teamGameResult.gameAfter.scenario = this.selectedScenario;
    }

    console.log('teamGameResult: ' + JSON.stringify(teamGameResult));

    this.gameResultService.teamGameResultEntered(
      {
        teamMatch: this.getTeamMatchForPlayerGame(teamGameResult.gameAfter),
        gameBefore: teamGameResult.gameBefore,
        gameAfter: teamGameResult.gameAfter
      },
      this.actualTournament,
      this.allPlayerRankings,
      this.allTeamRankings,
      this.allPlayerGames,
      false
    );
    this.snackBar.open('TeamGameResult entered successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }


  doRandomGameResultsForAllGames() {

    const that = this;

    let tempTeamOne: string;
    let tempScoreTeamOne: number;
    let tempScoreTeamTwo: number;

    _.forEach(this.allPlayerGames, function (game: TournamentGame) {

      if (!game.finished) {

        const gameAfter = _.cloneDeep(game);

        const winner = Math.floor((Math.random() * 2) + 1);

        if (winner === 1) {
          gameAfter.playerOneScore = 1;
        } else {
          gameAfter.playerTwoScore = 1;
        }
        gameAfter.playerTwoScore = winner === 2 ? 1 : 0;
        gameAfter.finished = true;

        if (!that.isTeamTournament) {

          that.gameResultService.gameResultEntered(
            {
              gameBefore: game,
              gameAfter: gameAfter,
            },
            that.actualTournament,
            that.allPlayerRankings,
            that.allPlayerGames,
            false
          );
        } else {

          const tempTeamMatch = that.getTeamMatchForPlayerGame(game);

          if (tempTeamMatch.playerOnePlayerName === tempTeamOne) {

            tempScoreTeamOne = gameAfter.playerOneScore + tempScoreTeamOne;
            tempScoreTeamTwo = gameAfter.playerTwoScore + tempScoreTeamTwo;

            tempTeamMatch.playerOneIntermediateResult = tempScoreTeamOne;
            tempTeamMatch.playerTwoIntermediateResult = tempScoreTeamTwo;
          } else {
            tempTeamOne = tempTeamMatch.playerOnePlayerName;
            tempScoreTeamOne = 0;
            tempScoreTeamTwo = 0;
          }

          that.gameResultService.generatedTeamGameResultEntered(
            {
              teamMatch: tempTeamMatch,
              gameBefore: game,
              gameAfter: gameAfter,
            },
            that.actualTournament,
            that.allPlayerRankings,
            that.allTeamRankings,
            that.allPlayerGames
          );
        }
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

  getArrayForNumber(round: number) {
    return getArrayForNumber(round);
  }

  getTeamMatchForPlayerGame(game: TournamentGame): TournamentGame {

    const that = this;

    return _.find(this.allTeamGames, function (teamGame: TournamentGame) {

      return teamGame.tournamentRound === that.round &&
        (game.playerOneTeamName === teamGame.playerOnePlayerName ||
          game.playerTwoTeamName === teamGame.playerTwoPlayerName);
    });
  }

  openDataExportDialog() {

    let blob;

    const actualTournament = '\"tournament\" : ' + JSON.stringify(this.actualTournament, null, 4) + ',';
    const allPlayerGames = '\"playerGames\": ' + JSON.stringify(this.allPlayerGames, null, 4) + ',';
    const allPlayerRankings = '\"playerRankings\": ' + JSON.stringify(this.allPlayerRankings, null, 4);

    if (this.isTeamTournament) {
      const allTeamGames = ',\"teamGames\": ' + JSON.stringify(this.allTeamGames, null, 4) + ',';
      const allTeamRankings = '\"teamRankings\": ' + JSON.stringify(this.allTeamRankings, null, 4);
      blob = new Blob(['{', actualTournament, allPlayerGames, allPlayerRankings, allTeamGames, allTeamRankings, '}'],
        {type: 'application/json'});
    } else {
      blob = new Blob(['{', actualTournament, allPlayerGames, allPlayerRankings, '}'],
        {type: 'application/json'});
    }


    const objectUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = this.actualTournament.name + '_Round_' + this.actualTournament.actualRound + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);

  }

  openDataImportDialog(event: any) {

    const that = this;

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];

      console.log('import test: ' + JSON.stringify(file));

      const myReader: FileReader = new FileReader();
      myReader.readAsText(file);

      myReader.onloadend = function (e) {

        const allData = JSON.parse(myReader.result);


        const dialogRef = that.dialog.open(ImportDialogComponent, {
          data: {
            tournament: allData.tournament,
            playerGames: allData.playerGames,
            playerRankings: allData.playerRankings,
            teamGames: allData.teamGames,
            teamRankings: allData.teamRankings,
            error: false
          },
          width: '600px',
        });

        const eventSubscribe = dialogRef.componentInstance.onImportData
          .subscribe((blub) => {

            that.tournamentService.newRound({
              round: allData.tournament.actualRound,
              tournamentId: allData.tournament.id,
              countryRestriction: false,
              metaRestriction: false,
              teamRestriction: false,
              originRestriction: false
            });
            that.pairingService.killPlayerRankings(that.allPlayerRankings);
            that.pairingService.killPlayerGames(that.allPlayerGames);

            that.pairingService.pushAllPlayerGames(allData.tournament.id, allData.playerGames);
            that.pairingService.pushAllPlayerRankings(allData.tournament.id, allData.playerRankings);

            that.snackBar.open('Import Data successfully.', '', {
              extraClasses: ['snackBar-success'],
              duration: 5000
            });

            that.router.navigate(['/tournament', allData.tournament.id, 'round', allData.tournament.actualRound]);

            dialogRef.close();
          });
        dialogRef.afterClosed().subscribe(() => {

          eventSubscribe.unsubscribe();
        });
      };
    }


  }
}



