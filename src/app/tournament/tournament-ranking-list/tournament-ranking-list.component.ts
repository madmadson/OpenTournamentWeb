import {Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Player} from '../../../../shared/model/player';

import * as _ from 'lodash';

import {ArmyList} from '../../../../shared/model/armyList';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';

@Component({
  selector: 'tournament-ranking-table',
  templateUrl: './tournament-ranking-list.component.html',
  styleUrls: ['./tournament-ranking-list.component.css']
})
export class TournamentRankingListComponent implements OnInit {

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() userPlayerData: Player;

  armyLists: ArmyList[];
  orderedRankings$: Observable<TournamentRanking[]>;

  smallScreen: boolean;
  truncateMax: number;

  constructor(public dialog: MdDialog,
              private winRef: WindowRefService) {

   if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  ngOnInit() {

    this.actualTournamentArmyList$.subscribe(armyLists => {
      this.armyLists = armyLists;
    });

    this.orderedRankings$ = this.rankingsForRound$.map(rankings => {
      return _.orderBy(rankings, ['score', 'sos', 'controlPoints', 'victoryPoints'], ['desc', 'desc', 'desc', 'desc']);
    });
  }

  isItMe(id: string): boolean {
    if (this.userPlayerData) {
      return (id === this.userPlayerData.id);
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


@Component({
  selector: 'show-army-list-dialog',
  templateUrl: './show-army-list-dialog.html'
})
export class ShowArmyListInTournamentRankingDialogComponent {

  ranking: TournamentRanking;
  armyLists: ArmyList[];

  constructor(public dialogRef: MdDialogRef<ShowArmyListInTournamentRankingDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.ranking = data.ranking;
    this.armyLists = data.armyLists;
  }


}
