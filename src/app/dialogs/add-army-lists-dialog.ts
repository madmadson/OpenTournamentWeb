import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Registration} from '../../../shared/model/registration';
import {ArmyList} from '../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {RegisterDialogComponent} from '../tournament/tournament-preparation/tournament-preparation.component';

import * as _ from 'lodash';
import {TournamentPlayer} from '../../../shared/model/tournament-player';

@Component({
  selector: 'add-army-lists-dialog',
  templateUrl: './add-army-lists-dialog.html'
})
export class AddArmyListsDialogComponent {

  registration: Registration;
  tournamentPlayer: TournamentPlayer;
  armyLists: ArmyList[];

  armyListModel: ArmyList;
  selectedTab = 0;

  @Output() onSaveArmyList = new EventEmitter<ArmyList>();
  @Output() onDeleteArmyList = new EventEmitter<ArmyList>();

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    const that = this;
    this.registration = data.registration;
    this.tournamentPlayer = data.tournamentPlayer;

    if (this.registration) {
      this.armyListModel = new ArmyList(this.registration.tournamentId, '',
        this.registration.id, this.registration.playerId, this.registration.playerName, 'New List', 'PAST HERE');

      data.armyLists.subscribe(armyLists => {
        this.armyLists = _.filter(armyLists, function (armyList: ArmyList) {
          if (that.registration !== undefined) {
            return armyList.playerId === that.registration.playerId;
          }
        });
      });
    } else {
      this.armyListModel = new ArmyList(this.tournamentPlayer.tournamentId,
        '', this.tournamentPlayer.id, this.tournamentPlayer.playerId ? this.tournamentPlayer.playerId : '',
        this.tournamentPlayer.playerName, 'New List', 'PAST HERE');

      data.armyLists.subscribe(armyLists => {
        this.armyLists = _.filter(armyLists, function (armyList: ArmyList) {
          if (that.tournamentPlayer !== undefined) {
            if (that.tournamentPlayer.playerId) {
              return armyList.tournamentPlayerId === that.tournamentPlayer.id
                || armyList.playerId === that.tournamentPlayer.playerId;
            } else {
              return armyList.tournamentPlayerId === that.tournamentPlayer.id;
            }
          }
        });
      });
    }
  }

  addArmyList() {
    this.selectedTab = (this.armyLists.length + 1);
    this.onSaveArmyList.emit(this.armyListModel);
    if (this.registration) {
      this.armyListModel = new ArmyList(this.registration.tournamentId, this.registration.id,
        '', this.registration.playerId, this.registration.playerName, 'New List', 'PAST HERE');
    } else {
      this.armyListModel = new ArmyList(this.tournamentPlayer.tournamentId,
        '', this.tournamentPlayer.id, this.tournamentPlayer.playerId ? this.tournamentPlayer.playerId : '',
        this.tournamentPlayer.playerName, 'New List', 'PAST HERE');

    }
  };

  deleteArmyList(armyList: ArmyList) {
    this.onDeleteArmyList.emit(armyList);
  };
}
