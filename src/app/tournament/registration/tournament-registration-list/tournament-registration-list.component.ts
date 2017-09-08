import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Registration} from '../../../../../shared/model/registration';
import {Player} from '../../../../../shared/model/player';
import {RegistrationDatabase, RegistrationsDataSource} from '../../../../../shared/table-model/registration';
import {MdDialog, MdPaginator, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';
import {ArmyList} from '../../../../../shared/model/armyList';
import {PlayerRegistrationChange} from '../../../../../shared/dto/playerRegistration-change';
import {PlayerRegistrationInfoDialogComponent} from '../../../dialogs/tournament-preparation/player-registration-info-dialog';
import {Tournament} from '../../../../../shared/model/tournament';

@Component({
  selector: 'tournament-registration-list',
  templateUrl: './tournament-registration-list.component.html',
  styleUrls: ['./tournament-registration-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentRegistrationListComponent implements OnInit, OnChanges {

  @Input() actualTournament: Tournament;
  @Input() registrations: Registration[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() armyLists: ArmyList[];

  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  @Output() onDeleteRegistration = new EventEmitter<Registration>();
  @Output() onChangeRegistration = new EventEmitter<PlayerRegistrationChange>();

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
      this.truncateMax = 15;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }

    if (this.smallScreen) {
      this.displayedColumns = [
        'playerName', 'faction', 'armyList', 'paid', 'actions'];
    }
  }

  ngOnInit() {

    this.registrationDb = new RegistrationDatabase(this.registrations);
    this.dataSource = new RegistrationsDataSource(this.registrationDb, this.sort, this.paginator);

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.registrationDb && propName === 'registrations') {
          this.registrationDb.resetDatabase(change.currentValue);
        }
      }
    }
  }


  isItMe(regId: string) {
    if (this.userPlayerData) {
      return regId === this.userPlayerData.id;
    }
  }

  acceptRegistration(registration: Registration) {

    this.onAcceptRegistration.emit(registration);
  }


  showRegistrationInfo(playerRegistration: Registration) {
    const dialogRef = this.dialog.open(PlayerRegistrationInfoDialogComponent, {
      data: {
        playerRegistration: playerRegistration,
        armyLists: this.armyLists,
        isAdmin: this.isAdmin
      }
    });
    const regChangeEventSubscribe = dialogRef.componentInstance.onChangeRegistration.subscribe(
      (playerRegistrationChange: PlayerRegistrationChange) => {
      if (playerRegistrationChange) {
        this.onChangeRegistration.emit(playerRegistrationChange);
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
