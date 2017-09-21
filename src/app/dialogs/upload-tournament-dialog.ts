import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';


@Component({
  selector: 'upload-tournament-dialog',
  templateUrl: './upload-tournament-dialog.html'
})
export class UploadTournamentDialogComponent {


  @Output() onUploadTournament = new EventEmitter();

  constructor(public dialogRef: MdDialogRef<UploadTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

  }

  uploadTournament() {

    this.onUploadTournament.emit();
    this.dialogRef.close();
  }
}
