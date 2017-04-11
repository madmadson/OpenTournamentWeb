import {Component, Input, OnInit} from '@angular/core';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {Player} from '../../../../shared/model/player';

@Component({
  selector: 'tournament-player-list',
  templateUrl: './tournament-player-list.component.html',
  styleUrls: ['./tournament-player-list.component.css']
})
export class TournamentPlayerListComponent implements OnInit {

  @Input()
  tournamentPlayers: TournamentPlayer[];

  @Input()
  userPlayerData: Player;

  @Input()
  isAdmin: boolean;

  constructor() { }

  ngOnInit() {
  }

  isItMe(playerId: string) {

    if (this.userPlayerData) {
      if (playerId === this.userPlayerData.id) {
        return 'blue';
      }
    }
  }

}
