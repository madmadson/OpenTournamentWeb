import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentGame} from '../../../../shared/model/tournament-game';

@Component({
  selector: 'player-games-table',
  templateUrl: './player-games-table.component.html',
  styleUrls: ['./player-games-table.component.css']
})
export class PlayerGamesTableComponent implements OnInit {

  @Input() myGames$: Observable<TournamentGame[]>;

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
