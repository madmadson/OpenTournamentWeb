

import {Tournament} from '../../../../shared/model/tournament';
import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';


@Component({
  selector: 'tournament-info-dialog',
  templateUrl: './tournament-info-dialog.html',
  styleUrls: ['./tournament-info-dialog.scss']
})
export class TournamentInfoDialogComponent {

  tournament: Tournament;

  verySmallDevice: boolean;
  truncateMax: number;

  constructor(public dialogRef: MdDialogRef<TournamentInfoDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    this.tournament = data.tournament;

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.verySmallDevice = true;
      this.truncateMax = 20;
    }  else {
      this.verySmallDevice = false;
      this.truncateMax = 40;
    }
  }

}
