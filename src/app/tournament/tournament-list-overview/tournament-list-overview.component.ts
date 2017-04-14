import {Component} from '@angular/core';
import {ApplicationState} from '../../store/application-state';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {TournamentListVM} from '../tournamentList.vm';

import * as _ from 'lodash';
import * as moment from 'moment';
import {Tournament} from '../../../../shared/model/tournament';

@Component({
  selector: 'tournament-list-overview',
  templateUrl: 'tournament-list-overview.component.html',
  styleUrls: ['tournament-list-overview.component.css']
})
export class TournamentOverviewComponent  {

    groupedTournaments$: Observable<TournamentListVM[]>;
    allTournaments$: Observable<Tournament[]>;

  constructor(private store: Store<ApplicationState>) {

    this.allTournaments$ = store.select(state => state.tournamentStoreData.tournaments);

    this.groupedTournaments$ = store.select(
      state => {
        return _.chain(state.tournamentStoreData.tournaments)
          .groupBy(function (tournament) {
            return moment(tournament.beginDate).format('MMMM YYYY');
          }).toPairs()
          .map(function (currentItem) {
            return _.zipObject(['monthYear', 'tournaments'], currentItem);
          })
          .value();
      });
  }
}
