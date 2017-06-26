import {Component, Inject, Output, EventEmitter} from '@angular/core';

import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';

import {Registration} from '../../../../shared/model/registration';


import {getAllFactions} from '../../../../shared/model/factions';
import {ArmyList} from '../../../../shared/model/armyList';
import * as _ from 'lodash';
import {PlayerRegistrationChange} from '../../../../shared/dto/playerRegistration-change';


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

  @Output() onSetPaymentChecked = new EventEmitter<PlayerRegistrationChange>();
  @Output() onDeleteRegistration = new EventEmitter<Registration>();

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

    console.log(this.playerRegistration.armyListsChecked);
    this.onSetPaymentChecked.emit({
      registration: this.playerRegistration,
      paymentChecked: this.playerRegistration.paymentChecked,
      armyListsChecked: !this.playerRegistration.armyListsChecked,
      playerUploadedArmyLists: this.playerRegistration.playerUploadedArmyLists,
      playerMarkedPayment: this.playerRegistration.playerMarkedPayment
    });

  }

  changePaidForTournament() {

    console.log(this.playerRegistration.armyListsChecked);
    this.onSetPaymentChecked.emit({
      registration: this.playerRegistration,
      paymentChecked: !this.playerRegistration.paymentChecked,
      armyListsChecked: this.playerRegistration.armyListsChecked,
      playerUploadedArmyLists: this.playerRegistration.playerUploadedArmyLists,
      playerMarkedPayment: this.playerRegistration.playerMarkedPayment
    });
  }

  deleteRegistration(registration: Registration) {
    this.onDeleteRegistration.emit(registration);
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
