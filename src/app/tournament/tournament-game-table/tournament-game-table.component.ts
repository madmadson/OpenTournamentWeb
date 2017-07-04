import {Component, Input, OnInit} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';

@Component({
  selector: 'tournament-game-table',
  templateUrl: './tournament-game-table.component.html',
  styleUrls: ['./tournament-game-table.component.scss']
})
export class TournamentGameTableComponent implements OnInit {

  @Input() games: TournamentGame[];
  @Input() isAdmin: boolean;

  constructor() { }

  ngOnInit() {
  }
  playerOneWon(game: TournamentGame): boolean {
    return game.playerOneScore > game.playerTwoScore;

  }
  playerTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;

  }
}
