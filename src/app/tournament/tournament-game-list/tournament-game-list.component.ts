import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Observable} from 'rxjs/Observable';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {PairAgainDialogComponent} from '../tournament-round-overview/tournament-round-overview.component';

@Component({
  selector: 'tournament-game-list',
  templateUrl: './tournament-game-list.component.html',
  styleUrls: ['./tournament-game-list.component.css']
})
export class TournamentGameListComponent implements OnInit {

  @Input() gamesForRound$: Observable<TournamentGame[]>;
  @Input() userPlayerData: Player;

  @Output() onGameResult = new EventEmitter<TournamentGame>();

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
  }


  openGameResultDialog(selectedGame: TournamentGame) {


    const dialogRef = this.dialog.open(GameResultDialogComponent, {
      data: {
        selectedGame: selectedGame
      },
    });
    const eventSubscribe = dialogRef.componentInstance.onPairAgain
      .subscribe((game: TournamentGame) => {

        if (game !== undefined) {

          this.onGameResult.emit(game);
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

  @Output() onPairAgain = new EventEmitter<TournamentGame>();

  gameModel: TournamentGame;

  constructor(public dialogRef: MdDialogRef<PairAgainDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.gameModel = data.selectedGame;
  }

  enterGameResult() {

    this.onPairAgain.emit();
    this.dialogRef.close();
  }
}
