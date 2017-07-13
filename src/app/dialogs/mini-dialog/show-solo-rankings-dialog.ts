import {Component, Inject} from '@angular/core';
import {ArmyList} from '../../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {TournamentRanking} from "../../../../shared/model/tournament-ranking";
import {Observable} from "rxjs/Observable";
import {Tournament} from "../../../../shared/model/tournament";
import {Player} from "../../../../shared/model/player";


@Component({
  selector: 'single-list-dialog',
  template: `
    <h3>Solo Rankings for {{actualTournament.name}}</h3>
    <md-dialog-content>
    <tournament-ranking-list
      [isAdmin]="isAdmin"
      [round]="actualTournament.actualRound"
      [actualTournament]="actualTournament"
      [actualTournamentArmyList$]="actualTournamentArmyList$"
      [rankingsForRound$]="rankingsForRound$"
      [userPlayerData]="userPlayerData"
    ></tournament-ranking-list>
    </md-dialog-content>
    <div md-dialog-actions>
      <button type="button" color="primary" md-raised-button (click)="dialogRef.close()">Close Dialog</button>
    </div>
  `
})
export class ShowSoloRankingsComponent {

  isAdmin: boolean;
  actualTournament: Tournament;
  userPlayerData: Player;

  rankingsForRound$: Observable<TournamentRanking[]>;
  actualTournamentArmyList$: Observable<ArmyList[]>;

  constructor(public dialogRef: MdDialogRef<ShowSoloRankingsComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.isAdmin = data.isAdmin;
    this.actualTournament = data.actualTournament;
    this.userPlayerData = data.userPlayerData;
    this.rankingsForRound$ = data.rankingsForRound$;
    this.actualTournamentArmyList$ = data.actualTournamentArmyList$;
  }
}
