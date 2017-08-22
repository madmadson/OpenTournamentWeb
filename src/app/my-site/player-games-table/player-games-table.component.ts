import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';

@Component({
  selector: 'player-games-table',
  templateUrl: './player-games-table.component.html',
  styleUrls: ['./player-games-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerGamesTableComponent {

  @Input() myGames: TournamentGame[];
  smallScreen: boolean;
  truncateMax: number;

  page = 1;

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
