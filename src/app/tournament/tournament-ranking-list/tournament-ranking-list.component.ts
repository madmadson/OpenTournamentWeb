import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Player} from '../../../../shared/model/player';

import * as _ from 'lodash';

import {ArmyList} from '../../../../shared/model/armyList';
import {MdDialog} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';
import {ShowArmyListDialogComponent} from '../../dialogs/show-army-lists-dialog';
import {DropPlayerPush} from '../../../../shared/dto/drop-player-push';
import {Tournament} from '../../../../shared/model/tournament';

@Component({
  selector: 'tournament-ranking-list',
  templateUrl: './tournament-ranking-list.component.html',
  styleUrls: ['./tournament-ranking-list.component.scss']
})
export class TournamentRankingListComponent implements OnInit {

  @Input() isAdmin: boolean;
  @Input() actualTournament: Tournament;
  @Input() round: number;

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() userPlayerData: Player;

  @Output() onDropPlayer = new EventEmitter<DropPlayerPush>();
  @Output() onUndoDropPlayer = new EventEmitter<TournamentRanking>();

  armyLists: ArmyList[];
  orderedRankings$: Observable<TournamentRanking[]>;

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

    this.orderedRankings$ = this.rankingsForRound$.map(rankings => {
      return _.orderBy(rankings, ['droppedInRound', 'score', 'sos', 'controlPoints', 'victoryPoints'],
        ['asc', 'desc', 'desc', 'desc', 'desc']);
    });
  }

  isItMe(id: string): boolean {
    if (this.userPlayerData) {
      return (id === this.userPlayerData.id);
    }
  }

  isDroppable(rank: TournamentRanking) {
    return (!rank.droppedInRound || rank.droppedInRound === 0) &&
            (this.actualTournament.actualRound === this.round);
  }


  showArmyList(ranking: TournamentRanking) {

    const myArmyLists: ArmyList[] = _.filter(this.armyLists, function (list: ArmyList) {
      if (list.tournamentPlayerId) {
        return (list.tournamentPlayerId === ranking.tournamentPlayerId);
      } else {
        return (list.playerId === ranking.playerId);
      }
    });

    this.dialog.open(ShowArmyListDialogComponent, {
      data: {
        ranking: ranking,
        armyLists: myArmyLists
      }
    });
  }

  dropRequest(event: any, ranking: TournamentRanking) {

    event.stopPropagation();

    this.deleteRequest = ranking.id;
  }

  dropConfirm(event: any, ranking: TournamentRanking){
    event.stopPropagation();

    this.onDropPlayer.emit({
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

    this.onUndoDropPlayer.emit(ranking);
  }
}
