import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Observable} from 'rxjs/Observable';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import {PairAgainDialogComponent} from '../tournament-round-overview/tournament-round-overview.component';
import {ArmyList} from '../../../../shared/model/armyList';
import {GameConfig, getWarmachineConfig} from '../../../../shared/dto/game-config';
import {GameResult} from '../../../../shared/dto/game-result';

@Component({
  selector: 'tournament-game-list',
  templateUrl: './tournament-game-list.component.html',
  styleUrls: ['./tournament-game-list.component.css']
})
export class TournamentGameListComponent implements OnInit {

  @Input() armyLists$: Observable<ArmyList[]>;
  @Input() gamesForRound$: Observable<TournamentGame[]>;
  @Input() userPlayerData: Player;

  @Output() onGameResult = new EventEmitter<GameResult>();

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
  }


  openGameResultDialog(selectedGame: TournamentGame) {


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

  isItMyGame(playerOne_id: string, playerTwo_id: string) {
    if (this.userPlayerData) {
      return (playerOne_id === this.userPlayerData.id) || (playerTwo_id === this.userPlayerData.id);
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
  armyLists$: Observable<ArmyList[]>;

  gameConfig: GameConfig;

  playerOneArmyLists$: Observable<ArmyList[]>;
  playerTwoArmyLists$: Observable<ArmyList[]>;

  constructor(public dialogRef: MdDialogRef<PairAgainDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private snackBar: MdSnackBar) {

    // TODO make this generic
    this.gameConfig = getWarmachineConfig();

    this.givenGame = this.data.selectedGame;
    this.gameModel = TournamentGame.fromJson(this.givenGame);

    this.armyLists$ = data.armyLists$;

    this.playerOneArmyLists$ = this.armyLists$.map(armyLists => armyLists.filter((list: ArmyList) => {
      return (list.playerId === data.selectedGame.playerOnePlayerId);
    }));

    this.playerTwoArmyLists$ = this.armyLists$.map(armyLists => armyLists.filter((list: ArmyList) => {
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
      this.snackBar.open('Attention! No match winner.', '', {
        duration: 5000
      });
    }

    this.gameModel.id = this.givenGame.id;
    this.gameModel.finished = true;

    this.onGameResult.emit({gameBefore: this.givenGame, gameAfter: this.gameModel});
    this.dialogRef.close();
  }
}
