import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {WindowRefService} from '../service/window-ref-service';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {TournamentGame} from "../../../shared/model/tournament-game";

@Component({
  selector: 'print-games-dialog',
  templateUrl: './print-games-dialog.html'
})
export class PrintGamesDialogComponent {

  tournament: Tournament;
  games$: Observable<TournamentGame[]>;
  scenario: string;
  round: number;


  window: any;

  @ViewChild('printarea') printarea: ElementRef;

  constructor(public dialogRef: MdDialogRef<PrintGamesDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    this.tournament = data.tournament;
    this.games$ = data.games$;
    this.round = data.round;

    data.games$.subscribe((games: TournamentGame[]) => {
       this.scenario = games[0].scenario;
    });

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
