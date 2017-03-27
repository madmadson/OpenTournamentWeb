import {Component, OnDestroy, OnInit} from "@angular/core";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {TournamentListVM} from "../tournament.vm";
import {TournamentsSubscribeAction, TournamentsUnsubscribeAction} from "../../store/actions/tournament-actions";
import * as _ from "lodash";
import * as moment from "moment";

@Component({
  selector: 'tournament-overview',
  templateUrl: 'tournament-overview.component.html',
  styleUrls: ['tournament-overview.component.css']
})
export class TournamentOverviewComponent implements OnInit, OnDestroy {

  allTournaments$: Observable<TournamentListVM[]>;

  constructor(private store: Store<ApplicationState>) {

    this.allTournaments$ = store.select(
      state => {
        console.log('tournaments: ' + JSON.stringify(state.storeData.tournaments));
        return _.chain(state.storeData.tournaments)
          .groupBy(function (tournament) {
            return moment(tournament.beginDate).format('MMMM YYYY');
          }).toPairs()
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
}
