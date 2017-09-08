import {Component, EventEmitter, Inject, Output} from '@angular/core';

import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';

import {Registration} from '../../../../shared/model/registration';


import {getAllFactions} from '../../../../shared/model/factions';
import {ArmyList} from '../../../../shared/model/armyList';
import * as _ from 'lodash';
import {PlayerRegistrationChange} from '../../../../shared/dto/playerRegistration-change';
import {ShowSingleArmyListDialogComponent} from '../mini-dialog/show-single-army-list-dialog';
import {WindowRefService} from '../../service/window-ref-service';


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

  @Output() onChangeRegistration = new EventEmitter<PlayerRegistrationChange>();
  @Output() onDeleteRegistration = new EventEmitter<Registration>();

  constructor(public dialog: MdDialog,
              public dialogRef: MdDialogRef<PlayerRegistrationInfoDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

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

    this.handleUndefined();

    const regChange: PlayerRegistrationChange = {
      registration: this.playerRegistration,
      paymentChecked: this.playerRegistration.paymentChecked,
      armyListsChecked:  !this.playerRegistration.armyListsChecked,
      playerUploadedArmyLists: false,
      playerMarkedPayment: this.playerRegistration.playerMarkedPayment
    };
    this.onChangeRegistration.emit(regChange);

  }

  changePaidForTournament() {

    this.handleUndefined();

    this.onChangeRegistration.emit({
      registration: this.playerRegistration,
      paymentChecked: !this.playerRegistration.paymentChecked,
      armyListsChecked: this.playerRegistration.armyListsChecked,
      playerUploadedArmyLists: this.playerRegistration.playerUploadedArmyLists,
      playerMarkedPayment: false
    });
  }

  deleteRegistration(registration: Registration) {
    this.onDeleteRegistration.emit(registration);
  }

  sendMail(mail: string) {
    this.winRef.nativeWindow.location.href = 'mailto:' + mail + '?subject=Tournament Organizer from ' +
      this.playerRegistration.tournamentName;
  }

  private handleUndefined() {
    if (typeof this.playerRegistration.paymentChecked === 'undefined') {
      this.playerRegistration.paymentChecked = false;
    }
    if (typeof this.playerRegistration.armyListsChecked === 'undefined') {
      this.playerRegistration.armyListsChecked = false;
    }
    if (typeof this.playerRegistration.playerUploadedArmyLists === 'undefined') {
      this.playerRegistration.playerUploadedArmyLists = false;
    }
    if (typeof this.playerRegistration.playerMarkedPayment === 'undefined') {
      this.playerRegistration.playerMarkedPayment = false;
    }
  }
}


