import {Component, Input, OnInit} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';

@Component({
  selector: 'tournament-game-table',
  templateUrl: './tournament-game-table.component.html',
  styleUrls: ['./tournament-game-table.component.css']
})
export class TournamentGameTableComponent implements OnInit {

  @Input() games: TournamentGame[];


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
