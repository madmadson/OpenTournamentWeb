import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk';
import {MdPaginator, MdSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';
import {TournamentRanking} from '../model/tournament-ranking';

export class RankingsDatabase {
  get dataChange(): BehaviorSubject<TournamentRanking[]> {
    return this._dataChange;
  }

  set dataChange(value: BehaviorSubject<TournamentRanking[]>) {
    this._dataChange = value;
  }

  private _dataChange: BehaviorSubject<TournamentRanking[]> = new BehaviorSubject<TournamentRanking[]>([]);

  get data(): TournamentRanking[] {
    return this._dataChange.value;
  }

  constructor(rankings: TournamentRanking[]) {

    // const threeTimesGames = _.concat(games, games, games);
    // const copiedData = _.cloneDeep(threeTimesGames);

    const copiedData = _.cloneDeep(rankings);
    this._dataChange.next(copiedData);

  }

  resetDatabase(rankings: TournamentRanking[]) {
    const copiedData = _.cloneDeep(rankings);
    this._dataChange.next(copiedData);
  }

}


export class RankingsDataSource extends DataSource<TournamentRanking> {


  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }


  constructor(private _rankingsDatabase: RankingsDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }


  connect(): Observable<TournamentRanking[]> {
    const displayDataChanges = [
      this._rankingsDatabase.dataChange,
      this._sort.mdSortChange,
      this._paginator.page,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {

      const sortedData = this.getSortedData();

      const filteredData = sortedData.slice().filter((ranking: TournamentRanking) => {
        const searchStr = ranking.playerName.toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return filteredData.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(): TournamentRanking[] {
    const data = this._rankingsDatabase.data.slice();

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
        case 'score':
          [propertyA, propertyB] = [a.score, b.score];
          break;
        case 'faction':
          [propertyA, propertyB] = [a.faction, b.faction];
          break;
        case 'sos':
          [propertyA, propertyB] = [a.sos, b.sos];
          break;
        case 'cp':
          [propertyA, propertyB] = [a.controlPoints, b.controlPoints];
          break;
        case 'vp':
          [propertyA, propertyB] = [a.victoryPoints, b.victoryPoints];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
