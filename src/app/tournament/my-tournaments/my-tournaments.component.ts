import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentListVM} from '../tournament.vm';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {Router} from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';


@Component({
  selector: 'my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.css']
})
export class MyTournamentsComponent {
  groupedTournaments$: Observable<TournamentListVM[]>;
  allTournaments$: Observable<any[]>;

  constructor(private store: Store<ApplicationState>, private router: Router) {

    this.allTournaments$ = store.select(state => {
      return _.filter(state.globalState.tournaments, function (tournament) {
        return tournament.creatorUid === state.globalState.currentUserId;
      });
    });

    this.groupedTournaments$ = store.select(
      state => {

        return _.chain(state.globalState.tournaments)
          .filter(function (tournament) {
            return tournament.creatorUid === state.globalState.currentUserId;
          })
          .groupBy(function (tournament) {
            return moment(tournament.beginDate).format('MMMM YYYY');
          })
          .toPairs()
          .map(function (currentItem) {
            return _.zipObject(['monthYear', 'tournaments'], currentItem);
          })
          .value();
      });

  }

  createTournament(): void {
    this.router.navigate(['/tournament-new']);
  }
}
