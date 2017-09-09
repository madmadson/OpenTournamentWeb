import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Store} from '@ngrx/store';
import {Tournament} from '../../../../shared/model/tournament';

import * as _ from 'lodash';
import * as moment from 'moment';
import {AppState} from '../../store/reducers/index';
import {TournamentsService} from '../tournaments.service';
import {Observable} from 'rxjs/Observable';
import {CHANGE_FILTER_TOURNAMENTS_ACTION, CHANGE_SEARCH_FIELD_TOURNAMENTS_ACTION} from '../tournaments-actions';

@Component({
  selector: 'tournament-list-overview',
  templateUrl: 'tournament-list-overview.component.html',
  styleUrls: ['tournament-list-overview.component.scss']
})
export class TournamentListOverviewComponent implements OnInit, OnDestroy {

  allTournaments$: Observable<Tournament[]>;
  allTournamentsFiltered$: Observable<Tournament[]>;
  allTournamentsGrouped$: Observable<any>;

  loadTournaments$: Observable<boolean>;

  filter$: Observable<string>;
  searchField$: Observable<string>;

  @ViewChild('searchField') searchField: ElementRef;

  selectedFilterState: string;

  constructor(private tournamentsService: TournamentsService,
              private store: Store<AppState>) {

    this.tournamentsService.subscribeOnFirebaseTournaments();

    this.allTournaments$ = this.store.select(state => state.tournaments.tournaments);
    this.searchField$ = this.store.select(state => state.tournaments.searchField);
    this.filter$ = this.store.select(state => state.tournaments.filter);

    this.loadTournaments$ = this.store.select(state => state.tournaments.loadTournaments);

    this.allTournamentsFiltered$ = Observable.combineLatest(
      this.allTournaments$,
      this.searchField$,
      this.filter$,
      (allTournaments, searchField, filter) => {
        return allTournaments.filter((t: Tournament) => {
           if (filter.toUpperCase() === 'UPCOMING') {
             return !t.finished && !moment().isAfter(t.endDate);
           } else {
             return t.finished ;
           }
          }).filter((t: Tournament) => {
              const searchStr = t.name.toLowerCase();
              return searchStr.startsWith(searchField.toLowerCase());
        });
      });


    this.allTournamentsGrouped$ = this.allTournamentsFiltered$.map((tournaments: Tournament[]) => {
      return _.chain(tournaments).sortBy(function (value) {
        return new Date(value.beginDate);
      })
        .groupBy(function (tournament) {
          return moment(tournament.beginDate).format('MMMM YYYY');
        }).toPairs()
        .map(function (groupedTournaments: Tournament[]) {
          return _.zipObject(['monthYear', 'tournaments'], groupedTournaments);
        })
        .value();
    });
  }



  ngOnInit() {
    Observable.fromEvent(this.searchField.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          this.store.dispatch({type: CHANGE_SEARCH_FIELD_TOURNAMENTS_ACTION, payload: this.searchField.nativeElement.value});
    });

    this.selectedFilterState = 'Upcoming';
  }

  ngOnDestroy(): void {

    this.tournamentsService.unsubscribeOnFirebaseTournaments();
  }

  changeFilter(): void {
    this.store.dispatch({type: CHANGE_FILTER_TOURNAMENTS_ACTION, payload: this.selectedFilterState});
  }
}
