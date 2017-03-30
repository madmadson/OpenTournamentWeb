import {Component} from "@angular/core";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {TournamentListVM} from "../tournament.vm";

import * as _ from "lodash";
import * as moment from "moment";

@Component({
  selector: 'tournament-overview',
  templateUrl: 'tournament-overview.component.html',
  styleUrls: ['tournament-overview.component.css']
})
export class TournamentOverviewComponent  {

    groupedTournaments$: Observable<TournamentListVM[]>;
    allTournaments$: Observable<any[]>;

  constructor(private store: Store<ApplicationState>) {

    this.allTournaments$ = store.select(state => state.storeData.tournaments);

    this.groupedTournaments$ = store.select(
      state => {
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
}
