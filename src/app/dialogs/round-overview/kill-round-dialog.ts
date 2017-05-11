import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {TournamentManagementConfiguration} from "../../../../shared/dto/tournament-management-configuration";
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
@Component({
  selector: 'kill-round-dialog',
  templateUrl: './kill-round-dialog.html'
})
export class KillRoundDialogComponent {

  @Output() onKillRound = new EventEmitter<TournamentManagementConfiguration>();

  enableKill: boolean;

  constructor(public dialogRef: MdDialogRef<KillRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  killIt() {

    this.onKillRound.emit({
      tournamentId: '',
      round: this.data.round,
      teamRestriction: false,
      metaRestriction: false,
      originRestriction: false,
      countryRestriction: false,
    });
    this.dialogRef.close();
  }
}
