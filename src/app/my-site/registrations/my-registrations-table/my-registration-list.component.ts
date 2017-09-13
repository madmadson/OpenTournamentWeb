import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Registration} from '../../../../../shared/model/registration';
import {RegistrationDatabase, RegistrationsDataSource} from '../../../../../shared/table-model/registration';
import {MdDialog, MdPaginator, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';
import {Router} from "@angular/router";


@Component({
  selector: 'my-registration-list',
  templateUrl: './my-registration-list.component.html',
  styleUrls: ['./my-registration-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyRegistrationListComponent implements OnInit, OnChanges {


  @Input() registrations: Registration[];


  displayedColumns = [
    'tournamentName', 'tournamentLocation', 'tournamentDate', 'teamName', 'faction'];
  registrationDb: RegistrationDatabase;
  dataSource: RegistrationsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  smallScreen: boolean;
  truncateMax: number;

  constructor( private router: Router,
               public dialog: MdDialog,
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
        'tournamentName', 'tournamentLocation', 'tournamentDate'];
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

  onSelect(reg: Registration) {

    this.router.navigate(['/tournament/' + reg.tournamentId + '/registrations']);
  }
}
