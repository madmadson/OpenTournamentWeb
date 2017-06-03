import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

@Component({
  selector: 'new-round-dialog',
  templateUrl: './new-round-dialog.html'
})
export class NewRoundDialogComponent {

  suggestedRoundToPlay: number;
  round: number;

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  teamMatch: boolean;

  @Output() onNewRound = new EventEmitter<TournamentManagementConfiguration>();

  constructor(public dialogRef: MdDialogRef<NewRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.teamMatch = data.teamMatch;
    this.round = data.round;
    data.allPlayers$.subscribe(allPlayers => {
      this.suggestedRoundToPlay = Math.round(Math.log2(allPlayers.length));
    });
  }

  pairNewRound() {

    this.onNewRound.emit({
      tournamentId: '',
      round: this.round + 1,
      teamRestriction: this.teamRestriction,
      metaRestriction: this.metaRestriction,
      originRestriction: this.originRestriction,
      countryRestriction: this.countryRestriction,
    });
    this.dialogRef.close();
  }
}
