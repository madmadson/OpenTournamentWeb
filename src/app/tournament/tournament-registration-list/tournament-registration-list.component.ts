import {Component, Input, OnInit} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Player} from '../../../../shared/model/player';

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

  constructor() {
  }

  ngOnInit() {
  }

  isItMe(regId: string) {


    if (this.userPlayerData) {
      if (regId === this.userPlayerData.id) {
        return 'blue';
      }
    }
  }
}
