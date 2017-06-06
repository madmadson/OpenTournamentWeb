import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';



@Component({
  selector: 'finish-tournament-dialog',
  templateUrl: './finish-tournament-dialog.html'
})
export class FinishTournamentDialogComponent {

  suggestedRoundToPlay: number;
  round: number;

  @Output() onEndTournament = new EventEmitter();

  constructor(public dialogRef: MdDialogRef<FinishTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.round = data.round;
    data.allPlayers$.subscribe(allPlayers => {
      this.suggestedRoundToPlay = Math.round(Math.log2(allPlayers.length));
    });
  }

  endTournament() {

    this.onEndTournament.emit();
    this.dialogRef.close();
  }
}
