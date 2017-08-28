import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Store} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';

import * as _ from 'lodash';
import * as moment from 'moment';
import {AppState} from '../../store/reducers/index';
import {TournamentsService} from '../tournaments.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'tournament-list-overview',
  templateUrl: 'tournament-list-overview.component.html',
  styleUrls: ['tournament-list-overview.component.scss']
})
export class TournamentListOverviewComponent implements OnInit, OnDestroy {

  allTournaments$: Observable<Tournament[]>;
  allTournamentsGrouped$: Observable<any>;

  selectedFilterState: string;

  terms: string;

  // @ViewChild('filter') filter: ElementRef;

  constructor(private tournamentsService: TournamentsService, private store: Store<AppState>) {

    this.tournamentsService.subscribeOnFirebaseTournaments();

    this.selectedFilterState = 'Upcoming';

    this.allTournaments$ = this.store.select(state => state.tournaments.tournaments);

    this.allTournamentsGrouped$ = this.allTournaments$.map(t => {
      return _.chain(t).sortBy(function (value) {
        return new Date(value.beginDate);
      })
        .groupBy(function (tournament) {
          return moment(tournament.beginDate).format('MMMM YYYY');
        }).toPairs()
        .map(function (tournaments: Tournament[]) {
          return _.zipObject(['monthYear', 'tournaments'], tournaments);
        })
        .value();
    });
  }



  ngOnInit() {
    // Observable.fromEvent(this.filter.nativeElement, 'keyup')
    //     .debounceTime(150)
    //     .distinctUntilChanged()
    //     .subscribe(() => {
    //       this.terms = this.filter.nativeElement.value;
    //
    //
    // });
  }

  ngOnDestroy(): void {

    this.tournamentsService.unsubscribeOnFirebaseTournaments();
  }

  search(searchString: string) {

    // const that = this;
    // this.filteredOrderedGroupedTournaments = _.cloneDeep(this.orderedGroupedTournaments);
    //
    // if (searchString !== '') {
    //
    //   _.each(this.filteredOrderedGroupedTournaments, function (tournamentGroup, index) {
    //
    //     const tournamentsMatch: Tournament[] = _.filter(tournamentGroup.tournaments, function (tournament) {
    //       return tournament.name.toLowerCase().startsWith(searchString.toLowerCase()) ||
    //         tournament.location.toLowerCase().startsWith(searchString.toLowerCase());
    //     });
    //     that.filteredOrderedGroupedTournaments[index].tournaments = tournamentsMatch;
    //   });
    // }
  }

  changeFilter() {

    // const that = this;
    // this.filteredOrderedGroupedTournaments = _.cloneDeep(this.orderedGroupedTournaments);
    //
    // _.each(this.filteredOrderedGroupedTournaments, function (tournamentGroup, index) {
    //
    //   const tournamentsMatch: Tournament[] = _.filter(tournamentGroup.tournaments, function (tournament) {
    //
    //     if (that.selectedFilterState === 'Upcoming') {
    //       return !tournament.finished;
    //     } else {
    //       return tournament.finished;
    //     }
    //   });
    //   that.filteredOrderedGroupedTournaments[index].tournaments = tournamentsMatch;
    // });

  }

}
