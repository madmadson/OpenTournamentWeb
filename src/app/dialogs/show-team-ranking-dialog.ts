import {Component, Inject} from '@angular/core';

import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {StartTournamentDialogComponent} from '../tournament/tournament-preparation/tournament-preparation.component';
import {TournamentTeam} from '../../../shared/model/tournament-team';

import * as _ from 'lodash';
import {Player} from '../../../shared/model/player';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {Observable} from "rxjs/Observable";
import {ArmyList} from "../../../shared/model/armyList";
import {ShowArmyListInTournamentRankingDialogComponent} from "../tournament/tournament-ranking-list/tournament-ranking-list.component";

@Component({
  selector: 'show-team-ranking-dialog',
  templateUrl: './show-team-ranking-dialog.html',
  styleUrls: ['./show-team-ranking-dialog.css']
})
export class ShowTeamRankingDialogComponent {

  teamRanking: TournamentRanking;
  rankingsForTeam: TournamentRanking[];
  armyLists: ArmyList[];
  allPlayerRankingsForRound$: Observable<TournamentRanking[]>;
  actualTournamentArmyList$: Observable<ArmyList[]>;
  userPlayerData: Player;

  constructor(public dialog: MdDialog,
              public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.teamRanking = data.team;
    this.userPlayerData = data.userPlayerData;
    this.allPlayerRankingsForRound$ = data.allPlayerRankingsForRound$;
    this.actualTournamentArmyList$ = data.actualTournamentArmyList$;

    this.allPlayerRankingsForRound$.subscribe(playerRankings => {
      this.rankingsForTeam = _.filter(playerRankings, function (playerRanking: TournamentRanking) {
        return playerRanking.teamName === data.team.playerName;

      });
    });

    this.actualTournamentArmyList$.subscribe(armyLists => {
      this.armyLists = armyLists;
    });
  }

  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  hasArmyList(ranking: TournamentRanking): boolean {

    let hasArmyList = false;

    if (this.armyLists) {

      _.each(this.armyLists, function (armyList: ArmyList) {
        if (armyList.playerId === ranking.playerId) {
          hasArmyList = true;
        }
      });
    }

    return hasArmyList;
  }

  openArmyListDialog(ranking: TournamentRanking){

    const myArmyLists: ArmyList[] = _.filter(this.armyLists, function (list: ArmyList) {
      if (list.tournamentPlayerId) {
        return (list.tournamentPlayerId === ranking.tournamentPlayerId);
      } else {
        return (list.playerId === ranking.playerId);
      }
    });

    this.dialog.open(ShowArmyListInTournamentRankingDialogComponent, {
      data: {
        ranking: ranking,
        armyLists: myArmyLists
      }
    });
  }
}
