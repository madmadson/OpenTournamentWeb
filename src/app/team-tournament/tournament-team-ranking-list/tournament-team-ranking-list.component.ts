import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Player} from '../../../../shared/model/player';
import { MdDialog} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';

import * as _ from 'lodash';
import {ShowTeamRankingDialogComponent} from '../../dialogs/show-team-ranking-dialog';
import {ShowArmyListDialogComponent} from '../../dialogs/show-army-lists-dialog';
import {Tournament} from "../../../../shared/model/tournament";
import {DropPlayerPush} from "../../../../shared/dto/drop-player-push";

@Component({
  selector: 'tournament-team-ranking-list',
  templateUrl: './tournament-team-ranking-list.component.html',
  styleUrls: ['./tournament-team-ranking-list.component.scss']
})
export class TournamentTeamRankingListComponent implements OnInit {

  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() actualTournament: Tournament;
  @Input() round: number;

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() teamRankingsForRound$: Observable<TournamentRanking[]>;
  @Input() playerRankingsForRound$: Observable<TournamentRanking[]>;
  @Input() userPlayerData: Player;

  @Output() onDropTeam = new EventEmitter<DropPlayerPush>();
  @Output() onUndoDropTeam = new EventEmitter<TournamentRanking>();

  armyLists: ArmyList[];
  orderedTeamRankings: TournamentRanking[];

  smallScreen: boolean;
  truncateMax: number;

  deleteRequest: string;

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
     this.orderedTeamRankings =  _.orderBy(rankings, ['score', 'secondScore', 'controlPoints', 'victoryPoints'], ['desc', 'desc', 'desc', 'desc']);
    });
  }

  showTeam(event: any, team: TournamentRanking) {

    event.stopPropagation();

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

    this.dialog.open(ShowArmyListDialogComponent, {
      data: {
        tournamentRank: team,
        armyLists: teamArmyLists
      }
    });
  }

  isDroppable(rank: TournamentRanking) {
    return (!rank.droppedInRound || rank.droppedInRound === 0) &&
            (this.actualTournament.actualRound === this.round);
  }

  dropRequest(event: any, ranking: TournamentRanking) {

    event.stopPropagation();

    this.deleteRequest = ranking.id;
  }

  dropConfirm(event: any, ranking: TournamentRanking){
    event.stopPropagation();

    this.onDropTeam.emit({
      ranking: ranking,
      round: this.actualTournament.actualRound
    });

    this.deleteRequest = '';
  }

  dropDeclined(event: any) {
    event.stopPropagation();

    this.deleteRequest = '';
  }

  undoDropPlayer(event: any, ranking: TournamentRanking) {

    event.stopPropagation();

    this.onUndoDropTeam.emit(ranking);
  }
}




