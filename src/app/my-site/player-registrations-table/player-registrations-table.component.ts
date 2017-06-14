import {Component, Input} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';


@Component({
  selector: 'player-registrations-table',
  templateUrl: './player-registrations-table.component.html',
  styleUrls: ['./player-registrations-table.component.scss']
})
export class PlayerRegistrationsTableComponent {


  @Input() myRegistrations: Registration[];

  constructor() {

  }

}
