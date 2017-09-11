import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk/table';
import {MdPaginator, MdSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';
import {Player} from '../model/player';

export class PlayerDatabase {
  get dataChange(): BehaviorSubject<Player[]> {
    return this._dataChange;
  }

  set dataChange(value: BehaviorSubject<Player[]>) {
    this._dataChange = value;
  }

  private _dataChange: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);

  get data(): Player[] {
    return this._dataChange.value;
  }

  constructor(players: Player[]) {

    // const threeTimesGames = _.concat(games, games, games);
    // const copiedData = _.cloneDeep(threeTimesGames);

    const copiedData = _.cloneDeep(players);
    this._dataChange.next(copiedData);

  }
  resetDatabase(players: Player[]) {
    const copiedData = _.cloneDeep(players);
    this._dataChange.next(copiedData);
  }
}


export class PlayersDataSource extends DataSource<Player> {

  constructor(private _playersDatabase: PlayerDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }


  connect(): Observable<Player[]> {
    const displayDataChanges = [
      this._playersDatabase.dataChange,
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
  getSortedData(): Player[] {
    const data = this._playersDatabase.data.slice();

    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'rank':
          [propertyA, propertyB] = [a.elo, b.elo];
          break;
        case 'firstName':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'nickName':
          [propertyA, propertyB] = [a.nickName, b.nickName];
          break;
        case 'lastName':
          [propertyA, propertyB] = [a.lastName, b.lastName];
          break;
        case 'locality':
          [propertyA, propertyB] = [a.meta, b.meta];
          break;
        case 'elo':
          [propertyA, propertyB] = [a.elo, b.elo];
          break;
        case 'country':
          [propertyA, propertyB] = [a.country, b.country];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
