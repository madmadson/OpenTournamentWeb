import {
  AfterContentChecked,
  Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild
} from '@angular/core';


import * as _ from 'lodash';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {TournamentGame} from '../../../../../shared/model/tournament-game';
import {ScenarioSelectedModel} from '../../../../../shared/dto/scenario-selected-model';
import {SwapGames} from '../../../../../shared/dto/swap-player';
import {GameResult} from '../../../../../shared/dto/game-result';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdPaginator, MdSnackBar, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';
import {GlobalEventService} from '../../../service/global-event-service';
import {getAllScenarios} from '../../../../../shared/model/szenarios';
import {ArmyList} from '../../../../../shared/model/armyList';
import {Player} from '../../../../../shared/model/player';
import {GameConfig, getWarmachineConfig} from '../../../../../shared/dto/game-config';
import {Observable} from 'rxjs/Observable';
import {GamesDatabase, GamesDataSource} from "../../../../../shared/table-model/game";
import {PageScrollInstance, PageScrollService} from "ng2-page-scroll";
import {DOCUMENT} from "@angular/common";


@Component({
  selector: 'tournament-games',
  templateUrl: './tournament-games.component.html',
  styleUrls: ['./tournament-games.component.scss']
})
export class TournamentGamesComponent implements OnInit, AfterContentChecked {


  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;

  @Input() round: number;
  @Input() teamMatch: boolean;

  @Input() userPlayerData: Player;
  @Input() actualTournament: Tournament;

  @Input() armyLists: ArmyList[];
  @Input() gamesForRound: TournamentGame[];
  @Input() rankingsForRound: TournamentRanking[];


  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onScenarioSelected = new EventEmitter<ScenarioSelectedModel>();

  @Output() onClearPlayerGameResult = new EventEmitter<TournamentGame>();

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;


  dragStarted: boolean;
  draggedTournamentPlayerId: string;
  draggedGameTeamName: string;
  draggedTournamentPlayerCurrentOpponentId: string;
  draggedTournamentPlayerOpponentIds: string[];
  draggedGame: TournamentGame;

  swapPlayerMode: boolean;
  selectedScenario: string;
  loggedInUserTeam: string;

  requestClearGame: string;

  dragRequestTournamentPlayerId: string;


  displayedColumns = ['playingField', 'playerOnePlayerName', 'vs', 'playerTwoPlayerName'];

  gamesDb: GamesDatabase;
  dataSource: GamesDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;


  smallScreen: boolean;
  truncateMax: number;

  constructor(@Inject(DOCUMENT) private document: any,
              private pageScrollService: PageScrollService,
              private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private messageService: GlobalEventService,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 10;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 25;
    }
  }

  ngOnInit() {

    this.gamesDb = new GamesDatabase(this.gamesForRound);

    this.dataSource = new GamesDataSource(this.gamesDb, this.sort, this.paginator);

    // this.armyLists$ = this.actualTournamentArmyLists$;
    //
    // this.rankingsForRound$.subscribe(rankings => {
    //   this.rankingsForRound = rankings;
    // });
    //
    // this.allVisibleGames = this.gamesForRound;
    //
    // if (this.actualTournamentTeams$) {
    //   this.actualTournamentTeams$.subscribe(teams => {
    //     if (this.userPlayerData) {
    //       _.each(teams, function (team: TournamentTeam) {
    //         if (team.registeredPlayerIds.indexOf(that.userPlayerData.id) !== -1) {
    //           that.loggedInUserTeam = team.teamName;
    //         }
    //       });
    //     }
    //   });
    // }
  }

  ngAfterContentChecked(): void {

    if (this.gamesForRound[0]) {
      this.selectedScenario = this.gamesForRound[0].scenario;
    }
  }

  playerOneWon(game: TournamentGame): boolean {
    return game.playerOneScore > game.playerTwoScore;

  }

  playerTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;

  }

  changeScenario(): void {

    if (this.gamesForRound[0]) {
      this.onScenarioSelected.emit({
        tournamentId: this.actualTournament.id,
        round: this.gamesForRound[0].tournamentRound,
        scenario: this.selectedScenario
      });
    }
  }

  clickSwapPlayerPlayerOne(event: any, game: TournamentGame) {

    event.stopPropagation();

    this.dragRequestTournamentPlayerId = game.playerOneTournamentPlayerId;

    const that = this;

    this.swapPlayerMode = true;

    this.draggedTournamentPlayerId = game.playerOneTournamentPlayerId;
    this.draggedGameTeamName = game.playerOneTeamName;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerTwoTournamentPlayerId;
    this.draggedGame = game;
    this.dragStarted = true;

    _.each(this.rankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.tournamentPlayerId === game.playerOneTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });

    this.messageService.broadcast('swapPlayerMode', true);
  }

  requestClearGameResult(event: any, game: TournamentGame) {
    event.stopPropagation();

    this.requestClearGame = game.id;
  }

  clearGameResultConfirm(event: any, game: TournamentGame) {

    event.stopPropagation();

    this.requestClearGame = '';
    this.onClearPlayerGameResult.emit(game);
  }

  clearGameResultDecline(event: any) {
    event.stopPropagation();
    this.requestClearGame = '';
  }

  clickSwapPlayerPlayerTwo(event: any, game: TournamentGame) {

    event.stopPropagation();

    this.dragRequestTournamentPlayerId = game.playerTwoTournamentPlayerId;

    const that = this;

    this.swapPlayerMode = true;

    this.draggedTournamentPlayerId = game.playerTwoTournamentPlayerId;
    this.draggedGameTeamName = game.playerTwoTeamName;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerOneTournamentPlayerId;
    this.draggedGame = game;
    this.dragStarted = true;

    _.each(this.rankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.tournamentPlayerId === game.playerTwoTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });

    this.messageService.broadcast('swapPlayerMode', true);
  }

  endSwapPlayer(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.dragRequestTournamentPlayerId = '';

    this.swapPlayerMode = false;
    this.dragStarted = false;

    this.messageService.broadcast('swapPlayerMode', false);
  }

  confirmSwapPlayerWithPlayerOne(event: any, droppedGame: TournamentGame,
                                 droppedTournamentPlayerId: string,
                                 droppedTournamentPlayerOpponentId: string) {

    if (this.dragStarted) {

      event.stopPropagation();

      if (!droppedGame.finished && this.draggedGame) {

        if (this.teamMatch && this.draggedGameTeamName !== droppedGame.playerOneTeamName) {
          return;
        }

        this.swapPlayerMode = false;
        this.dragStarted = false;
        this.messageService.broadcast('swapPlayerMode', false);

        // Don't do anything if dropping the same column we're dragging.
        if (droppedTournamentPlayerId !== this.draggedTournamentPlayerId &&
          droppedGame !== this.draggedGame) {
          if (!this.playedAgainstOthers(this.draggedTournamentPlayerId, droppedTournamentPlayerOpponentId, droppedGame) &&
            !this.playedAgainstOthers(droppedTournamentPlayerId, this.draggedTournamentPlayerCurrentOpponentId, this.draggedGame)) {
            this.doSwapping(droppedGame, droppedTournamentPlayerId);
          }
        }

      }
    }
  }

  confirmSwapPlayerWithPlayerTwo(event: any, droppedGame: TournamentGame,
                                 droppedTournamentPlayerId: string,
                                 droppedTournamentPlayerOpponentId: string) {
    if (this.dragStarted) {

      event.stopPropagation();

      if (!droppedGame.finished && this.draggedGame) {

        if (this.teamMatch && this.draggedGameTeamName !== droppedGame.playerTwoTeamName) {
          return;
        }

        this.swapPlayerMode = false;
        this.dragStarted = false;
        this.messageService.broadcast('swapPlayerMode', false);

        // Don't do anything if dropping the same column we're dragging.
        if (droppedTournamentPlayerId !== this.draggedTournamentPlayerId &&
          droppedGame !== this.draggedGame) {
          if (!this.playedAgainstOthers(this.draggedTournamentPlayerId, droppedTournamentPlayerOpponentId, droppedGame) &&
            !this.playedAgainstOthers(droppedTournamentPlayerId, this.draggedTournamentPlayerCurrentOpponentId, this.draggedGame)) {
            this.doSwapping(droppedGame, droppedTournamentPlayerId);
          }
        }

      }
    }
  }


  dragEnableForPlayerOne(potentialDroppedGame: TournamentGame): boolean {

    if (this.teamMatch) {
      return !(this.draggedTournamentPlayerId === potentialDroppedGame.playerOneTournamentPlayerId ||
      this.draggedTournamentPlayerId === potentialDroppedGame.playerTwoTournamentPlayerId ||
      this.draggedGameTeamName === potentialDroppedGame.playerTwoTeamName);
    } else {
      return !(this.draggedTournamentPlayerId === potentialDroppedGame.playerOneTournamentPlayerId ||
      this.draggedTournamentPlayerId === potentialDroppedGame.playerTwoTournamentPlayerId ||
      _.includes(this.draggedTournamentPlayerOpponentIds, potentialDroppedGame.playerTwoTournamentPlayerId));
    }
  }

  dragEnableForPlayerTwo(potentialDroppedGame: TournamentGame): boolean {

    if (this.teamMatch) {
      return !(this.draggedTournamentPlayerId === potentialDroppedGame.playerOneTournamentPlayerId ||
      this.draggedTournamentPlayerId === potentialDroppedGame.playerTwoTournamentPlayerId ||
      this.draggedGameTeamName === potentialDroppedGame.playerOneTeamName);
    } else {
      return !(this.draggedTournamentPlayerId === potentialDroppedGame.playerOneTournamentPlayerId ||
      this.draggedTournamentPlayerId === potentialDroppedGame.playerTwoTournamentPlayerId ||
      _.includes(this.draggedTournamentPlayerOpponentIds, potentialDroppedGame.playerOneTournamentPlayerId));
    }
  }


  private doSwapping(droppedGame: TournamentGame, droppedTournamentPlayerId: string) {
    const newGameOne = this.createGameOne(droppedGame, droppedTournamentPlayerId);
    const newGameTwo = this.createGameTwo(droppedGame, droppedTournamentPlayerId);

    const swapPlayer: SwapGames = {
      gameOne: newGameOne,
      gameTwo: newGameTwo,
    };

    console.log('gameOne: ' + JSON.stringify(newGameOne));
    console.log('gameTwo: ' + JSON.stringify(newGameTwo));

    this.onSwapPlayer.emit(swapPlayer);
  }

  private createGameOne(droppedGame: TournamentGame, droppedTournamentPlayerId: string): TournamentGame {

    let gameOnePlayerOneAffected = false;
    let gameOnePlayerTwoAffected = false;
    let gameTwoPlayerOneAffected = false;
    let gameTwoPlayerTwoAffected = false;

    if (this.draggedGame.playerOneTournamentPlayerId === this.draggedTournamentPlayerId) {
      // X-1 / X-2
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOneAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // X-1 / 2-X
        gameOnePlayerOneAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    } else {
      // 1-X / X-2
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // 1-X / 2-X
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    }

    return {
      id: this.draggedGame.id,
      tournamentId: this.draggedGame.tournamentId,

      playerOnePlayerId: gameOnePlayerTwoAffected ? this.draggedGame.playerOnePlayerId :
        gameTwoPlayerOneAffected ? droppedGame.playerOnePlayerId : droppedGame.playerTwoPlayerId,
      playerOneTournamentPlayerId: gameOnePlayerTwoAffected ? this.draggedGame.playerOneTournamentPlayerId :
        gameTwoPlayerOneAffected ? droppedGame.playerOneTournamentPlayerId : droppedGame.playerTwoTournamentPlayerId,
        playerOnePlayerName: gameOnePlayerTwoAffected ? this.draggedGame.playerOnePlayerName :
        gameTwoPlayerOneAffected ? droppedGame.playerOnePlayerName : droppedGame.playerTwoPlayerName,
      playerOneTeamName: gameOnePlayerTwoAffected ? this.draggedGame.playerOneTeamName :
        gameTwoPlayerOneAffected ? droppedGame.playerOneTeamName : droppedGame.playerTwoTeamName,
      playerOneFaction: gameOnePlayerTwoAffected ? this.draggedGame.playerOneFaction :
        gameTwoPlayerOneAffected ? droppedGame.playerOneFaction : droppedGame.playerTwoFaction,
      playerOneElo: gameOnePlayerTwoAffected ? this.draggedGame.playerOneElo :
        gameTwoPlayerOneAffected ? droppedGame.playerOneElo : droppedGame.playerTwoElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,
      playerOneIntermediateResult: 0,

      playerTwoPlayerId: gameOnePlayerOneAffected ? this.draggedGame.playerTwoPlayerId :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoPlayerId : droppedGame.playerOnePlayerId,
      playerTwoTournamentPlayerId: gameOnePlayerOneAffected ? this.draggedGame.playerTwoTournamentPlayerId :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoTournamentPlayerId : droppedGame.playerOneTournamentPlayerId,
      playerTwoPlayerName: gameOnePlayerOneAffected ? this.draggedGame.playerTwoPlayerName :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoPlayerName : droppedGame.playerOnePlayerName,
      playerTwoTeamName: gameOnePlayerOneAffected ? this.draggedGame.playerTwoTeamName :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoTeamName : droppedGame.playerOneTeamName,
      playerTwoFaction: gameOnePlayerOneAffected ? this.draggedGame.playerTwoFaction :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoFaction : droppedGame.playerOneFaction,
      playerTwoElo: gameOnePlayerOneAffected ? this.draggedGame.playerTwoElo :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoElo : droppedGame.playerOneElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,
      playerTwoIntermediateResult: 0,

      playingField: this.draggedGame.playingField,
      tournamentRound: this.draggedGame.tournamentRound,
      finished: this.draggedGame.finished,
      scenario: this.draggedGame.scenario
    };
  }

  private createGameTwo(droppedGame: TournamentGame, droppedTournamentPlayerId: string): TournamentGame {
    let gameOnePlayerOneAffected = false;
    let gameOnePlayerTwoAffected = false;
    let gameTwoPlayerOneAffected = false;
    let gameTwoPlayerTwoAffected = false;

    if (this.draggedGame.playerOneTournamentPlayerId === this.draggedTournamentPlayerId) {
      // Drag:  X-1 /Drop: X-1
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOneAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // Drag: X-1 / Drop: 1-X
        gameOnePlayerOneAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    } else {
      // Drag: 1-X /Drop: X-1
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // Drag: 1-X /Drop: 1-X
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    }


    return {
      id: droppedGame.id,
      tournamentId: droppedGame.tournamentId,

      playerOnePlayerId: gameTwoPlayerTwoAffected ? droppedGame.playerOnePlayerId :
        gameOnePlayerOneAffected ? this.draggedGame.playerOnePlayerId : this.draggedGame.playerTwoPlayerId,
      playerOneTournamentPlayerId: gameTwoPlayerTwoAffected ? droppedGame.playerOneTournamentPlayerId :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneTournamentPlayerId : this.draggedGame.playerTwoTournamentPlayerId,
      playerOnePlayerName: gameTwoPlayerTwoAffected ? droppedGame.playerOnePlayerName :
        gameOnePlayerOneAffected ? this.draggedGame.playerOnePlayerName : this.draggedGame.playerTwoPlayerName,
      playerOneTeamName: gameTwoPlayerTwoAffected ? droppedGame.playerOneTeamName :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneTeamName : this.draggedGame.playerTwoTeamName,

      playerOneFaction: gameTwoPlayerTwoAffected ? droppedGame.playerOneFaction :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneFaction : this.draggedGame.playerTwoFaction,
      playerOneElo: gameTwoPlayerTwoAffected ? droppedGame.playerOneElo :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneElo : this.draggedGame.playerTwoElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,
      playerOneIntermediateResult: 0,

      playerTwoPlayerId: gameTwoPlayerOneAffected ? droppedGame.playerTwoPlayerId :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoPlayerId : this.draggedGame.playerOnePlayerId,
      playerTwoTournamentPlayerId: gameTwoPlayerOneAffected ? droppedGame.playerTwoTournamentPlayerId :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoTournamentPlayerId : this.draggedGame.playerOneTournamentPlayerId,
      playerTwoPlayerName: gameTwoPlayerOneAffected ? droppedGame.playerTwoPlayerName :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoPlayerName : this.draggedGame.playerOnePlayerName,
      playerTwoTeamName: gameTwoPlayerOneAffected ? droppedGame.playerTwoTeamName :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoTeamName : this.draggedGame.playerOneTeamName,
      playerTwoFaction: gameTwoPlayerOneAffected ? droppedGame.playerTwoFaction :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoFaction : this.draggedGame.playerOneFaction,
      playerTwoElo: gameTwoPlayerOneAffected ? droppedGame.playerTwoElo :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoElo : this.draggedGame.playerOneElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,
      playerTwoIntermediateResult: 0,

      playingField: droppedGame.playingField,
      tournamentRound: droppedGame.tournamentRound,
      finished: droppedGame.finished,
      scenario: droppedGame.scenario
    };
  }


  playedAgainstOthers(tournamentPlayerOneId: string, tournamentPlayerTwoId: string, game: TournamentGame): boolean {

    const that = this;

    let playedAgainstOther = false;

    _.find(this.rankingsForRound, function (rank) {

      if (tournamentPlayerOneId === 'bye' && rank.tournamentPlayerId === tournamentPlayerTwoId) {

        const alreadyHasABye = _.includes(rank.opponentTournamentPlayerIds, 'bye');

        if (alreadyHasABye) {
          that.snackBar.open(rank.playerName + 'already has a BYE ', '', {
            extraClasses: ['snackBar-info'],
            duration: 5000
          });
          playedAgainstOther = true;
        }
        return;
      }
      if (rank.tournamentPlayerId === tournamentPlayerOneId) {
        const pl = _.find(rank.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === tournamentPlayerTwoId;
          });
        if (pl) {
          playedAgainstOther = true;
          if (tournamentPlayerTwoId === game.playerOneTournamentPlayerId) {
            that.snackBar.open(rank.playerName + ' already played against ' + game.playerOnePlayerName, '', {
              extraClasses: ['snackBar-info'],
              duration: 5000
            });
          } else {
            that.snackBar.open(rank.playerName + ' already played against ' + game.playerTwoPlayerName, '', {
              extraClasses: ['snackBar-info'],
              duration: 5000
            });
          }
        }
        return;
      }
    });

    return playedAgainstOther;
  }


  isItMyGame(droppedGame: TournamentGame) {
    if (this.userPlayerData) {
      return (droppedGame.playerOnePlayerId === this.userPlayerData.id) ||
        (droppedGame.playerTwoPlayerId === this.userPlayerData.id);
    }
  }

  isItMyTeamGame(game: TournamentGame) {
    if (this.userPlayerData && this.loggedInUserTeam) {
      return (game.playerOneTeamName === this.loggedInUserTeam) ||
        (game.playerTwoTeamName === this.loggedInUserTeam);
    }
  }


  startAutoScroll() {

    const that = this;

    this.onReachBottomOfPageEvent = new EventEmitter();

    this.onReachBottomOfPageEvent.subscribe( function (x) {

      if (!x) {
        that.onReachBottomOfPageEvent.complete();
      }
      that.autoScrollToTop();
    });

    this.onReachTopOfPageEvent = new EventEmitter();

    this.onReachTopOfPageEvent.subscribe( function (x) {

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
