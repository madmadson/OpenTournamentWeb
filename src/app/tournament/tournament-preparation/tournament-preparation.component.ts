import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {ActivatedRoute, Router} from '@angular/router';
import {RegistrationPushAction, TournamentSubscribeAction} from '../../store/actions/tournament-actions';
import {TournamentVM} from '../tournament.vm';

import {ApplicationState} from '../../store/application-state';
import {Player} from '../../../../shared/model/player';
import {MdDialog, MdDialogRef} from '@angular/material';
import {RegistrationVM} from '../registration.vm';
import {Registration} from '../../../../shared/model/registration';

import * as _ from 'lodash';


@Component({
  selector: 'tournament-preparation',
  templateUrl: './tournament-preparation.component.html',
  styleUrls: ['./tournament-preparation.component.css']
})
export class TournamentPreparationComponent implements OnInit {
  private tournamentId: string;

  actualTournament: TournamentVM;
  playerData: Player;
  actualTournamentRegisteredPlayers: Registration[];

  myRegistration: Registration;

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
    this.store.select(state => state.storeData)
      .subscribe(storeData => {
        this.playerData = storeData.playerData;
        console.log('playerData' + JSON.stringify(this.playerData));
        this.actualTournament = storeData.actualTournament;
      });

    this.store.select(state => state.tournamentData)
      .subscribe(tournamentData => {
        if (that.playerData) {
          that.myRegistration = _.find(tournamentData.actualTournamentRegisteredPlayers,
            function (reg) {
              return reg.playerId === that.playerData.id;
            });
        }
        this.actualTournamentRegisteredPlayers = tournamentData.actualTournamentRegisteredPlayers;
      });
  }

  openRegistrationDialog() {


    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        playerData: this.playerData
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.store.dispatch(new RegistrationPushAction(result));

    });
  }
}


@Component({
  selector: 'registration-dialog',
  templateUrl: './registration-dialog.html'
})
export class RegisterDialogComponent {

  playerData: Player;
  actualTournament: TournamentVM;

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>) {

    this.playerData = dialogRef.config.data.playerData;
    this.actualTournament = dialogRef.config.data.actualTournament;
  }

  onSaveRegistration(registration: RegistrationVM) {

    this.dialogRef.close(registration);
  }
}
