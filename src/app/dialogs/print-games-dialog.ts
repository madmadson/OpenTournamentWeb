import {Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {WindowRefService} from '../service/window-ref-service';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'print-games-dialog',
  templateUrl: './print-games-dialog.html',
  styleUrls: ['./print-games-dialog.scss']
})
export class PrintGamesDialogComponent implements OnDestroy {


  tournament: Tournament;
  games$: Observable<TournamentGame[]>;
  scenario: string;
  round: number;

  teamMatch: boolean;
  window: any;

  subscription: Subscription;

  @ViewChild('printarea') printarea: ElementRef;

  constructor(public dialogRef: MdDialogRef<PrintGamesDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    this.tournament = data.tournament;
    this.games$ = data.games$;
    this.round = data.round;
    this.teamMatch = data.teamMatch;

    this.subscription = data.games$.subscribe((games: TournamentGame[]) => {
      if (games[0]) {
        this.scenario = games[0].scenario;
      }
    });

    this.window = this.winRef.nativeWindow;
  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  printLists() {
    const printWindow = this.window.open();
    printWindow.document.write(this.printarea.nativeElement.innerHTML);
    printWindow.print();
    printWindow.close();
    this.dialogRef.close();
  }
}
