import {Component, Inject} from '@angular/core';
import {ArmyList} from '../../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';


@Component({
  selector: 'single-list-dialog',
  template: `
    <h3>{{armyList.name}}</h3>
    <md-dialog-content>
      <pre>{{armyList.list}}</pre>
    </md-dialog-content>
    <div md-dialog-actions>
      <button type="button" color="primary" md-raised-button (click)="dialogRef.close()">Close Dialog</button>
    </div>
  `
})
export class ShowSingleArmyListDialogComponent {

  armyList: ArmyList;

  constructor(public dialogRef: MdDialogRef<ShowSingleArmyListDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.armyList = data.armyList;
  }
}
