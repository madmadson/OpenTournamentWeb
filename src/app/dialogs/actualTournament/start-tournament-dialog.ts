import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

import * as _ from 'lodash';

@Component({
  selector: 'start-tournament-dialog',
  templateUrl: './start-tournament-dialog.html'
})
export class StartTournamentDialogComponent {

  allActualTournamentPlayers: TournamentPlayer[];
  allActualTournamentTeams: TournamentTeam[];
  suggestedRoundsToPlay: number;
  actualTournament: Tournament;

  @Output() onStartTournament = new EventEmitter<TournamentManagementConfiguration>();

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.actualTournament = data.actualTournament;

    this.allActualTournamentPlayers = data.allActualTournamentPlayers;
    if (data.actualTournament.teamSize === 0) {
      this.suggestedRoundsToPlay = Math.ceil(Math.log2(this.allActualTournamentPlayers.length));
    }

    this.allActualTournamentTeams  = data.allActualTournamentTeams;
    if (data.actualTournament.teamSize > 0) {
      this.suggestedRoundsToPlay = Math.ceil(Math.log2( this.allActualTournamentTeams.length));
    }

  }


  checkAllTeamsAreFull(): boolean {

    const that = this;

    let allTeamsFull = true;

    _.forEach(this.allActualTournamentTeams, function (team: TournamentTeam) {

      const playersFromTeam = _.filter(that.allActualTournamentPlayers, function (player: TournamentPlayer) {
        return team.teamName === player.teamName;
      });
      if (that.actualTournament.teamSize > playersFromTeam.length) {
        allTeamsFull = false;
      }
    });
    return allTeamsFull;
  }

  checkNoTeamIsOver9000(): boolean {

    const that = this;

    let teamIsOver9000 = false;

    _.forEach(this.allActualTournamentTeams, function (team: TournamentTeam) {

      const playersFromTeam = _.filter(that.allActualTournamentPlayers, function (player: TournamentPlayer) {
        return team.teamName === player.teamName;
      });
      if (that.actualTournament.teamSize < playersFromTeam.length) {
        teamIsOver9000 = true;
      }
    });
    return teamIsOver9000;
  }

  startTournament() {

    this.onStartTournament.emit({
      tournamentId: '',
      round: 1,
      teamRestriction: this.teamRestriction,
      metaRestriction: this.metaRestriction,
      originRestriction: this.originRestriction,
      countryRestriction: this.countryRestriction,
    });
    this.dialogRef.close();
  }
}
