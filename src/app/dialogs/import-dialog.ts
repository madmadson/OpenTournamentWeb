import {Component, EventEmitter, Inject, Output, NgZone} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

@Component({
  selector: 'import-dialog',
  templateUrl: './import-dialog.html',
  styleUrls: ['./import-dialog.scss']
})
export class ImportDialogComponent {

  @Output() onImportData = new EventEmitter<Boolean>();

  tournament: Tournament;
  playerGames: TournamentGame[];
  playerRankings: TournamentRanking[];
  teamGames: TournamentGame[];
  teamRankings: TournamentRanking[];
  error: boolean;
  importingData: boolean;

  constructor(public dialogRef: MdDialogRef<ImportDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.tournament = data.tournament;
    this.playerGames = data.playerGames;
    this.playerRankings = data.playerRankings;
    this.teamGames = data.teamGames;
    this.teamRankings = data.teamRankings;
    this.error = data.error;
  }

  importData() {

    this.importingData = true;

    setTimeout( () => {
      this.onImportData.emit(true);
      this.dialogRef.close();
    }, 500);
  }
}
