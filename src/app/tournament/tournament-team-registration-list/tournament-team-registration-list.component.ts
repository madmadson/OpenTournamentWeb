import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {MdDialog} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';
import {Registration} from '../../../../shared/model/registration';

import * as _ from 'lodash';
import {RegisterDialogComponent} from '../tournament-preparation/tournament-preparation.component';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {ShowTeamRegistrationDialogComponent} from '../../dialogs/show-team-registration-dialog';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';
import {NewTournamentPlayerDialogComponent} from "../../dialogs/add-tournament-player-dialog";
import {TournamentPlayer} from "../../../../shared/model/tournament-player";


@Component({
  selector: 'tournament-team-registration-list',
  templateUrl: './tournament-team-registration-list.component.html',
  styleUrls: ['./tournament-team-registration-list.component.css']
})
export class TournamentTeamRegistrationListComponent {

  @Input() actualTournamentTeamRegistrations$: Observable<TournamentTeam[]>;
  @Input() allRegistrations: Registration[];
  @Input() myRegistration: Registration;
  @Input() actualTournament: Tournament;
  @Input() userPlayerData: Player;

  @Output() onAddTournamentRegistration = new EventEmitter<Registration>();
  @Output() onKickPlayer = new EventEmitter<Registration>();
  @Output() onAcceptTeamRegistration = new EventEmitter<TeamRegistrationPush>();

  truncateMax: number;
  smallScreen: boolean;

  constructor(public dialog: MdDialog,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 10;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  isAdmin(): boolean {
    if (this.actualTournament && this.userPlayerData) {
      return this.actualTournament.creatorUid === this.userPlayerData.userUid;
    }
    return false;
  }

  joinTeam(event: any, team: TournamentTeam) {

      event.stopPropagation();

      const dialogRef = this.dialog.open(RegisterDialogComponent, {
        data: {
          actualTournament: this.actualTournament,
          userPlayerData: this.userPlayerData,
          team: team,
        }
      });

      const saveEventSubscribe = dialogRef.componentInstance.onAddTournamentRegistration.subscribe(registration => {

        if (registration !== undefined) {
          this.onAddTournamentRegistration.emit(registration);
        }
      });
      dialogRef.afterClosed().subscribe(() => {

        saveEventSubscribe.unsubscribe();
      });

  }

  acceptTeamRegistration(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === team.teamName;
    });

    this.onAcceptTeamRegistration.emit({
      tournament: this.actualTournament,
      team: team,
      registrations: allPlayersForTeam
    });
  }

  showTeam(team: TournamentTeam) {

    const dialogRef = this.dialog.open(ShowTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        team: team,
        allRegistrations: this.allRegistrations
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onKickPlayer.subscribe(registration => {

      if (registration !== undefined) {
        this.onKickPlayer.emit(registration);
        dialogRef.close();
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });

  }

  getPlayersForTeam(teamName: string): number {
    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === teamName;
    });

    return allPlayersForTeam.length;
  }

  checkTournamentFull(team: TournamentTeam) {
    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === team.teamName;
    });

    return allPlayersForTeam.length >= this.actualTournament.teamSize;
  }

}