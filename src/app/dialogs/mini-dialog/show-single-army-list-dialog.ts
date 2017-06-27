import {Component, Inject} from '@angular/core';
import {ArmyList} from '../../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';


@Component({
  selector: 'single-list-dialog',
  template: `
    <h3>{{armyList.name}}</h3>
    <pre>{{armyList.list}}</pre>
  `
})
export class ShowSingleArmyListDialogComponent {

  armyList: ArmyList;

  constructor(public dialogRef: MdDialogRef<ShowSingleArmyListDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.armyList = data.armyList;
  }
}
