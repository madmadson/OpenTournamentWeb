import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {ActivatedRoute, Router} from '@angular/router';
import {
  RegistrationEraseAction,
  RegistrationPushAction, TournamentPlayerPushAction, TournamentSubscribeAction,
  TournamentUnsubscribeAction
} from '../../store/actions/tournament-actions';
import {TournamentVM} from '../tournament.vm';

import {ApplicationState} from '../../store/application-state';
import {Player} from '../../../../shared/model/player';
import {MdDialog, MdDialogRef} from '@angular/material';
import {RegistrationVM} from '../registration.vm';
import {Registration} from '../../../../shared/model/registration';

import * as _ from 'lodash';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';


@Component({
  selector: 'tournament-preparation',
  templateUrl: './tournament-preparation.component.html',
  styleUrls: ['./tournament-preparation.component.css']
})
export class TournamentPreparationComponent implements OnInit, OnDestroy {
  private tournamentId: string;

  actualTournament: TournamentVM;
  userPlayerData: Player;
  actualTournamentRegisteredPlayers: Registration[];
  actualTournamentPlayers: TournamentPlayer[];

  myRegistration: Registration;
  myTournament: boolean;
  loggedIn: boolean;

  constructor(private store: Store<ApplicationState>,
              private activeRouter: ActivatedRoute,
              private router: Router,
              public dialog: MdDialog) {

  }

  ngOnInit() {

    const that = this;

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentId = params['id'];
        this.store.dispatch(new TournamentSubscribeAction(params['id']));
      }
    );


    this.store.select(state => state)
      .subscribe(state => {

        this.userPlayerData = state.authenticationState.userPlayerData;
        this.actualTournament = state.storeData.actualTournament;

        this.actualTournamentRegisteredPlayers = state.tournamentData.actualTournamentRegisteredPlayers;
        this.actualTournamentPlayers = state.tournamentData.actualTournamentPlayers;
        this.loggedIn = state.authenticationState.loggedIn;

        that.myRegistration = _.find(state.tournamentData.actualTournamentRegisteredPlayers,
          function (reg) {
            if (state.authenticationState.userPlayerData !== undefined) {
              return reg.playerId === state.authenticationState.userPlayerData.id;
            }
          });

        that.myTournament = (state.storeData.actualTournament.creatorUid === state.authenticationState.currentUserId);

      });

  }

  ngOnDestroy() {
    this.store.dispatch(new TournamentUnsubscribeAction());
  }

  openRegistrationDialog() {


    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined) {
        this.store.dispatch(new RegistrationPushAction(result));
      }

    });
  }

  onSaveTournamentPlayer(registration: Registration) {
    if (registration !== undefined) {
      this.store.dispatch(new TournamentPlayerPushAction(registration));
    }
  }
  onDeleteRegistration(registration: Registration) {
    if (registration !== undefined) {
      this.store.dispatch(new RegistrationEraseAction(registration));
    }
  }

  onAddArmyLists(registration: Registration) {
    if (registration !== undefined) {
      const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
        data: {
          registration: registration
        }
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result !== undefined) {
          this.store.dispatch(new RegistrationPushAction(result));
        }

      });
    }
  }
}


@Component({
  selector: 'registration-dialog',
  templateUrl: './registration-dialog.html'
})
export class RegisterDialogComponent {

  userPlayerData: Player;
  actualTournament: TournamentVM;

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>) {

    this.userPlayerData = dialogRef.config.data.userPlayerData;
    this.actualTournament = dialogRef.config.data.actualTournament;
  }

  onSaveRegistration(registration: RegistrationVM) {

    this.dialogRef.close(registration);
  }
}

@Component({
  selector: 'add-army-lists-dialog',
  templateUrl: './add-army-lists-dialog.html'
})
export class AddArmyListsDialogComponent {

  registration: Registration;

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>) {

    this.registration = dialogRef.config.data.registration;
  }

  onSaveArmyList(registration: Registration) {

    this.dialogRef.close(registration);
  }
}
