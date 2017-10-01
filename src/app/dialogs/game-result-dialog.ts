import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {GameResult} from '../../../shared/dto/game-result';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {GameConfig, getWarmachineConfig} from '../../../shared/dto/game-config';
import {ArmyList} from '../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {WindowRefService} from '../service/window-ref-service';

import * as _ from 'lodash';

@Component({
  selector: 'game-result-dialog',
  templateUrl: './game-result-dialog.html',
  styleUrls: ['./game-result-dialog.scss']
})
export class GameResultDialogComponent {

  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onGameResultAndNext = new EventEmitter<GameResult>();

  gameModel: TournamentGame;
  givenGame: TournamentGame;

  gameConfig: GameConfig;

  playerOneArmyLists: ArmyList[];
  playerTwoArmyLists: ArmyList[];

  sureButton: boolean;
  isConnected$: Observable<boolean>;

  isAdmin: boolean;
  isCoOrganizer: boolean;

  smallScreen: boolean;
  truncateMax: number;

  selectedWinner: number;
  isTeamMatch: boolean;
  nextUnfinishedGame: TournamentGame;

  constructor(public dialogRef: MdDialogRef<GameResultDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 15;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 25;
    }

    const that = this;

    this.gameConfig = getWarmachineConfig();

    this.givenGame = data.selectedGame;
    this.isAdmin = data.isAdmin;
    this.isCoOrganizer = data.isCoOrganizer;
    this.isTeamMatch = data.isTeamMatch;
    this.nextUnfinishedGame = data.nextUnfinishedGame;

    this.gameModel = TournamentGame.fromJson(this.givenGame);


    if (this.givenGame.finished && this.givenGame.playerOneScore === 1) {
      this.selectedWinner = 1;
    } else if (this.givenGame.finished && this.givenGame.playerTwoScore === 1) {
      this.selectedWinner = 2;
    } else {
      this.selectedWinner = 0;
    }


    this.playerOneArmyLists = [];
    this.playerTwoArmyLists = [];

    this.isConnected$ = Observable.merge(
      Observable.of(this.winRef.nativeWindow.navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));


    _.forEach(data.armyLists, function (list: ArmyList) {
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
  }

  changeWinner() {

    this.sureButton = false;
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

    if (this.selectedWinner === 0) {
      this.sureButton = true;
    } else {
      this.createGameResult();
      this.onGameResult.emit({gameBefore: this.givenGame, gameAfter: this.gameModel});
    }
  }

  enterGameAndNextResultSubmitted() {
    if (this.selectedWinner === 0) {
      this.sureButton = true;
    } else {
      this.createGameResult();
      this.onGameResultAndNext.emit({gameBefore: this.givenGame, gameAfter: this.gameModel});
    }
  }

  private createGameResult() {
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

    if (this.selectedWinner === 1) {
      this.gameModel.playerOneScore = 1;
      this.gameModel.playerTwoScore = 0;
    } else if (this.selectedWinner === 2) {
      this.gameModel.playerOneScore = 0;
      this.gameModel.playerTwoScore = 1;
    } else {
      this.gameModel.playerOneScore = 0;
      this.gameModel.playerTwoScore = 0;
    }

    // console.log('gameAfter: ' + JSON.stringify(this.gameModel));

  }
}
