import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {StartTournamentDialogComponent} from '../tournament/tournament-preparation/tournament-preparation.component';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {Registration} from '../../../shared/model/registration';

import * as _ from 'lodash';
import {Player} from '../../../shared/model/player';
import {TournamentPlayer} from "../../../shared/model/tournament-player";

@Component({
  selector: 'show-team-dialog',
  templateUrl: './show-team-dialog.html'
})
export class ShowTeamDialogComponent {

  @Output() onKickPlayer = new EventEmitter<TournamentPlayer>();

  tournament: Tournament;
  team: TournamentTeam;
  allActualTournamentPlayers: TournamentPlayer[];
  allTournamentPlayerForTeam: TournamentPlayer[];
  userPlayerData: Player;

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.tournament = data.actualTournament;
    this.team = data.team;
    this.allActualTournamentPlayers = data.allActualTournamentPlayers;
    this.userPlayerData = data.userPlayerData;

    this.allTournamentPlayerForTeam = _.filter(data.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === data.team.teamName;
    });
  }

  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  kickPlayer(reg: TournamentPlayer) {

    this.onKickPlayer.emit(reg);
  }

  isAdmin(): boolean {

    return (this.tournament.creatorUid === this.userPlayerData.userUid);
  }

}
