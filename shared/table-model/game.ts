import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TournamentGame} from '../model/tournament-game';
import {DataSource} from '@angular/cdk';
import {MdPaginator, MdSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';

export class GamesDatabase {
  get dataChange(): BehaviorSubject<TournamentGame[]> {
    return this._dataChange;
  }

  set dataChange(value: BehaviorSubject<TournamentGame[]>) {
    this._dataChange = value;
  }

  private _dataChange: BehaviorSubject<TournamentGame[]> = new BehaviorSubject<TournamentGame[]>([]);

  get data(): TournamentGame[] {
    return this._dataChange.value;
  }

  constructor(games: TournamentGame[]) {

    // const threeTimesGames = _.concat(games, games, games);
    // const copiedData = _.cloneDeep(threeTimesGames);

    const copiedData = _.cloneDeep(games);
    this._dataChange.next(copiedData);

  }

  resetDatabase(games: TournamentGame[]) {
    const copiedData = _.cloneDeep(games);
    this._dataChange.next(copiedData);
  }

}


export class GamesDataSource extends DataSource<TournamentGame> {


  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }


  constructor(private _gamesDatabase: GamesDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }


  connect(): Observable<TournamentGame[]> {
    const displayDataChanges = [
      this._gamesDatabase.dataChange,
      this._sort.mdSortChange,
      this._paginator.page,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {

      const sortedData = this.getSortedData();

      const filteredData = sortedData.slice().filter((game: TournamentGame) => {
        const searchStr = (game.playerOnePlayerName + game.playerTwoPlayerName).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return filteredData.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(): TournamentGame[] {
    const data = this._gamesDatabase.data.slice();

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
        case 'playerOneFaction':
          [propertyA, propertyB] = [a.playerOneFaction, b.playerOneFaction];
          break;
        case 'playerOneScore':
          [propertyA, propertyB] = [a.playerOneScore, b.playerOneScore];
          break;
        case 'playerTwoPlayerName':
          [propertyA, propertyB] = [a.playerTwoPlayerName, b.playerTwoPlayerName];
          break;
        case 'playerTwoFaction':
          [propertyA, propertyB] = [a.playerTwoFaction, b.playerTwoFaction];
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
