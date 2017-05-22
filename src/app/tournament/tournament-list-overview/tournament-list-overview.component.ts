import {AfterContentChecked, Component} from '@angular/core';
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
export class TournamentListOverviewComponent {

  allTournaments$: Observable<Tournament[]>;

  orderedGroupedTournaments: TournamentListVM[];
  filteredOrderedGroupedTournaments: TournamentListVM[];

  selectedFilterState: string;

  constructor(private store: Store<ApplicationState>) {

    this.allTournaments$ = store.select(state => state.tournaments.tournaments);

    store.select(
      state => {
        return _.chain(state.tournaments.tournaments).sortBy(function (value) {
          return new Date(value.beginDate);
        })
          .groupBy(function (tournament) {
            return moment(tournament.beginDate).format('MMMM YYYY');
          }).toPairs()
          .map(function (currentItem) {
            return _.zipObject(['monthYear', 'tournaments'], currentItem);
          })
          .value();
      }).subscribe((tournaments: TournamentListVM[]) => {
      this.orderedGroupedTournaments = tournaments;
      this.filteredOrderedGroupedTournaments = tournaments;
    });

    this.selectedFilterState = 'Upcoming';
  }

  search(searchString: string) {

    const that = this;
    this.filteredOrderedGroupedTournaments = _.cloneDeep(this.orderedGroupedTournaments);

    if (searchString !== '') {

      _.each(this.filteredOrderedGroupedTournaments, function (tournamentGroup, index) {

        const tournamentsMatch: Tournament[] = _.filter(tournamentGroup.tournaments, function (tournament) {
          return tournament.name.toLowerCase().startsWith(searchString.toLowerCase()) ||
            tournament.location.toLowerCase().startsWith(searchString.toLowerCase());
        });
        that.filteredOrderedGroupedTournaments[index].tournaments = tournamentsMatch;
      });
    }
  }

  changeFilter() {

    const that = this;
    this.filteredOrderedGroupedTournaments = _.cloneDeep(this.orderedGroupedTournaments);

    _.each(this.filteredOrderedGroupedTournaments, function (tournamentGroup, index) {

      const tournamentsMatch: Tournament[] = _.filter(tournamentGroup.tournaments, function (tournament) {

        if (that.selectedFilterState === 'Upcoming') {
          return !tournament.finished;
        } else {
          return tournament.finished;
        }
      });
      that.filteredOrderedGroupedTournaments[index].tournaments = tournamentsMatch;
    });

  }

}
