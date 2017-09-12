import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Registration} from '../../../shared/model/registration';
import {ArmyList} from '../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

import * as _ from 'lodash';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyListRegistrationPush} from '../../../shared/dto/armyList-registration-push';
import {ArmyListTournamentPlayerPush} from '../../../shared/dto/armyList-tournamentPlayer-push';
import {getWMHOCaster} from '../../../shared/model/wa_ho-caster';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'add-army-lists-dialog',
  templateUrl: './add-army-lists-dialog.html',
  styleUrls: ['./add-army-lists-dialog.scss']
})
export class AddArmyListsDialogComponent {

  registration: Registration;
  tournamentPlayer: TournamentPlayer;
  armyLists: ArmyList[];


  listOfCasterFaction: string[];

  armyListModel: ArmyList;
  selectedTab = 0;

  @Output() onSaveArmyListForTournamentPlayer = new EventEmitter<ArmyListTournamentPlayerPush>();
  @Output() onSaveArmyListForRegistration = new EventEmitter<ArmyListRegistrationPush>();
  @Output() onDeleteArmyList = new EventEmitter<ArmyList>();
  private armyListSubsciption: Subscription;

  constructor(public dialogRef: MdDialogRef<AddArmyListsDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    const that = this;
    this.registration = data.registration;
    this.tournamentPlayer = data.tournamentPlayer;

    if (this.registration) {

      this.listOfCasterFaction = getWMHOCaster(this.registration.faction);

      this.armyListModel = new ArmyList(this.registration.tournamentId, '',
        this.registration.id, this.registration.playerId, this.registration.playerName,
        this.registration.teamName, this.listOfCasterFaction[0], 'PAST HERE');

      this.armyListSubsciption = data.armyLists$.subscribe(armyLists => {
        this.armyLists = _.filter(armyLists, function (armyList: ArmyList) {
          if (that.registration) {
            return armyList.playerId === that.registration.playerId;
          }
        });
      });
    } else {

      this.listOfCasterFaction = getWMHOCaster(this.tournamentPlayer.faction);

      this.armyListModel = new ArmyList(this.tournamentPlayer.tournamentId,
        '', this.tournamentPlayer.id, this.tournamentPlayer.playerId ? this.tournamentPlayer.playerId : '',
        this.tournamentPlayer.playerName, this.tournamentPlayer.teamName, this.listOfCasterFaction[0], 'PAST HERE');

      this.armyListSubsciption = data.armyLists$.subscribe(armyLists => {
        this.armyLists = _.filter(armyLists, function (armyList: ArmyList) {
          if (that.tournamentPlayer) {
            if (that.tournamentPlayer.playerId) {
              return armyList.tournamentPlayerId === that.tournamentPlayer.id
                || armyList.playerId === that.tournamentPlayer.playerId;
            } else {
              return armyList.tournamentPlayerId === that.tournamentPlayer.id;
            }
          }
        });
      });

      if (this.listOfCasterFaction) {
        this.armyListModel.name = this.listOfCasterFaction[0];
      }
    }
  }

  addArmyList() {
    this.selectedTab = (this.armyLists.length + 1);

    if (this.registration) {
      this.onSaveArmyListForRegistration.emit({
        armyList: this.armyListModel,
        registration: this.registration
      });

      this.armyListModel = new ArmyList(this.registration.tournamentId, this.registration.id,
        '', this.registration.playerId, this.registration.playerName,
        this.registration.teamName, this.listOfCasterFaction[0], 'PAST HERE');
    } else {
      this.onSaveArmyListForTournamentPlayer.emit({
        armyList: this.armyListModel,
        tournamentPlayer: this.tournamentPlayer
      });

      this.armyListModel = new ArmyList(this.tournamentPlayer.tournamentId, '',
        this.tournamentPlayer.id, this.tournamentPlayer.playerId ? this.tournamentPlayer.playerId : '',
        this.tournamentPlayer.playerName, this.tournamentPlayer.teamName, this.listOfCasterFaction[0], 'PAST HERE');
    }
  };

  deleteArmyList(armyList: ArmyList) {
    this.onDeleteArmyList.emit(armyList);
  };

  closeDialog() {

    this.armyListSubsciption.unsubscribe();
    this.dialogRef.close();
  }
}
