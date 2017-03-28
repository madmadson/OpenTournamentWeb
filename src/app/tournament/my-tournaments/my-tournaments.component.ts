import {Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {TournamentListVM} from "../tournament.vm";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";

import * as _ from "lodash";
import * as moment from "moment";
import {TournamentsSubscribeAction, TournamentsUnsubscribeAction} from "../../store/actions/tournament-actions";
import {Router} from "@angular/router";

@Component({
  selector: 'my-tournaments',
  templateUrl: './my-tournaments.component.html',
  styleUrls: ['./my-tournaments.component.css']
})
export class MyTournamentsComponent implements OnInit, OnDestroy {
  groupedTournaments$: Observable<TournamentListVM[]>;
  allTournaments$: Observable<any[]>;

  constructor(private store: Store<ApplicationState>, private router: Router) {

    this.allTournaments$ = store.select(state => {
      return _.filter(state.storeData.tournaments, function (tournament) {
        return tournament.creatorUid === state.uiState.currentUserId;
      });
    });

    this.groupedTournaments$ = store.select(
      state => {

        return _.chain(state.storeData.tournaments)
          .filter(function (tournament) {
            return tournament.creatorUid === state.uiState.currentUserId;
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

  ngOnInit() {
    this.store.dispatch(new TournamentsSubscribeAction());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new TournamentsUnsubscribeAction());
  }

  createTournament(): void {
    this.router.navigate(['/tournament-new']);
  }
}
