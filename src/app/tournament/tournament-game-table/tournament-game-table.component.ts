import {Component, EventEmitter, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Tournament} from '../../../../shared/model/tournament';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MdPaginator, MdSort} from '@angular/material';
import {DataSource} from '@angular/cdk';
import { DOCUMENT } from '@angular/common';

import * as _ from 'lodash';
import {WindowRefService} from '../../service/window-ref-service';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'tournament-game-table',
  templateUrl: './tournament-game-table.component.html',
  styleUrls: ['./tournament-game-table.component.scss']
})
export class TournamentGameTableComponent implements OnInit {

  @Input() games: TournamentGame[];
  @Input() isAdmin: boolean;
  @Input() actualTournament: Tournament;

  displayedColumns = ['playingField', 'playerOnePlayerName', 'playerOneScore', 'playerTwoPlayerName', 'playerTwoScore'];
  gamesDb: GamesDatabase;
  dataSource: ExampleDataSource | null;

  smallScreen: boolean;
  truncateMax: number;

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(@Inject(DOCUMENT) private document: any,
              private pageScrollService: PageScrollService,
              private winRef: WindowRefService) {



    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 10;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 25;
    }

  }

  ngOnInit() {
    this.gamesDb = new GamesDatabase(this.games);

    this.dataSource = new ExampleDataSource(this.gamesDb, this.sort, this.paginator);
  }


  playerOneWon(game: TournamentGame): boolean {
    return game.playerOneScore > game.playerTwoScore;

  }

  playerTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;

  }

  startAutoScroll() {

    const that = this;

    this.onReachBottomOfPageEvent = new EventEmitter();

    this.onReachBottomOfPageEvent.subscribe( function (x) {

      if (!x) {
        that.onReachBottomOfPageEvent.complete();
      }
      that.autoScrollToTop();
    });

    this.onReachTopOfPageEvent = new EventEmitter();

    this.onReachTopOfPageEvent.subscribe( function (x) {

      if (!x) {
        that.onReachTopOfPageEvent.complete();
      }
      that.autoScrollToBottom();
    });

    this.autoScrollToBottom();
  }

  autoScrollToBottom() {

    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#bottom',
      pageScrollDuration: 30000,
      pageScrollFinishListener: this.onReachBottomOfPageEvent
    });
    this.pageScrollService.start(pageScrollInstance);
  }

  autoScrollToTop() {

    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#top',
      pageScrollDuration: 15000,
      pageScrollFinishListener: this.onReachTopOfPageEvent
    });
    this.pageScrollService.start(pageScrollInstance);
  }

}


export class GamesDatabase {

  dataChange: BehaviorSubject<TournamentGame[]> = new BehaviorSubject<TournamentGame[]>([]);

  get data(): TournamentGame[] {
    return this.dataChange.value;
  }

  constructor(games: TournamentGame[]) {

   //  const threeTimesGames = _.concat(games, games, games);

    const copiedData = _.cloneDeep(games);
    this.dataChange.next(copiedData);

  }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<TournamentGame> {
  constructor(private _exampleDatabase: GamesDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<TournamentGame[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.mdSortChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {

      const sortedData = this.getSortedData();

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return sortedData.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(): TournamentGame[] {
    const data = this._exampleDatabase.data.slice();

    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'playingField':
          [propertyA, propertyB] = [a.playingField, b.playingField];
          break;
        case 'playerOnePlayerName':
          [propertyA, propertyB] = [a.playerOnePlayerName, b.playerOnePlayerName];
          break;
        case 'playerOneScore':
          [propertyA, propertyB] = [a.playerOneScore, b.playerOneScore];
          break;
        case 'playerTwoPlayerName':
          [propertyA, propertyB] = [a.playerTwoPlayerName, b.playerTwoPlayerName];
          break;
        case 'playerTwoScore':
          [propertyA, propertyB] = [a.playerTwoScore, b.playerTwoScore];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
