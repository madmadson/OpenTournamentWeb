import {Component, Inject} from '@angular/core';
import {ArmyList} from '../../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Tournament} from '../../../../shared/model/tournament';
import {Player} from '../../../../shared/model/player';


@Component({
  selector: 'single-list-dialog',
  template: `
    <h3>Solo Rankings for {{actualTournament.name}}</h3>
    <md-dialog-content>
    <tournament-rankings
      [isAdmin]="isAdmin"
      [isCoOrganizer]="isCoOrganizer"
      [isTeamTournament]="true"
      [round]="actualTournament.actualRound"
      [userPlayerData]="userPlayerData"
      [actualTournament]="actualTournament"
      [rankingsForRound]="rankingsForRound"
      [armyLists]="allArmyLists">
      
    </tournament-rankings>
    </md-dialog-content>
    <div md-dialog-actions>
      <button type="button" color="primary" md-raised-button (click)="dialogRef.close()">Close Dialog</button>
    </div>
  `
})
export class ShowSoloRankingsComponent {

  isAdmin: boolean;
  isCoOrganizer: boolean;
  actualTournament: Tournament;
  userPlayerData: Player;

  rankingsForRound: TournamentRanking[];
  allArmyLists: ArmyList[];


  constructor(public dialogRef: MdDialogRef<ShowSoloRankingsComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.isAdmin = data.isAdmin;
    this.isCoOrganizer = data.isCoOrganizer;
    this.actualTournament = data.actualTournament;
    this.userPlayerData = data.userPlayerData;
    this.rankingsForRound = data.rankingsForRound;
    this.allArmyLists = data.allArmyLists;
  }
}
