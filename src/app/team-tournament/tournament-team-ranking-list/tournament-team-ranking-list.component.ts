import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Player} from '../../../../shared/model/player';
import { MdDialog} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';
import {ShowTeamDialogComponent} from '../../dialogs/show-team-dialog';

import * as _ from 'lodash';
import {ShowTeamRankingDialogComponent} from "../../dialogs/show-team-ranking-dialog";
import {TournamentTeam} from "../../../../shared/model/tournament-team";
import {ShowArmyListDialogComponent} from "../../dialogs/show-army-lists-dialog";

@Component({
  selector: 'tournament-team-ranking-list',
  templateUrl: './tournament-team-ranking-list.component.html',
  styleUrls: ['./tournament-team-ranking-list.component.css']
})
export class TournamentTeamRankingListComponent implements OnInit {

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() teamRankingsForRound$: Observable<TournamentRanking[]>;
  @Input() playerRankingsForRound$: Observable<TournamentRanking[]>;
  @Input() userPlayerData: Player;

  armyLists: ArmyList[];
  orderedTeamRankings: TournamentRanking[];

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

    this.teamRankingsForRound$.subscribe(rankings => {
     this.orderedTeamRankings =  _.orderBy(rankings, ['score', 'sos', 'controlPoints', 'victoryPoints'], ['desc', 'desc', 'desc', 'desc']);
    });
  }

  showTeam(team: TournamentRanking) {


    this.dialog.open(ShowTeamRankingDialogComponent, {
      data: {
        userPlayerData: this.userPlayerData,
        team: team,
        allPlayerRankingsForRound$: this.playerRankingsForRound$,
        actualTournamentArmyList$: this.actualTournamentArmyList$
      }
    });
  }

  showTeamArmyList(event: any, team: TournamentRanking) {

    event.stopPropagation();

    const teamArmyLists: ArmyList[] = _.filter(this.armyLists, function (list: ArmyList) {
      if (list.teamName) {
        return (list.teamName === team.playerName);
      }
    });

    console.log('show team teamArmyLists' + JSON.stringify(this.armyLists));

    this.dialog.open(ShowArmyListDialogComponent, {
      data: {
        tournamentRank: team,
        armyLists: teamArmyLists
      }
    });
  }
}




