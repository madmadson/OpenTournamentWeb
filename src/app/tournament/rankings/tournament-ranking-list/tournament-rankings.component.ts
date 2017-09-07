import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';


import * as _ from 'lodash';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {MdDialog, MdPaginator, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';

import {ArmyList} from '../../../../../shared/model/armyList';
import {Player} from '../../../../../shared/model/player';

import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/common';

import {RankingsDatabase, RankingsDataSource} from '../../../../../shared/table-model/ranking';
import {ShowArmyListDialogComponent} from '../../../dialogs/show-army-lists-dialog';
import {DropPlayerPush} from "../../../../../shared/dto/drop-player-push";


@Component({
  selector: 'tournament-rankings',
  templateUrl: './tournament-rankings.component.html',
  styleUrls: ['./tournament-rankings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentRankingsComponent implements OnInit, OnChanges {


  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;

  @Input() round: number;

  @Input() userPlayerData: Player;
  @Input() actualTournament: Tournament;

  @Input() armyLists: ArmyList[];
  @Input() rankingsForRound: TournamentRanking[];

  @Output() onDropPlayer = new EventEmitter<DropPlayerPush>();
  @Output() onUndoDropPlayer = new EventEmitter<TournamentRanking>();

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;


  displayedColumns = ['rank', 'playerName', 'faction', 'score', 'sos', 'cp', 'vp', 'action'];

  rankingsDb: RankingsDatabase;
  dataSource: RankingsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;


  smallScreen: boolean;
  truncateMax: number;

  dropRequest: string;

  constructor(@Inject(DOCUMENT) private document: any,
              private pageScrollService: PageScrollService,
              public dialog: MdDialog,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 15;
      this.displayedColumns = ['rank', 'playerName', 'score', 'sos', 'cp', 'vp', 'action'];
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  ngOnInit() {

    this.rankingsDb = new RankingsDatabase(this.rankingsForRound);

    this.dataSource = new RankingsDataSource(this.rankingsDb, this.sort, this.paginator);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.rankingsDb && propName === 'rankingsForRound') {
          this.rankingsDb.resetDatabase(change.currentValue);
        }
      }
    }
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

  isDroppable(rank: TournamentRanking) {
    return this.actualTournament.actualRound === this.round && rank.droppedInRound === 0;
  }

  isUndoDroppable(rank: TournamentRanking) {
    return this.actualTournament.actualRound === this.round && rank.droppedInRound !== 0;
  }


  clickDropPlayerRequest(ranking: TournamentRanking) {

    this.dropRequest = ranking.id;
  }

  confirmDropPlayer(ranking: TournamentRanking) {

    this.onDropPlayer.emit({
      ranking: ranking,
      round: this.actualTournament.actualRound
    });

    this.dropRequest = undefined;
  }

  dropPlayerDeclined() {


    this.dropRequest = undefined;
  }

  undoDropPlayer(ranking: TournamentRanking) {

    this.onUndoDropPlayer.emit(ranking);
  }

  startAutoScroll() {

    const that = this;

    this.onReachBottomOfPageEvent = new EventEmitter();

    this.onReachBottomOfPageEvent.subscribe(function (x) {

      if (!x) {
        that.onReachBottomOfPageEvent.complete();
      }
      that.autoScrollToTop();
    });

    this.onReachTopOfPageEvent = new EventEmitter();

    this.onReachTopOfPageEvent.subscribe(function (x) {

      if (!x) {
        that.onReachTopOfPageEvent.complete();
      }
      that.autoScrollToBottom();
    });

    this.autoScrollToBottom();
  }

  autoScrollToBottom() {

    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#bottom',
      pageScrollDuration: 30000,
      pageScrollFinishListener: this.onReachBottomOfPageEvent
    });
    this.pageScrollService.start(pageScrollInstance);
  }

  autoScrollToTop() {

    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#top',
      pageScrollDuration: 15000,
      pageScrollFinishListener: this.onReachTopOfPageEvent
    });
    this.pageScrollService.start(pageScrollInstance);
  }
}
