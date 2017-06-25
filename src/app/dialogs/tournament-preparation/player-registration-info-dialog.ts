import {Component, Inject} from '@angular/core';

import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';

import {Registration} from '../../../../shared/model/registration';


import {getAllFactions} from '../../../../shared/model/factions';
import {ArmyList} from '../../../../shared/model/armyList';
import * as _ from 'lodash';


@Component({
  selector: 'player-registration-info-dialog',
  templateUrl: './player-registration-info-dialog.html',
  styleUrls: ['./player-registration-info-dialog.scss']
})
export class PlayerRegistrationInfoDialogComponent {

  playerRegistration: Registration;
  armyLists: ArmyList[];

  factions: string[];
  isAdmin: boolean;

  constructor(public dialog: MdDialog,
              public dialogRef: MdDialogRef<PlayerRegistrationInfoDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    const that = this;

    this.isAdmin = data.isAdmin;
    this.playerRegistration = data.playerRegistration;
    this.factions = getAllFactions();

    if (this.playerRegistration) {

      this.armyLists = _.filter(data.armyLists, function (armyList: ArmyList) {
        if (that.playerRegistration !== undefined) {
          return armyList.playerId === that.playerRegistration.playerId;
        }
      });
    }
  }
  showArmyList(armyList: ArmyList) {
    this.dialog.open(ShowSingleArmyListDialogComponent, {
      data: {
        armyList: armyList
      }
    });
  }
  changeArmyListForTournament() {

    console.log(this.playerRegistration.armyListForTournament);
  }

  changePaidForTournament() {

    console.log(this.playerRegistration.armyListForTournament);
  }
}

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
