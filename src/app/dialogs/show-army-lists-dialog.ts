import {Component, Inject} from '@angular/core';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {TournamentPlayer} from '../../../shared/model/tournament-player';


@Component({
  selector: 'show-army-list-dialog',
  templateUrl: 'show-army-lists-dialog.html'
})
export class ShowArmyListDialogComponent {

  ranking: TournamentRanking;
  tournamentPlayer: TournamentPlayer;
  tournamentTeam: TournamentTeam;

  armyLists: ArmyList[];

  constructor(public dialogRef: MdDialogRef<ShowArmyListDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.ranking = data.ranking;
    this.tournamentPlayer = data.tournamentPlayer;
    this.tournamentTeam = data.tournamentTeam;


    this.armyLists = data.armyLists;
  }


}
