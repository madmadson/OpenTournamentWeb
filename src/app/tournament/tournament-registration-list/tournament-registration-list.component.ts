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
  playerData: Player;

  constructor() {
  }

  ngOnInit() {
  }

  isItMe(regId: string) {


    if (this.playerData) {
      if (regId === this.playerData.id) {
        return 'blue';
      }
    }
  }
}
