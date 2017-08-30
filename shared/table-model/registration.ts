import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {DataSource} from '@angular/cdk';
import {MdPaginator, MdSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';
import {Registration} from '../model/registration';

export class RegistrationDatabase {
  get dataChange(): BehaviorSubject<Registration[]> {
    return this._dataChange;
  }

  set dataChange(value: BehaviorSubject<Registration[]>) {
    this._dataChange = value;
  }

  private _dataChange: BehaviorSubject<Registration[]> = new BehaviorSubject<Registration[]>([]);

  get data(): Registration[] {
    return this._dataChange.value;
  }

  constructor(registrations: Registration[]) {

    // const threeTimesGames = _.concat(games, games, games);
    // const copiedData = _.cloneDeep(threeTimesGames);

    const copiedData = _.cloneDeep(registrations);
    this._dataChange.next(copiedData);

  }
  resetDatabase(registrations: Registration[]) {
    const copiedData = _.cloneDeep(registrations);
    this._dataChange.next(copiedData);
  }
}


export class RegistrationsDataSource extends DataSource<Registration> {



  constructor(private _registrationsDatabase: RegistrationDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }


  connect(): Observable<Registration[]> {
    const displayDataChanges = [
      this._registrationsDatabase.dataChange,
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
  getSortedData(): Registration[] {
    const data = this._registrationsDatabase.data.slice();

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
