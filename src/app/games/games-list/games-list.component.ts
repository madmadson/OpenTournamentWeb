import {Component, Input, OnInit} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';

@Component({
  selector: 'games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {

  @Input()
  games: TournamentGame[];

  smallScreen: boolean;
  truncateMax: number;

  constructor(private router: Router,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 30;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  ngOnInit() {
  }
  playerOneWon(game: TournamentGame): boolean {
    return game.playerOneScore > game.playerTwoScore;

  }
  playerTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;
  }
  onSelect(game: TournamentGame) {
    this.router.navigate(['/tournament/' + game.tournamentId]);
  }
}
