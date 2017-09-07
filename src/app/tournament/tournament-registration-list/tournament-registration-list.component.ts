import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Player} from '../../../../shared/model/player';
import {WindowRefService} from '../../service/window-ref-service';
import {MdDialog, MdPaginator, MdSort} from '@angular/material';
import {RegistrationDatabase, RegistrationsDataSource} from '../../../../shared/table-model/registration';


@Component({
  selector: 'tournament-registration-list2',
  templateUrl: './tournament-registration-list.component.html',
  styleUrls: ['./tournament-registration-list.component.scss']
})
export class TournamentRegistrationListComponent2 implements OnInit {

  // @Input() actualTournament: Tournament;
  @Input() registrations: Registration[];
  @Input() userPlayerData: Player;
  // @Input() isAdmin: boolean;
  // @Input() isCoOrganizer: boolean;
  // @Input() armyLists: ArmyList[];

  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  // @Output() onDeleteRegistration = new EventEmitter<Registration>();
  // @Output() onAddArmyListForRegistrationDialog = new EventEmitter<Registration>();
  // @Output() onPlayerRegChangeEventSubscribe = new EventEmitter<PlayerRegistrationChange>();

  displayedColumns = [
    'playerName', 'team', 'locality', 'faction', 'armyList', 'paid', 'actions'];
  registrationDb: RegistrationDatabase;
  dataSource: RegistrationsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  smallScreen: boolean;
  truncateMax: number;

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

    this.registrationDb = new RegistrationDatabase(this.registrations);
    this.dataSource = new RegistrationsDataSource(this.registrationDb, this.sort, this.paginator);

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
  //
  // addArmyLists(event: any, registration: Registration) {
  //   event.stopPropagation();
  //   this.onAddArmyListForRegistrationDialog.emit(registration);
  // }
  //
  // showRegistrationInfo(playerRegistration: Registration) {
  //   const dialogRef = this.dialog.open(PlayerRegistrationInfoDialogComponent, {
  //     data: {
  //       playerRegistration: playerRegistration,
  //       armyLists: this.armyLists,
  //       isAdmin: this.isAdmin
  //     }
  //   });
  //   const regChangeEventSubscribe = dialogRef.componentInstance.onRegChangeEventSubscribe.subscribe(
  //     (playerRegistrationChange: PlayerRegistrationChange) => {
  //     if (playerRegistrationChange) {
  //       this.onPlayerRegChangeEventSubscribe.emit(playerRegistrationChange);
  //     }
  //     dialogRef.close();
  //   });
  //
  //   const deleteEventSubscribe = dialogRef.componentInstance.onDeleteRegistration.subscribe(
  //     (reg: Registration) => {
  //       if (reg) {
  //         this.onDeleteRegistration.emit(reg);
  //       }
  //       dialogRef.close();
  //     });
  //   dialogRef.afterClosed().subscribe(() => {
  //
  //     regChangeEventSubscribe.unsubscribe();
  //     deleteEventSubscribe.unsubscribe();
  //   });
  // }
}
