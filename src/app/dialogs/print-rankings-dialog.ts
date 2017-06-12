import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {WindowRefService} from '../service/window-ref-service';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';

@Component({
  selector: 'print-rankings-dialog',
  templateUrl: './print-rankings-dialog.html',
  styleUrls: ['./print-rankings-dialog.scss']
})
export class PrintRankingsDialogComponent {

  tournament: Tournament;
  rankings$: Observable<TournamentRanking[]>;

  round: number;
  window: any;

  teamMatch: boolean;

  @ViewChild('printarea') printarea: ElementRef;

  constructor(public dialogRef: MdDialogRef<PrintRankingsDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    this.tournament = data.tournament;
    this.round = data.round;
    this.teamMatch = data.teamMatch;

    if (!data.teamMatch) {
      this.rankings$ = data.rankings$.map(rankings => {
        return _.orderBy(rankings, ['score', 'sos', 'controlPoints', 'victoryPoints'], ['desc', 'desc', 'desc', 'desc']);
      });
    } else {
      this.rankings$ = data.rankings$.map(rankings => {
        return _.orderBy(rankings, ['score', 'secondScore', 'controlPoints', 'victoryPoints'], ['desc', 'desc', 'desc', 'desc']);
      });
    }

    this.window = this.winRef.nativeWindow;
  }

  printLists() {
    const printWindow = this.window.open();
    printWindow.document.write(this.printarea.nativeElement.innerHTML);
    printWindow.print();
    printWindow.close();
    this.dialogRef.close();
  }
}
