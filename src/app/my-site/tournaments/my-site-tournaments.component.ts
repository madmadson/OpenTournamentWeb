import {Observable} from 'rxjs/Observable';

import {Store} from '@ngrx/store';


import * as _ from 'lodash';
import * as moment from 'moment';
import {TournamentFormDialogComponent} from '../../dialogs/tournament-form-dialog';
import {MdDialog} from '@angular/material';

import {Tournament} from '../../../../shared/model/tournament';
import {TournamentPushAction} from '../../store/actions/tournaments-actions';
import {Component, OnDestroy} from '@angular/core';
import {MySiteSubscribeAction} from '../../store/actions/my-site-actions';
import {Registration} from '../../../../shared/model/registration';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {WindowRefService} from '../../service/window-ref-service';
import {Player} from '../../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../store/reducers/index';
import {Router} from '@angular/router';
import {MyTournamentsService} from './my-tournaments.service';


@Component({
  selector: 'my-site-tournaments',
  templateUrl: './my-site-tournaments.component.html',
  styleUrls: ['./my-site-tournaments.component.scss']
})
export class MySiteTournamentsComponent implements OnDestroy {

  allMyTournaments$: Observable<Tournament[]>;
  loadMyTournaments$: Observable<boolean>;
  allMyTournamentsGrouped$: Observable<any>;
  userPlayerData$: Observable<Player>;
  userPlayerSubscription: Subscription;

  router: Router;

  constructor(private _router: Router,
              private store: Store<AppState>,
              public dialog: MdDialog,
              private myTournamentsService: MyTournamentsService,
              private winRef: WindowRefService) {

    this.router = _router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);

    this.userPlayerSubscription = this.userPlayerData$.subscribe((player: Player) => {
      if (player && player.id) {
        this.myTournamentsService.subscribeOnFirebaseMyTournaments(player.userUid);
      }

    });

    this.allMyTournaments$ = this.store.select(state => state.myTournaments.myTournaments);
    this.loadMyTournaments$ = this.store.select(state => state.myTournaments.loadMyTournaments);
    this.allMyTournamentsGrouped$ = this.allMyTournaments$.map((tournaments: Tournament[]) => {
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


  ngOnDestroy(): void {

    this.myTournamentsService.unsubscribeOnFirebaseMyTournaments();
    this.userPlayerSubscription.unsubscribe();

  }

  // getMyTournamentsTitle(): string {
  //   if (this.smallScreen) {
  //     return 'Orga..';
  //   } else {
  //     return 'Organised Tournaments';
  //   }
  // }
  //
  // getMyGamesTitle(): string {
  //   if (this.smallScreen) {
  //     return 'Games';
  //   } else {
  //     return 'Games';
  //   }
  // }
  //
  // getMyRegistrationTitle(): string {
  //   if (this.smallScreen) {
  //     return 'Regist..';
  //   } else {
  //     return 'Registrations';
  //   }
  // }
  //
  // openCreateTournamentDialog(): void {
  //   const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
  //     data: {
  //       tournament: new Tournament('', '', '', '', 16, 0, 0, 0, 0,
  //         this.creatorId, this.creatorMail, true, false, false, '', '', []),
  //       allActualTournamentPlayers: [],
  //       allRegistrations: [],
  //       tournamentTeams: 0,
  //       tournamentTeamRegistrations: 0
  //     },
  //     width: '800px'
  //   });
  //
  //   const saveEventSubscribe = dialogRef.componentInstance.onSaveTournament.subscribe(tournament => {
  //     if (tournament) {
  //       this.store.dispatch(new TournamentPushAction(tournament));
  //     }
  //     dialogRef.close();
  //   });
  //
  //   dialogRef.afterClosed().subscribe(() => {
  //
  //     saveEventSubscribe.unsubscribe();
  //   });
  // }
}
