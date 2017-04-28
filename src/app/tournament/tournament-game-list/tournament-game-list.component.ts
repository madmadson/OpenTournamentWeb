import {
  Component, EventEmitter, Inject, Input, OnInit, Output
} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Observable} from 'rxjs/Observable';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import {PairAgainDialogComponent} from '../tournament-round-overview/tournament-round-overview.component';
import {ArmyList} from '../../../../shared/model/armyList';
import {GameConfig, getWarmachineConfig} from '../../../../shared/dto/game-config';
import {GameResult} from '../../../../shared/dto/game-result';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {SwapPlayer} from '../../../../shared/dto/swap-player';


@Component({
  selector: 'tournament-game-list',
  templateUrl: './tournament-game-list.component.html',
  styleUrls: ['./tournament-game-list.component.css']
})
export class TournamentGameListComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyLists$: Observable<ArmyList[]>;
  @Input() gamesForRound: TournamentGame[];
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;

  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapPlayer>();

  userPlayerData: Player;
  currentUserId: string;
  armyLists$: Observable<ArmyList[]>;

  dragStarted: boolean;
  draggedTournamentPlayerId: string;
  draggedTournamentPlayerCurrentOpponentId: string;
  draggedTournamentPlayerOpponentIds: string[];
  draggedGame: TournamentGame;

  rankingsForRound: TournamentRanking[];
  allVisibleGames: TournamentGame[];

  constructor(public dialog: MdDialog,
              private snackBar: MdSnackBar) {
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

  startDrag(event: any, game: TournamentGame, dragTournamentPlayerId: string,
            dragTournamentPlayerOpponentId: string) {

    if (!game.finished) {
      const that = this;

      // firefox foo
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', null);

      this.draggedTournamentPlayerId = dragTournamentPlayerId;
      this.draggedTournamentPlayerCurrentOpponentId = dragTournamentPlayerOpponentId;
      this.draggedGame = game;
      this.dragStarted = true;

      _.each(this.rankingsForRound, function (ranking: TournamentRanking) {
        if (ranking.tournamentPlayerId === dragTournamentPlayerId) {
          console.log('drag opponent ids: ' + ranking.opponentTournamentPlayerIds);
          that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
        }
      });
    }
    return true;
  }

  dragEnable(tournamentPlayerId: string, opponentTournamentPlayerId: string): boolean {

    if (this.draggedTournamentPlayerId === tournamentPlayerId ||
      this.draggedTournamentPlayerId === opponentTournamentPlayerId ||
      _.includes(this.draggedTournamentPlayerOpponentIds, opponentTournamentPlayerId)) {
      return false;
    }
    return true;
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

    const swapPlayer: SwapPlayer = {
      gameOne: newGameOne,
      gameTwo: newGameTwo,
    };

    this.onSwapPlayer.emit(swapPlayer);
  }

  private createGameTwo(droppedGame: TournamentGame, droppedTournamentPlayerId: string) {
    let gameTwoPlayerOnePlayerId: string;
    let gameTwoPlayerOneTournamentPlayerId: string;
    let gameTwoPlayerOnePlayerName: string;
    let gameTwoPlayerOneFaction: string;
    let gameTwoPlayerOneElo: number;

    let gameTwoPlayerTwoPlayerId: string;
    let gameTwoPlayerTwoTournamentPlayerId: string;
    let gameTwoPlayerTwoPlayerName: string;
    let gameTwoPlayerTwoFaction: string;
    let gameTwoPlayerTwoElo: number;

    if (this.draggedGame.playerOneTournamentPlayerId === this.draggedTournamentPlayerId) {
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameTwoPlayerOnePlayerId = this.draggedGame.playerOnePlayerId;
        gameTwoPlayerOneTournamentPlayerId = this.draggedGame.playerOneTournamentPlayerId;
        gameTwoPlayerOnePlayerName = this.draggedGame.playerOnePlayerName;
        gameTwoPlayerOneFaction = this.draggedGame.playerOneFaction;
        gameTwoPlayerOneElo = this.draggedGame.playerOneElo;
      } else {
        gameTwoPlayerTwoPlayerId = this.draggedGame.playerOnePlayerId;
        gameTwoPlayerTwoTournamentPlayerId = this.draggedGame.playerOneTournamentPlayerId;
        gameTwoPlayerTwoPlayerName = this.draggedGame.playerOnePlayerName;
        gameTwoPlayerTwoFaction = this.draggedGame.playerOneFaction;
        gameTwoPlayerTwoElo = this.draggedGame.playerOneElo;
      }
    } else {
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameTwoPlayerOnePlayerId = this.draggedGame.playerTwoPlayerId;
        gameTwoPlayerOneTournamentPlayerId = this.draggedGame.playerTwoTournamentPlayerId;
        gameTwoPlayerOnePlayerName = this.draggedGame.playerTwoPlayerName;
        gameTwoPlayerOneFaction = this.draggedGame.playerTwoFaction;
        gameTwoPlayerOneElo = this.draggedGame.playerTwoElo;
      } else {
        gameTwoPlayerTwoPlayerId = this.draggedGame.playerTwoPlayerId;
        gameTwoPlayerTwoTournamentPlayerId = this.draggedGame.playerTwoTournamentPlayerId;
        gameTwoPlayerTwoPlayerName = this.draggedGame.playerTwoPlayerName;
        gameTwoPlayerTwoFaction = this.draggedGame.playerTwoFaction;
        gameTwoPlayerTwoElo = this.draggedGame.playerTwoElo;
      }
    }


    const newGameTwo: TournamentGame = {
      id: droppedGame.id,
      tournamentId: droppedGame.tournamentId,

      playerOnePlayerId: gameTwoPlayerOnePlayerId ? gameTwoPlayerOnePlayerId : droppedGame.playerOnePlayerId,
      playerOneTournamentPlayerId: gameTwoPlayerOneTournamentPlayerId ?
        gameTwoPlayerOneTournamentPlayerId : droppedGame.playerOneTournamentPlayerId,
      playerOnePlayerName: gameTwoPlayerOnePlayerName ?
        gameTwoPlayerOnePlayerName : droppedGame.playerOnePlayerName,
      playerOneFaction: gameTwoPlayerOneFaction ? gameTwoPlayerOneFaction : droppedGame.playerOneFaction,
      playerOneElo: gameTwoPlayerOneElo ? gameTwoPlayerOneElo : droppedGame.playerOneElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,

      playerTwoPlayerId: gameTwoPlayerTwoPlayerId ? gameTwoPlayerTwoPlayerId : droppedGame.playerTwoPlayerId,
      playerTwoTournamentPlayerId: gameTwoPlayerTwoTournamentPlayerId ?
        gameTwoPlayerTwoTournamentPlayerId : droppedGame.playerTwoTournamentPlayerId,
      playerTwoPlayerName: gameTwoPlayerTwoPlayerName ?
        gameTwoPlayerTwoPlayerName : droppedGame.playerTwoPlayerName,
      playerTwoFaction: gameTwoPlayerTwoFaction ? gameTwoPlayerTwoFaction : droppedGame.playerTwoFaction,
      playerTwoElo: gameTwoPlayerTwoElo ? gameTwoPlayerTwoElo : droppedGame.playerTwoElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,

      playingField: droppedGame.playingField,
      tournamentRound: droppedGame.tournamentRound,
      finished: droppedGame.finished,
      scenario: droppedGame.scenario
    };
    return newGameTwo;
  }

  private createGameOne(droppedGame: TournamentGame, droppedTournamentPlayerId: string) {
    let gameOnePlayerOnePlayerId: string;
    let gameOnePlayerOneTournamentPlayerId: string;
    let gameOnePlayerOnePlayerName: string;
    let gameOnePlayerOneFaction: string;
    let gameOnePlayerOneElo: number;

    let gameOnePlayerTwoPlayerId: string;
    let gameOnePlayerTwoTournamentPlayerId: string;
    let gameOnePlayerTwoPlayerName: string;
    let gameOnePlayerTwoFaction: string;
    let gameOnePlayerTwoElo: number;


    if (this.draggedGame.playerOneTournamentPlayerId === this.draggedTournamentPlayerId) {
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOnePlayerId = droppedGame.playerOnePlayerId;
        gameOnePlayerOneTournamentPlayerId = droppedGame.playerOneTournamentPlayerId;
        gameOnePlayerOnePlayerName = droppedGame.playerOnePlayerName;
        gameOnePlayerOneFaction = droppedGame.playerOneFaction;
        gameOnePlayerOneElo = droppedGame.playerOneElo;
      } else {
        gameOnePlayerOnePlayerId = droppedGame.playerTwoPlayerId;
        gameOnePlayerOneTournamentPlayerId = droppedGame.playerTwoTournamentPlayerId;
        gameOnePlayerOnePlayerName = droppedGame.playerTwoPlayerName;
        gameOnePlayerOneFaction = droppedGame.playerTwoFaction;
        gameOnePlayerOneElo = droppedGame.playerTwoElo;
      }
    } else {
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoPlayerId = droppedGame.playerOnePlayerId;
        gameOnePlayerTwoTournamentPlayerId = droppedGame.playerOneTournamentPlayerId;
        gameOnePlayerTwoPlayerName = droppedGame.playerOnePlayerName;
        gameOnePlayerTwoFaction = droppedGame.playerOneFaction;
        gameOnePlayerTwoElo = droppedGame.playerOneElo;
      } else {
        gameOnePlayerTwoPlayerId = droppedGame.playerTwoPlayerId;
        gameOnePlayerTwoTournamentPlayerId = droppedGame.playerTwoTournamentPlayerId;
        gameOnePlayerTwoPlayerName = droppedGame.playerTwoPlayerName;
        gameOnePlayerTwoFaction = droppedGame.playerTwoFaction;
        gameOnePlayerTwoElo = droppedGame.playerTwoElo;
      }
    }

    const newGameOne: TournamentGame = {
      id: this.draggedGame.id,
      tournamentId: this.draggedGame.tournamentId,

      playerOnePlayerId: gameOnePlayerOnePlayerId ? gameOnePlayerOnePlayerId : this.draggedGame.playerOnePlayerId,
      playerOneTournamentPlayerId: gameOnePlayerOneTournamentPlayerId ?
        gameOnePlayerOneTournamentPlayerId : this.draggedGame.playerOneTournamentPlayerId,
      playerOnePlayerName: gameOnePlayerOnePlayerName ? gameOnePlayerOnePlayerName : this.draggedGame.playerOnePlayerName,
      playerOneFaction: gameOnePlayerOneFaction ? gameOnePlayerOneFaction : this.draggedGame.playerOneFaction,
      playerOneElo: gameOnePlayerOneElo ? gameOnePlayerOneElo : this.draggedGame.playerOneElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,

      playerTwoPlayerId: gameOnePlayerTwoPlayerId ? gameOnePlayerTwoPlayerId : this.draggedGame.playerTwoPlayerId,
      playerTwoTournamentPlayerId: gameOnePlayerTwoTournamentPlayerId ?
        gameOnePlayerTwoTournamentPlayerId : this.draggedGame.playerTwoTournamentPlayerId,
      playerTwoPlayerName: gameOnePlayerTwoPlayerName ?
        gameOnePlayerTwoPlayerName : this.draggedGame.playerTwoPlayerName,
      playerTwoFaction: gameOnePlayerTwoFaction ? gameOnePlayerTwoFaction : this.draggedGame.playerTwoFaction,
      playerTwoElo: gameOnePlayerTwoElo ? gameOnePlayerTwoElo : this.draggedGame.playerTwoElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,

      playingField: this.draggedGame.playingField,
      tournamentRound: this.draggedGame.tournamentRound,
      finished: this.draggedGame.finished,
      scenario: this.draggedGame.scenario
    };
    return newGameOne;
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

      const dialogRef = this.dialog.open(GameResultDialogComponent, {
        data: {
          selectedGame: selectedGame,
          armyLists$: this.armyLists$
        },
      });
      const eventSubscribe = dialogRef.componentInstance.onGameResult
        .subscribe((gameResult: GameResult) => {

          if (gameResult !== undefined) {

            this.onGameResult.emit(gameResult);
          }
        });
      dialogRef.afterClosed().subscribe(() => {

        eventSubscribe.unsubscribe();
      });
    }
  }

  myGameOrAdmin(selectedGame: TournamentGame) {
    return (selectedGame.playerOnePlayerId === this.currentUserId && !selectedGame.finished) ||
      (selectedGame.playerTwoPlayerId === this.currentUserId && !selectedGame.finished) ||
      this.currentUserId === this.actualTournament.creatorUid;
}

  isItMyGame(droppedGame: TournamentGame) {
    if (this.userPlayerData) {
      return (droppedGame.playerOnePlayerId === this.userPlayerData.id) ||
        (droppedGame.playerTwoPlayerId === this.userPlayerData.id);
    }
  }
}


@Component({
  selector: 'game-result-dialog',
  templateUrl: './game-result-dialog.html',
  styleUrls: ['./tournament-game-list.component.css']
})
export class GameResultDialogComponent {

  @Output() onGameResult = new EventEmitter<GameResult>();

  gameModel: TournamentGame;
  givenGame: TournamentGame;

  gameConfig: GameConfig;

  playerOneArmyLists$: Observable<ArmyList[]>;
  playerTwoArmyLists$: Observable<ArmyList[]>;

  sureButton: boolean;

  constructor(public dialogRef: MdDialogRef<PairAgainDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private snackBar: MdSnackBar) {

    // TODO make this generic
    this.gameConfig = getWarmachineConfig();

    this.givenGame = this.data.selectedGame;
    this.gameModel = TournamentGame.fromJson(this.givenGame);


    this.playerOneArmyLists$ = data.armyLists$.map(armyLists => armyLists.filter((list: ArmyList) => {
      return (list.playerId === data.selectedGame.playerOnePlayerId);
    }));

    this.playerTwoArmyLists$ = data.armyLists$.map(armyLists => armyLists.filter((list: ArmyList) => {
      return (list.playerId === data.selectedGame.playerTwoPlayerId);
    }));
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

  decreasePlayerOneVP() {
    const actualVP = this.gameModel.playerOneVictoryPoints;
    if (actualVP > this.gameConfig.points[2].min) {
      this.gameModel.playerOneVictoryPoints = (this.gameModel.playerOneVictoryPoints - 1);
    }
  }

  increasePlayerOneVP() {
    const actualVP = this.gameModel.playerOneVictoryPoints;
    if (actualVP < this.gameConfig.points[1].max) {
      this.gameModel.playerOneVictoryPoints = (this.gameModel.playerOneVictoryPoints + 1);
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

  decreasePlayerTwoCP() {
    const actualCP = this.gameModel.playerTwoControlPoints;
    if (actualCP > this.gameConfig.points[1].min) {
      this.gameModel.playerTwoControlPoints = (this.gameModel.playerTwoControlPoints - 1);
    }
  }

  increasePlayerTwoCP() {
    const actualCP = this.gameModel.playerTwoControlPoints;
    if (actualCP < this.gameConfig.points[1].max) {
      this.gameModel.playerTwoControlPoints = (this.gameModel.playerTwoControlPoints + 1);
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
    if (actualVP < this.gameConfig.points[1].max) {
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

    this.onGameResult.emit({gameBefore: this.givenGame, gameAfter: this.gameModel});
    this.dialogRef.close();
  }
}
