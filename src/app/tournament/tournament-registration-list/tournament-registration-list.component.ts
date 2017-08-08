import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {WindowRefService} from '../../service/window-ref-service';
import {MdDialog} from '@angular/material';
import {PlayerRegistrationInfoDialogComponent} from '../../dialogs/tournament-preparation/player-registration-info-dialog';
import {Observable} from 'rxjs/Observable';
import {ArmyList} from '../../../../shared/model/armyList';
import {PlayerRegistrationChange} from '../../../../shared/dto/playerRegistration-change';


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
  @Input() isCoOrganizer: boolean;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;

  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  @Output() onDeleteRegistration = new EventEmitter<Registration>();
  @Output() onAddArmyListForRegistrationDialog = new EventEmitter<Registration>();
  @Output() onPlayerRegChangeEventSubscribe = new EventEmitter<PlayerRegistrationChange>();

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

  addArmyLists(event: any, registration: Registration) {
    event.stopPropagation();
    this.onAddArmyListForRegistrationDialog.emit(registration);
  }

  showRegistrationInfo(playerRegistration: Registration) {
    const dialogRef = this.dialog.open(PlayerRegistrationInfoDialogComponent, {
      data: {
        playerRegistration: playerRegistration,
        armyLists: this.armyLists,
        isAdmin: this.isAdmin
      }
    });
    const regChangeEventSubscribe = dialogRef.componentInstance.onRegChangeEventSubscribe.subscribe(
      (playerRegistrationChange: PlayerRegistrationChange) => {
      if (playerRegistrationChange) {
        this.onPlayerRegChangeEventSubscribe.emit(playerRegistrationChange);
      }
      dialogRef.close();
    });

    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteRegistration.subscribe(
      (reg: Registration) => {
        if (reg) {
          this.onDeleteRegistration.emit(reg);
        }
        dialogRef.close();
      });
    dialogRef.afterClosed().subscribe(() => {

      regChangeEventSubscribe.unsubscribe();
      deleteEventSubscribe.unsubscribe();
    });
  }
}
