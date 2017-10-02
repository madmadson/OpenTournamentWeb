import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Tournament} from "../../../../shared/model/tournament";

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
  actualTournament: Tournament;

  creatingRound: boolean;

  @Output() onNewRound = new EventEmitter<TournamentManagementConfiguration>();

  constructor(public dialogRef: MdDialogRef<NewRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.teamMatch = data.teamMatch;
    this.round = data.round;
    this.actualTournament = data.actualTournament;

    this.suggestedRoundToPlay = Math.round(Math.log2(data.allActualTournamentPlayers.length));

  }

  pairNewRound() {

    this.creatingRound = true;

    setTimeout( () => {
      this.onNewRound.emit({
        tournamentId: this.actualTournament.id,
        round: this.round + 1,
        teamRestriction: this.teamRestriction,
        metaRestriction: this.metaRestriction,
        originRestriction: this.originRestriction,
        countryRestriction: this.countryRestriction,
      });
      this.dialogRef.close();
    }, 500);
  }
}
