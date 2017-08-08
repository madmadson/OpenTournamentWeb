import {Observable} from 'rxjs/Observable';
import {TournamentListVM} from '../tournament/tournamentList.vm';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';

import * as _ from 'lodash';
import * as moment from 'moment';
import {TournamentFormDialogComponent} from '../dialogs/tournament-form-dialog';
import {MdDialog} from '@angular/material';

import {Tournament} from '../../../shared/model/tournament';
import {CoOrganizatorAddAction, TournamentPushAction} from '../store/actions/tournaments-actions';
import {Component} from '@angular/core';
import {MySiteSubscribeAction} from '../store/actions/my-site-actions';
import {Registration} from '../../../shared/model/registration';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {WindowRefService} from '../service/window-ref-service';
import {Player} from '../../../shared/model/player';


@Component({
  selector: 'my-tournaments',
  templateUrl: './my-site.component.html',
  styleUrls: ['./my-site.component.scss']
})
export class MySiteComponent {
  groupedTournaments$: Observable<TournamentListVM[]>;
  allTournaments$: Observable<Tournament[]>;

  creatorId: string;
  creatorMail: string;

  myRegistrations: Registration[];
  myGames: TournamentGame[];

  smallScreen: boolean;
  loggedIn: boolean;

  userPlayerData: Player;

  constructor(private store: Store<ApplicationState>,
              public dialog: MdDialog,
              private winRef: WindowRefService) {

    this.smallScreen = this.winRef.nativeWindow.screen.width < 400;

    this.store.select(state => state.authenticationStoreState).subscribe(
      authenticationStoreState => {
        this.creatorId = authenticationStoreState.currentUserId;
        this.creatorMail = authenticationStoreState.currentUserEmail;
        if (authenticationStoreState.userPlayerData) {
          this.store.dispatch(new MySiteSubscribeAction(authenticationStoreState.userPlayerData.id));
        }
        this.loggedIn = authenticationStoreState.loggedIn;
        this.userPlayerData = authenticationStoreState.userPlayerData;
      });

    this.allTournaments$ = store.select(state => {
      return _.filter(state.tournaments.tournaments, function (tournament) {
        return tournament.creatorUid === state.authenticationStoreState.currentUserId;
      });
    });

    this.groupedTournaments$ = store.select(
      state => {

        return _.chain(state.tournaments.tournaments).sortBy(function (value) {
          return new Date(value.beginDate);
        })
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

    this.store.select(state => state.mySiteSoreData.myRegistrations).subscribe((registrations: Registration[]) => {
        this.myRegistrations = _.chain(registrations).sortBy(function (reg: Registration) {
          return new Date(reg.tournamentDate);
        }).reverse().value();
    });
     this.store.select(state => state.mySiteSoreData.myGames).subscribe((games: TournamentGame[]) => {
       this.myGames = games;
    });
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
