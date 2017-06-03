import {
  AfterContentChecked,
  Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2
} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Observable} from 'rxjs/Observable';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';

import {ArmyList} from '../../../../shared/model/armyList';
import {GameConfig, getWarmachineConfig} from '../../../../shared/dto/game-config';
import {GameResult} from '../../../../shared/dto/game-result';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {SwapGames} from '../../../../shared/dto/swap-player';
import {WindowRefService} from '../../service/window-ref-service';
import {GlobalEventService} from 'app/service/global-event-service';
import {getAllScenarios} from '../../../../shared/model/szenarios';
import {ScenarioSelectedModel} from '../../../../shared/dto/scenario-selected-model';


@Component({
  selector: 'tournament-game-list',
  templateUrl: './tournament-game-list.component.html',
  styleUrls: ['./tournament-game-list.component.scss']
})
export class TournamentGameListComponent implements OnInit, AfterContentChecked {

  @Input() actualTournament: Tournament;
  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyLists$: Observable<ArmyList[]>;
  @Input() gamesForRound: TournamentGame[];
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() teamMatch: boolean;

  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onScenarioSelected = new EventEmitter<ScenarioSelectedModel>();

  userPlayerData: Player;
  currentUserId: string;
  armyLists$: Observable<ArmyList[]>;

  dragStarted: boolean;
  draggedTournamentPlayerId: string;
  draggedGameTeamName: string;
  draggedTournamentPlayerCurrentOpponentId: string;
  draggedTournamentPlayerOpponentIds: string[];
  draggedGame: TournamentGame;

  rankingsForRound: TournamentRanking[];
  allVisibleGames: TournamentGame[];

  smallScreen: boolean;
  swapPlayerMode: boolean;
  scenarios: string[];

  selectedScenario: string;

  constructor(public dialog: MdDialog,
              private snackBar: MdSnackBar,
              private renderer: Renderer2,
              private messageService: GlobalEventService,
              private winRef: WindowRefService) {
    this.smallScreen = this.winRef.nativeWindow.screen.width < 1024;
    this.scenarios = getAllScenarios();
  }

  ngOnInit() {

    this.armyLists$ = this.actualTournamentArmyLists$;

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;
    });

    this.rankingsForRound$.subscribe(rankings => {
      this.rankingsForRound = rankings;
    });

    this.allVisibleGames = this.gamesForRound;
  }

  ngAfterContentChecked(): void {

    if (this.gamesForRound[0]) {
      this.selectedScenario = this.gamesForRound[0].scenario;
    }
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

  clickSwapPlayerPlayerTwo(event: any, game: TournamentGame) {

    event.stopPropagation();

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

    this.swapPlayerMode = false;
    this.dragStarted = false;

    this.messageService.broadcast('swapPlayerMode', false);
  }

  confirmSwapPlayer(event: any, droppedGame: TournamentGame,
                    droppedTournamentPlayerId: string,
                    droppedTournamentPlayerOpponentId: string) {

    if (this.dragStarted) {

      event.stopPropagation();

      if (!droppedGame.finished && this.draggedGame) {
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

  startDrag(event: any, game: TournamentGame, dragTournamentPlayerId: string,
            dragTournamentPlayerOpponentId: string) {

    event.preventDefault();
    event.stopPropagation();

    if (!this.smallScreen) {

      if (!game.finished && this.actualTournament.creatorUid === this.userPlayerData.userUid) {
        const that = this;

        console.log('drag started');

        // firefox foo
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', null);

        this.draggedTournamentPlayerId = dragTournamentPlayerId;
        this.draggedTournamentPlayerCurrentOpponentId = dragTournamentPlayerOpponentId;
        this.draggedGame = game;
        this.dragStarted = true;

        _.each(this.rankingsForRound, function (ranking: TournamentRanking) {
          if (ranking.tournamentPlayerId === dragTournamentPlayerId) {
            that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
          }
        });
      }
    }
    return true;
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


  dragOver(event: any, tournamentPlayerId: string, opponentTournamentPlayerId: string) {

    event.preventDefault();

    if (this.draggedGame) {
      if (this.draggedTournamentPlayerId === tournamentPlayerId ||
        this.draggedTournamentPlayerId === opponentTournamentPlayerId ||
        _.includes(this.draggedTournamentPlayerOpponentIds, opponentTournamentPlayerId)) {
        event.target.classList.add('drag-over-disable');
      } else {
        event.target.classList.add('drag-over-enable');
      }
    }
    return true;
  }

  dragLeave(event: any) {
    event.preventDefault();

    event.target.classList.remove('drag-over-disable');
    event.target.classList.remove('drag-over-enable');

    return false;
  }


  endDrag(event: any) {

    event.target.classList.remove('drag-over-disable');
    event.target.classList.remove('drag-over-enable');

    this.dragStarted = false;
    if (this.smallScreen) {
      this.renderer.removeClass(document.body, 'prevent-scrolling');
    }

    return false;
  }

  dropped(event: any, droppedGame: TournamentGame,
          droppedTournamentPlayerId: string,
          droppedTournamentPlayerOpponentId: string) {

    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    event.target.classList.remove('drag-over-disable');
    event.target.classList.remove('drag-over-enable');
    if (this.smallScreen) {
      this.renderer.removeClass(document.body, 'prevent-scrolling');
    }

    if (!droppedGame.finished && this.draggedGame) {

      // Don't do anything if dropping the same column we're dragging.
      if (droppedTournamentPlayerId !== this.draggedTournamentPlayerId &&
        droppedGame !== this.draggedGame) {
        if (!this.playedAgainstOthers(this.draggedTournamentPlayerId, droppedTournamentPlayerOpponentId, droppedGame) &&
          !this.playedAgainstOthers(droppedTournamentPlayerId, this.draggedTournamentPlayerCurrentOpponentId, this.draggedGame)) {
          this.doSwapping(droppedGame, droppedTournamentPlayerId);
        }
      }
    }
    this.dragStarted = false;
    this.draggedTournamentPlayerId = undefined;
    this.draggedTournamentPlayerCurrentOpponentId = undefined;
    this.draggedGame = undefined;


    return false;
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

    _.each(this.rankingsForRound, function (rank) {

      if (rank.tournamentPlayerId === tournamentPlayerOneId) {
        const pl = _.find(rank.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === tournamentPlayerTwoId;
          });
        if (pl) {
          playedAgainstOther = true;
          if (tournamentPlayerTwoId === game.playerOneTournamentPlayerId) {
            that.snackBar.open(rank.playerName + ' already played against ' + game.playerOnePlayerName, '', {
              duration: 5000
            });
          } else {
            that.snackBar.open(rank.playerName + ' already played against ' + game.playerTwoPlayerName, '', {
              duration: 5000
            });
          }
        }
      }
    });

    return playedAgainstOther;
  }


  openGameResultDialog(selectedGame: TournamentGame) {

    if (this.myGameOrAdmin(selectedGame)) {

      const admin = this.isAdmin();

      const dialogRef = this.dialog.open(GameResultDialogComponent, {
        data: {
          selectedGame: selectedGame,
          armyLists$: this.armyLists$,
          admin: admin
        },
      });
      const eventSubscribe = dialogRef.componentInstance.onGameResult
        .subscribe((gameResult: GameResult) => {

          if (gameResult !== undefined) {

            if (this.selectedScenario) {
              gameResult.gameAfter.scenario = this.selectedScenario;
            }

            this.onGameResult.emit(gameResult);
            if (!this.teamMatch) {
              this.dialog.closeAll();
            } else {
              dialogRef.close();
            }
          }
        });
      dialogRef.afterClosed().subscribe(() => {

        eventSubscribe.unsubscribe();
        if (!this.teamMatch) {
          this.dialog.closeAll();
        }
      });

    }
  }

  myGameOrAdmin(selectedGame: TournamentGame) {
    if (this.userPlayerData) {
      return (selectedGame.playerOnePlayerId === this.userPlayerData.id && !selectedGame.finished) ||
        (selectedGame.playerTwoPlayerId === this.userPlayerData.id && !selectedGame.finished) ||
        this.currentUserId === this.actualTournament.creatorUid;
    }
  }

  isItMyGame(droppedGame: TournamentGame) {
    if (this.userPlayerData) {
      return (droppedGame.playerOnePlayerId === this.userPlayerData.id) ||
        (droppedGame.playerTwoPlayerId === this.userPlayerData.id);
    }
  }

  isAdmin(): boolean {
    if (this.userPlayerData) {
      return this.actualTournament.creatorUid === this.currentUserId;
    }
  }
}


@Component({
  selector: 'game-result-dialog',
  templateUrl: './game-result-dialog.html',
  styleUrls: ['./tournament-game-list.component.scss']
})
export class GameResultDialogComponent {

  @Output() onGameResult = new EventEmitter<GameResult>();

  gameModel: TournamentGame;
  givenGame: TournamentGame;

  gameConfig: GameConfig;

  playerOneArmyLists: ArmyList[];
  playerTwoArmyLists: ArmyList[];

  sureButton: boolean;
  isConnected: Observable<boolean>;

  admin: boolean;

  constructor(public dialogRef: MdDialogRef<GameResultDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    const that = this;

    // TODO make this generic
    this.gameConfig = getWarmachineConfig();

    this.givenGame = data.selectedGame;
    this.admin = data.admin;

    this.gameModel = TournamentGame.fromJson(this.givenGame);

    this.playerOneArmyLists = [];
    this.playerTwoArmyLists = [];

    this.isConnected = Observable.merge(
      Observable.of(this.winRef.nativeWindow.navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));

    data.armyLists$.subscribe((armyLists: ArmyList[]) => {

      _.each(armyLists, function (list: ArmyList) {
        if (list.tournamentPlayerId && list.tournamentPlayerId === data.selectedGame.playerOneTournamentPlayerId) {
          that.playerOneArmyLists.push(list);
        } else if (list.playerId && list.playerId === data.selectedGame.playerOnePlayerId) {
          that.playerOneArmyLists.push(list);
        } else if (list.tournamentPlayerId && list.tournamentPlayerId === data.selectedGame.playerTwoTournamentPlayerId) {
          that.playerTwoArmyLists.push(list);
        } else if (list.playerId && list.playerId === data.selectedGame.playerTwoPlayerId) {
          that.playerTwoArmyLists.push(list);
        }
      });
    });
  }

  playerOneWin() {
    this.gameModel.playerOneScore = 1;
    if (this.gameModel.playerTwoScore === 1) {
      this.gameModel.playerTwoScore = 0;
    }
  }

  playerOneNotWin() {
    this.gameModel.playerOneScore = 0;
  }

  playerTwoWin() {
    this.gameModel.playerTwoScore = 1;
    if (this.gameModel.playerOneScore === 1) {
      this.gameModel.playerOneScore = 0;
    }
  }

  playerTwoNotWin() {
    this.gameModel.playerTwoScore = 0;
  }

  decreasePlayerOneCP() {
    const actualCP = this.gameModel.playerOneControlPoints;
    if (actualCP > this.gameConfig.points[1].min) {
      this.gameModel.playerOneControlPoints = (this.gameModel.playerOneControlPoints - 1);
    }
  }

  increasePlayerOneCP() {
    const actualCP = this.gameModel.playerOneControlPoints;
    if (actualCP < this.gameConfig.points[1].max) {
      this.gameModel.playerOneControlPoints = (this.gameModel.playerOneControlPoints + 1);
    }
  }

  correctPlayerOneCPInput() {
    const actualCP = this.gameModel.playerOneControlPoints;
    if (actualCP > this.gameConfig.points[1].max) {
      this.gameModel.playerOneControlPoints = this.gameConfig.points[1].max;
    }
    if (actualCP < this.gameConfig.points[1].min) {
      this.gameModel.playerOneControlPoints = this.gameConfig.points[1].min;
    }
  }

  increasePlayerOneVP() {
    const actualVP = this.gameModel.playerOneVictoryPoints;
    if (actualVP < this.gameConfig.points[2].max) {
      this.gameModel.playerOneVictoryPoints = (this.gameModel.playerOneVictoryPoints + 1);
    }
  }

  decreasePlayerOneVP() {
    const actualVP = this.gameModel.playerOneVictoryPoints;
    if (actualVP > this.gameConfig.points[2].min) {
      this.gameModel.playerOneVictoryPoints = (this.gameModel.playerOneVictoryPoints - 1);
    }
  }

  correctPlayerOneVPInput() {
    const actualVP = this.gameModel.playerOneVictoryPoints;
    if (actualVP > this.gameConfig.points[2].max) {
      this.gameModel.playerOneVictoryPoints = this.gameConfig.points[2].max;
    }
    if (actualVP < this.gameConfig.points[2].min) {
      this.gameModel.playerOneVictoryPoints = this.gameConfig.points[2].min;
    }
  }

  increasePlayerTwoCP() {
    const actualCP = this.gameModel.playerTwoControlPoints;
    if (actualCP < this.gameConfig.points[1].max) {
      this.gameModel.playerTwoControlPoints = (this.gameModel.playerTwoControlPoints + 1);
    }
  }

  decreasePlayerTwoCP() {
    const actualCP = this.gameModel.playerTwoControlPoints;
    if (actualCP > this.gameConfig.points[1].min) {
      this.gameModel.playerTwoControlPoints = (this.gameModel.playerTwoControlPoints - 1);
    }
  }

  correctPlayerTwoCPInput() {
    const actualCP = this.gameModel.playerTwoControlPoints;
    if (actualCP > this.gameConfig.points[1].max) {
      this.gameModel.playerTwoControlPoints = this.gameConfig.points[1].max;
    }
    if (actualCP < this.gameConfig.points[1].min) {
      this.gameModel.playerTwoControlPoints = this.gameConfig.points[1].min;
    }
  }

  decreasePlayerTwoVP() {
    const actualVP = this.gameModel.playerTwoVictoryPoints;
    if (actualVP > this.gameConfig.points[2].min) {
      this.gameModel.playerTwoVictoryPoints = (this.gameModel.playerTwoVictoryPoints - 1);
    }
  }

  increasePlayerTwoVP() {
    const actualVP = this.gameModel.playerTwoVictoryPoints;
    if (actualVP < this.gameConfig.points[2].max) {
      this.gameModel.playerTwoVictoryPoints = (this.gameModel.playerTwoVictoryPoints + 1);
    }
  }

  correctPlayerTwoVPInput() {
    const actualVP = this.gameModel.playerTwoVictoryPoints;
    if (actualVP > this.gameConfig.points[2].max) {
      this.gameModel.playerTwoVictoryPoints = this.gameConfig.points[2].max;
    }
    if (actualVP < this.gameConfig.points[2].min) {
      this.gameModel.playerTwoVictoryPoints = this.gameConfig.points[2].min;
    }
  }


  enterGameResultSubmitted() {

    if (this.gameModel.playerOneScore === 0 && this.gameModel.playerTwoScore === 0) {
      this.sureButton = true;
    } else {
      this.pushGameResult();
    }
  }

  private pushGameResult() {
    this.gameModel.id = this.givenGame.id;
    this.gameModel.finished = true;

    if (!this.gameModel.playerOneVictoryPoints) {
      this.gameModel.playerOneVictoryPoints = 0;
    }
    if (!this.gameModel.playerOneControlPoints) {
      this.gameModel.playerOneControlPoints = 0;
    }
    if (!this.gameModel.playerTwoVictoryPoints) {
      this.gameModel.playerTwoVictoryPoints = 0;
    }
    if (!this.gameModel.playerTwoVictoryPoints) {
      this.gameModel.playerTwoVictoryPoints = 0;
    }

    this.onGameResult.emit({gameBefore: this.givenGame, gameAfter: this.gameModel});

  }
}
