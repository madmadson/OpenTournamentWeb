import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk/table';
import {MdPaginator, MdSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';

import {TournamentPlayer} from '../model/tournament-player';


export class TournamentPlayerDatabase {
  get dataChange(): BehaviorSubject<TournamentPlayer[]> {
    return this._dataChange;
  }

  set dataChange(value: BehaviorSubject<TournamentPlayer[]>) {
    this._dataChange = value;
  }

  private _dataChange: BehaviorSubject<TournamentPlayer[]> = new BehaviorSubject<TournamentPlayer[]>([]);

  get data(): TournamentPlayer[] {
    return this._dataChange.value;
  }

  constructor(tournamentPlayers: TournamentPlayer[]) {

    // const threeTimesGames = _.concat(games, games, games);
    // const copiedData = _.cloneDeep(threeTimesGames);

    const copiedData = _.cloneDeep(tournamentPlayers);
    this._dataChange.next(copiedData);

  }
  resetDatabase(tournamentPlayers: TournamentPlayer[]) {
    const copiedData = _.cloneDeep(tournamentPlayers);
    this._dataChange.next(copiedData);
  }
}


export class TournamentPlayersDataSource extends DataSource<TournamentPlayer> {



  constructor(private _playerDatabase: TournamentPlayerDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }


  connect(): Observable<TournamentPlayer[]> {
    const displayDataChanges = [
      this._playerDatabase.dataChange,
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
  getSortedData(): TournamentPlayer[] {
    const data = this._playerDatabase.data.slice();

    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'playerName':
          [propertyA, propertyB] = [a.playerName, b.playerName];
          break;
        case 'faction':
          [propertyA, propertyB] = [a.faction, b.faction];
          break;
        case 'team':
          [propertyA, propertyB] = [a.teamName, b.teamName];
          break;
        case 'locality':
          [propertyA, propertyB] = [a.meta, b.meta];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
