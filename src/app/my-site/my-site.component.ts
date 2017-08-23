import {Observable} from 'rxjs/Observable';

import {Store} from '@ngrx/store';


import * as _ from 'lodash';
import * as moment from 'moment';
import {TournamentFormDialogComponent} from '../dialogs/tournament-form-dialog';
import {MdDialog} from '@angular/material';

import {Tournament} from '../../../shared/model/tournament';
import {TournamentPushAction} from '../store/actions/tournaments-actions';
import {Component, OnDestroy} from '@angular/core';
import {MySiteSubscribeAction} from '../store/actions/my-site-actions';
import {Registration} from '../../../shared/model/registration';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {WindowRefService} from '../service/window-ref-service';
import {Player} from '../../../shared/model/player';

import {TournamentListVM} from '../../../shared/view-model/tournamentList.vm';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from "../store/reducers/index";


@Component({
  selector: 'my-tournaments',
  templateUrl: './my-site.component.html',
  styleUrls: ['./my-site.component.scss']
})
export class MySiteComponent implements OnDestroy {
  groupedTournaments$;
  allMyTournaments$: Observable<Tournament[]>;

  creatorId: string;
  creatorMail: string;

  myRegistrations: Registration[];
  myGames: TournamentGame[];

  smallScreen: boolean;
  loggedIn: boolean;

  userPlayerData: Player;

  private authSubscription: Subscription;
  private myRegistrationsSubscription: Subscription;
  private myGamesSubscription: Subscription;

  constructor(private store: Store<AppState>,
              public dialog: MdDialog,
              private winRef: WindowRefService) {

    this.smallScreen = this.winRef.nativeWindow.screen.width < 400;

    this.authSubscription = this.store.select(state => state.authentication).subscribe(
      authenticationStoreState => {
        this.creatorId = authenticationStoreState.currentUserId;
        this.creatorMail = authenticationStoreState.currentUserEmail;
        if (authenticationStoreState.userPlayerData) {
          this.store.dispatch(new MySiteSubscribeAction(authenticationStoreState.userPlayerData.id));
        }
        this.loggedIn = authenticationStoreState.loggedIn;
        this.userPlayerData = authenticationStoreState.userPlayerData;
      });

    this.allMyTournaments$ = store.select(state => {
      return _.filter(state.tournaments.tournaments, function (tournament) {
        return tournament.creatorUid === state.authentication.currentUserId;
      });
    });

    this.groupedTournaments$ = this.store.select(
      state => {

        return _.chain(state.tournaments.tournaments).sortBy(function (value) {
          return new Date(value.beginDate);
        })
          .filter(function (tournament) {
            return tournament.creatorUid === state.authentication.currentUserId;
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

    this.myRegistrationsSubscription = this.store.select(state => state.mySite.myRegistrations).subscribe((registrations: Registration[]) => {
        this.myRegistrations = _.chain(registrations).sortBy(function (reg: Registration) {
          return new Date(reg.tournamentDate);
        }).reverse().value();
    });
    this.myGamesSubscription = this.store.select(state => state.mySite.myGames).subscribe((games: TournamentGame[]) => {
       this.myGames = games;
    });
  }

  ngOnDestroy(): void {

    this.authSubscription.unsubscribe();
    this.myRegistrationsSubscription.unsubscribe();
    this.myGamesSubscription.unsubscribe();
  }

  getMyTournamentsTitle(): string {
    if (this.smallScreen) {
      return 'Orga..';
    } else {
      return 'Organised Tournaments';
    }
  }

  getMyGamesTitle(): string {
    if (this.smallScreen) {
      return 'Games';
    } else {
      return 'Games';
    }
  }

  getMyRegistrationTitle(): string {
    if (this.smallScreen) {
      return 'Regist..';
    } else {
      return 'Registrations';
    }
  }

  openCreateTournamentDialog(): void {
    const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
      data: {
        tournament: new Tournament('', '', '', '', 16, 0, 0, 0, 0,
          this.creatorId, this.creatorMail, true, false, false, '', '', []),
        allActualTournamentPlayers: [],
        allRegistrations: [],
        tournamentTeams: 0,
        tournamentTeamRegistrations: 0
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
