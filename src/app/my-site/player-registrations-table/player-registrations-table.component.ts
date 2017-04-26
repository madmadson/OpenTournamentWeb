import {Component, Input} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Observable} from 'rxjs/Observable';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'player-registrations-table',
  templateUrl: './player-registrations-table.component.html',
  styleUrls: ['./player-registrations-table.component.css']
})
export class PlayerRegistrationsTableComponent {

  @Input() myRegistrations$: Observable<Registration[]>;

  constructor(public dialog: MdDialog) {

  }

}
