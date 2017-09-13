import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk/table';
import {MdPaginator, MdSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';
import {TournamentTeam} from '../model/tournament-team';


export class TournamentTeamDatabase {
  get dataChange(): BehaviorSubject<TournamentTeam[]> {
    return this._dataChange;
  }

  set dataChange(value: BehaviorSubject<TournamentTeam[]>) {
    this._dataChange = value;
  }

  private _dataChange: BehaviorSubject<TournamentTeam[]> = new BehaviorSubject<TournamentTeam[]>([]);

  get data(): TournamentTeam[] {
    return this._dataChange.value;
  }

  constructor(teams: TournamentTeam[]) {

    // const threeTimesGames = _.concat(games, games, games);
    // const copiedData = _.cloneDeep(threeTimesGames);

    const copiedData = _.cloneDeep(teams);
    this._dataChange.next(copiedData);

  }
  resetDatabase(registrations: TournamentTeam[]) {


    const copiedData = _.cloneDeep(registrations);
    this._dataChange.next(copiedData);
  }
}


export class TournamentTeamsDataSource extends DataSource<TournamentTeam> {

  constructor(private _teamsDatabase: TournamentTeamDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }


  connect(): Observable<TournamentTeam[]> {
    const displayDataChanges = [
      this._teamsDatabase.dataChange,
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
  getSortedData(): TournamentTeam[] {
    const data = this._teamsDatabase.data.slice();

    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'teamName':
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
