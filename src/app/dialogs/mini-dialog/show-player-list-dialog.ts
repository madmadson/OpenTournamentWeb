import {Component, Inject} from '@angular/core';
import {ArmyList} from '../../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';


@Component({
  selector: 'player-list-dialog',
  template: `
    <h3>Player List</h3>
    <md-dialog-content>
      <tournament-player-list [actualTournament]="actualTournament"
                              [tournamentPlayers]="players"
                              [userPlayerData]="userPlayerData"
                              [armyLists]="allArmyLists"
                              [isAdmin]="isAdmin"
                              [isCoOrganizer]="isCoOrganizer"
                              [isTeamTournament]="isTeamTournament">
      </tournament-player-list>
    </md-dialog-content>
    <div md-dialog-actions>
      <button type="button" color="primary" md-raised-button (click)="dialogRef.close()">Close Dialog</button>
    </div>
  `
})
export class ShowPlayerListDialogComponent {

  isAdmin: boolean;
  isCoOrganizer: boolean;
  actualTournament: Tournament;
  userPlayerData: Player;
  isTeamTournament: boolean;

  players: TournamentPlayer[];
  allArmyLists: ArmyList[];

  constructor(public dialogRef: MdDialogRef<ShowPlayerListDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.isAdmin = data.isAdmin;
    this.isCoOrganizer = data.isCoOrganizer;
    this.actualTournament = data.actualTournament;
    this.userPlayerData = data.userPlayerData;
    this.players = data.players;
    this.allArmyLists = data.allArmyLists;
    this.isTeamTournament = data.isTeamTournament;
  }
}
