import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';

@Component({
  selector: 'tournament-player-list',
  templateUrl: './tournament-player-list.component.html',
  styleUrls: ['./tournament-player-list.component.css']
})
export class TournamentPlayerListComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() tournamentPlayers: TournamentPlayer[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;

  @Output() onDeleteTournamentPlayer = new EventEmitter<TournamentPlayer>();


  constructor() { }

  ngOnInit() {
  }

  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  deleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.onDeleteTournamentPlayer.emit(tournamentPlayer);
  }

}
