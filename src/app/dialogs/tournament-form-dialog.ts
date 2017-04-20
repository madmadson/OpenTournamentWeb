import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {StartTournamentDialogComponent} from '../tournament/tournament-preparation/tournament-preparation.component';

@Component({
  selector: 'tournament-form-dialog',
  templateUrl: './tournament-form-dialog.html'
})
export class TournamentFormDialogComponent {

  @Output() onSaveTournament = new EventEmitter<Tournament>();

  tournament: Tournament;

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.tournament = data.tournament;
  }

  handleSaveTournament(tournament: Tournament) {

    this.onSaveTournament.emit(tournament);
  }

}
