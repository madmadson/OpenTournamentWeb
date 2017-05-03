import {Component} from '@angular/core';
import {ApplicationState} from '../../store/application-state';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {TournamentListVM} from '../tournamentList.vm';
import {Tournament} from '../../../../shared/model/tournament';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'tournament-list-overview',
  templateUrl: 'tournament-list-overview.component.html',
  styleUrls: ['tournament-list-overview.component.css']
})
export class TournamentListOverviewComponent  {

  groupedTournaments$: Observable<TournamentListVM[]>;
  allTournaments$: Observable<Tournament[]>;

  constructor(private store: Store<ApplicationState>) {

    this.allTournaments$ = store.select(state => state.tournaments.tournaments);

    this.groupedTournaments$ = store.select(
      state => {
        return _.chain(state.tournaments.tournaments)
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
