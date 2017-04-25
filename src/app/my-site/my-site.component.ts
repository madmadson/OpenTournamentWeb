
import {Observable} from 'rxjs/Observable';
import {TournamentListVM} from '../tournament/tournamentList.vm';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';

import * as _ from 'lodash';
import * as moment from 'moment';
import {TournamentFormDialogComponent} from '../dialogs/tournament-form-dialog';
import {MdDialog} from '@angular/material';

import {Tournament} from '../../../shared/model/tournament';
import {TournamentPushAction} from '../store/actions/tournaments-actions';
import {Component} from '@angular/core';

@Component({
  selector: 'my-tournaments',
  templateUrl: './my-site.component.html',
  styleUrls: ['./my-site.component.css']
})
export class MySiteComponent {
  groupedTournaments$: Observable<TournamentListVM[]>;
  allTournaments$: Observable<any[]>;

  creatorId: string;

  constructor(private store: Store<ApplicationState>,
              public dialog: MdDialog) {

    this.store.select(state => state.authenticationStoreState.currentUserId)
      .subscribe(currentUserId => this.creatorId = currentUserId);

    this.allTournaments$ = store.select(state => {
      return _.filter(state.tournaments.tournaments, function (tournament) {
        return tournament.creatorUid === state.authenticationStoreState.currentUserId;
      });
    });

    this.groupedTournaments$ = store.select(
      state => {

        return _.chain(state.tournaments.tournaments)
          .filter(function (tournament) {
            return tournament.creatorUid === state.authenticationStoreState.currentUserId;
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

  openCreateTournamentDialog(): void {
    const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
      data: {
        tournament: new Tournament('', '', '', '', 16, 0, 0, 0, 0, this.creatorId, false, false)
      },
      width: '800px'
    });

    const saveEventSubscribe = dialogRef.componentInstance.onSaveTournament.subscribe(tournament => {
      if (tournament) {
        this.store.dispatch(new TournamentPushAction(tournament));
      }
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }
}
