import {ChangeDetectionStrategy, ElementRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';

import {MdPaginator, MdSort} from '@angular/material';
import {GamesDatabase, GamesDataSource} from '../../../../shared/table-model/game';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamesListComponent implements OnInit, OnChanges {

  @Input() games: TournamentGame[];

  displayedColumns = [
    'playerOnePlayerName',
    'playerOneFaction',
    'playerOneScore',
    'playerTwoPlayerName',
    'playerTwoFaction',
    'playerTwoScore'];
  gamesDb: GamesDatabase;
  dataSource: GamesDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filter') filter: ElementRef;

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
        if (this.gamesDb && propName === 'games') {
          this.gamesDb.resetDatabase(change.currentValue);
        }

      }
    }

  }

  ngOnInit() {
    this.gamesDb = new GamesDatabase(this.games);
    this.dataSource = new GamesDataSource(this.gamesDb, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
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
