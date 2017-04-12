import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ArmyListEraseAction,
  PushArmyListAction, PushNewTournamentPlayerAction,
  RegistrationEraseAction,
  RegistrationPushAction, TournamentPlayerEraseAction, TournamentPlayerPushAction, TournamentSubscribeAction,
  TournamentUnsubscribeAction
} from '../../store/actions/tournament-actions';
import {TournamentVM} from '../tournament.vm';
import {ApplicationState} from '../../store/application-state';
import {Player} from '../../../../shared/model/player';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import {Registration} from '../../../../shared/model/registration';

import * as _ from 'lodash';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {ArmyList} from '../../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';


import {getAllCountries} from '../../../../shared/model/countries';

import {Tournament} from '../../../../shared/model/tournament';


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
  actualTournamentArmyList$: Observable<ArmyList[]>;

  myRegistration: Registration;
  myTournament: boolean;
  loggedIn: boolean;

  constructor(private store: Store<ApplicationState>,
              private activeRouter: ActivatedRoute,
              public dialog: MdDialog,
              private snackBar: MdSnackBar) {

  }

  ngOnInit() {

    const that = this;

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentId = params['id'];
        this.store.dispatch(new TournamentSubscribeAction(params['id']));
      }
    );

    this.actualTournamentArmyList$ = this.store.select(state => state.tournamentData.actualTournamentArmyLists);

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
      const alreadyRegistered = _.find(this.actualTournamentPlayers, function (tournamentPlayer: TournamentPlayer) {
        return tournamentPlayer.playerId === registration.playerId;
      });
      if (alreadyRegistered) {
        this.snackBar.open('Player already in Tournament', '', {
          duration: 5000
        });
      } else {
        this.store.dispatch(new TournamentPlayerPushAction(registration));
      }
    }

  }

  onDeleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    if (tournamentPlayer !== undefined) {
      this.store.dispatch(new TournamentPlayerEraseAction(tournamentPlayer));
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
          registration: registration,
          armyListForRegistration: this.actualTournamentArmyList$
        }
      });
      const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.store.dispatch(new PushArmyListAction(armyList));
        }
      });
      const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.store.dispatch(new ArmyListEraseAction(armyList));
        }
      });

      dialogRef.afterClosed().subscribe(() => {

        saveEventSubscribe.unsubscribe();
        deleteEventSubscribe.unsubscribe();
      });
    }
  }

  addTournamentPlayer() {


    const dialogRef = this.dialog.open(NewTournamentPlayerDialogComponent, {
      data: {
        actualTournament: this.actualTournament
      },
      height: '500px',
      width: '800px',
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveNewTournamentPlayer.subscribe(tournamentPlayer => {

      if (tournamentPlayer !== undefined) {
        this.store.dispatch(new PushNewTournamentPlayerAction(tournamentPlayer));
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
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

  onSaveRegistration(registration: Registration) {

    this.dialogRef.close(registration);
  }
}

@Component({
  selector: 'add-offline-player-dialog',
  templateUrl: './add-tournament-player-dialog.html'
})
export class NewTournamentPlayerDialogComponent {

  tournamentPlayerModel: TournamentPlayer;
  tournament: Tournament;

  countries: string[];

  @Output() onSaveNewTournamentPlayer = new EventEmitter<TournamentPlayer>();

  constructor(public dialogRef: MdDialogRef<NewTournamentPlayerDialogComponent>) {

    this.countries = getAllCountries();
    this.tournament = dialogRef.config.data.actualTournament;

    this.tournamentPlayerModel = {tournamentId: this.tournament.id, playerName: '', origin: '', meta: '', country: ''};
  }

  saveTournamentPlayer() {
    if (this.tournamentPlayerModel.playerName !== '') {
      this.onSaveNewTournamentPlayer.emit(this.tournamentPlayerModel);
      this.dialogRef.close();
    }
  }


}

@Component({
  selector: 'add-army-lists-dialog',
  templateUrl: './add-army-lists-dialog.html'
})
export class AddArmyListsDialogComponent {

  registration: Registration;
  armyListForRegistration: ArmyList[];

  armyListModel: ArmyList;

  @Output() onSaveArmyList = new EventEmitter<ArmyList>();
  @Output() onDeleteArmyList = new EventEmitter<ArmyList>();

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>) {

    const that = this;
    this.registration = dialogRef.config.data.registration;

    this.armyListModel = new ArmyList(this.registration.tournamentId, this.registration.playerId, '', '');

    dialogRef.config.data.armyListForRegistration.subscribe(armyLists => {
      this.armyListForRegistration = _.filter(armyLists, function (armyList: ArmyList) {
        if (that.registration !== undefined) {
          return armyList.playerId === that.registration.playerId;
        }
      });
    });
  }

  addArmyList() {
    this.onSaveArmyList.emit(this.armyListModel);
    this.armyListModel = new ArmyList(this.registration.tournamentId, this.registration.playerId, '', '');
  };

  deleteArmyList(armyList: ArmyList) {
    this.onDeleteArmyList.emit(armyList);
  };
}
