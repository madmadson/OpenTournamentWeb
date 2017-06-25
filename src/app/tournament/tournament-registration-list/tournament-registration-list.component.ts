import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {WindowRefService} from '../../service/window-ref-service';
import {MdDialog} from "@angular/material";
import {PlayerRegistrationInfoDialogComponent} from "../../dialogs/tournament-preparation/player-registration-info-dialog";
import {Observable} from "rxjs/Observable";
import {ArmyList} from "../../../../shared/model/armyList";


@Component({
  selector: 'tournament-registration-list',
  templateUrl: './tournament-registration-list.component.html',
  styleUrls: ['./tournament-registration-list.component.scss']
})
export class TournamentRegistrationListComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() registrations: Registration[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;

  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  @Output() onDeleteRegistration = new EventEmitter<Registration>();
  @Output() onAddArmyLists = new EventEmitter<Registration>();

  smallScreen: boolean;
  truncateMax: number;
  armyLists: ArmyList[];

  constructor( public dialog: MdDialog,
               private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  ngOnInit() {
    this.actualTournamentArmyList$.subscribe(armyLists => {
      this.armyLists = armyLists;
    });
  }

  isItMe(regId: string) {
    if (this.userPlayerData) {
      return regId === this.userPlayerData.id;
    }
  }

  acceptRegistration(event: any, registration: Registration) {

    event.stopPropagation();
    this.onAcceptRegistration.emit(registration);
  }

  deleteRegistration(registration: Registration) {
    this.onDeleteRegistration.emit(registration);
  }

  addArmyLists(event: any, registration: Registration) {
    event.stopPropagation();
    this.onAddArmyLists.emit(registration);
  }

  showRegistrationInfo(playerRegistration: Registration) {
    this.dialog.open(PlayerRegistrationInfoDialogComponent, {
      data: {
        playerRegistration: playerRegistration,
        armyLists: this.armyLists,
        isAdmin: this.isAdmin
      }
    });
  }
}
