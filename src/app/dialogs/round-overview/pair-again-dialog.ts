import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
@Component({
  selector: 'pair-again-dialog',
  templateUrl: '../../dialogs/round-overview/pair-again-dialog.html'
})
export class PairAgainDialogComponent {

  @Output() onPairAgain = new EventEmitter<TournamentManagementConfiguration>();

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  constructor(public dialogRef: MdDialogRef<PairAgainDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  pairRoundAgain() {

    this.onPairAgain.emit({
      tournamentId: '',
      round: this.data.round,
      teamRestriction: this.teamRestriction,
      metaRestriction: this.metaRestriction,
      originRestriction: this.originRestriction,
      countryRestriction: this.countryRestriction,
    });
    this.dialogRef.close();
  }
}