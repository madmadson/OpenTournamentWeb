import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {ArmyList} from '../../../shared/model/armyList';
import {WindowRefService} from '../service/window-ref-service';

import * as _ from 'lodash';

@Component({
  selector: 'print-army-lists-dialog',
  templateUrl: './print-army-lists-dialog.html',
  styleUrls: ['./print-army-lists-dialog.scss']
})
export class PrintArmyListsDialogComponent {

  tournament: Tournament;
  armyLists$: Observable<ArmyList[]>;

  window: any;

  @ViewChild('printarea') printarea: ElementRef;

  constructor(public dialogRef: MdDialogRef<PrintArmyListsDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    this.tournament = data.tournament;
    this.armyLists$ = data.armyLists$.map(armyLists => _.sortBy(armyLists, ['teamName', 'playerName']));

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
