import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';

import {MdPaginator, MdSort} from '@angular/material';
import {GamesDatabase, GamesDataSource} from '../../../../shared/table-model/game';

@Component({
  selector: 'games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamesListComponent implements OnInit, OnChanges {

  @Input() games: TournamentGame[];

  displayedColumns = ['playerOnePlayerName', 'playerOneScore', 'playerTwoPlayerName', 'playerTwoScore'];
  gamesDb: GamesDatabase;
  dataSource: GamesDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

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

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        const curVal = JSON.stringify(change.currentValue);
        const prevVal = JSON.stringify(change.previousValue);

        if (this.gamesDb) {
          this.gamesDb.resetDatabase(change.currentValue);
        }

      }
    }

  }

  ngOnInit() {
    this.gamesDb = new GamesDatabase(this.games);

    this.dataSource = new GamesDataSource(this.gamesDb, this.sort, this.paginator);
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
