import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {StartTournamentDialogComponent} from '../tournament/tournament-preparation/tournament-preparation.component';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {Registration} from '../../../shared/model/registration';

import * as _ from 'lodash';
import {Player} from '../../../shared/model/player';

@Component({
  selector: 'show-team-registration-dialog',
  templateUrl: './show-team-registration-dialog.html'
})
export class ShowTeamRegistrationDialogComponent {

  @Output() onKickPlayer = new EventEmitter<Registration>();
  @Output() onAddArmyLists = new EventEmitter<Registration>();

  tournament: Tournament;
  team: TournamentTeam;
  allRegistrations: Registration[];
  allRegistrationsForTeam: Registration[];
  userPlayerData: Player;
  myTeam: TournamentTeam;

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {


    this.tournament = data.actualTournament;
    this.team = data.team;
    this.allRegistrations = data.allRegistrations;
    this.userPlayerData = data.userPlayerData;
    this.myTeam = data.myTeam;

    this.allRegistrationsForTeam = _.filter(data.allRegistrations, function (reg: Registration) {
      return reg.teamName === data.team.teamName;
    });
  }

  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  isItMyTeamOrAdmin(team: TournamentTeam): boolean {
    if (!this.myTeam) {
      return false;
    }
    return (this.team.creatorUid === this.userPlayerData.userUid || team === this.myTeam);
  }


  kickPlayer(reg: Registration) {

    this.onKickPlayer.emit(reg);
  }

  isAdminOrTeamLeader(): boolean {

    if (!this.userPlayerData) {
      return false;

    }
    return (this.team.creatorUid === this.userPlayerData.userUid ||
    this.tournament.creatorUid === this.userPlayerData.userUid);

  }

  addArmyLists(event: any, registration: Registration) {

    event.stopPropagation();

    this.onAddArmyLists.emit(registration);
  }
}
