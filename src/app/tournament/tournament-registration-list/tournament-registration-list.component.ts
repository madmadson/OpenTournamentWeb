import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Player} from '../../../../shared/model/player';
import {ArmyList} from "../../../../shared/model/armyList";

@Component({
  selector: 'tournament-registration-list',
  templateUrl: './tournament-registration-list.component.html',
  styleUrls: ['./tournament-registration-list.component.css']
})
export class TournamentRegistrationListComponent implements OnInit {

  @Input()
  registrations: Registration[];

  @Input()
  userPlayerData: Player;

  @Input()
  isAdmin: boolean;

  @Output() onSaveTournamentPlayer = new EventEmitter<Registration>();

  @Output() onDeleteRegistration = new EventEmitter<Registration>();

  @Output() onAddArmyLists = new EventEmitter<Registration>();

  constructor() {
  }

  ngOnInit() {
  }

  isItMe(regId: string) {


    if (this.userPlayerData) {
      if (regId === this.userPlayerData.id) {
        return 'my-item-color';
      }
    }
  }

  addTournamentPlayer(registration: Registration) {
    this.onSaveTournamentPlayer.emit(registration);
  }

  deleteRegistration(registration: Registration) {
    this.onDeleteRegistration.emit(registration);
  }

  addArmyLists(registration: Registration) {
    this.onAddArmyLists.emit(registration);
  }
}
