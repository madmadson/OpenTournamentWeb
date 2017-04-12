import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  @Output() onDeleteTournamentPlayer = new EventEmitter<TournamentPlayer>();


  constructor() { }

  ngOnInit() {
  }

  isItMe(playerId: string) {

    if (this.userPlayerData) {
      if (playerId === this.userPlayerData.id) {
        return 'my-item-color';
      }
    }
  }

  deleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.onDeleteTournamentPlayer.emit(tournamentPlayer);
  }

}
