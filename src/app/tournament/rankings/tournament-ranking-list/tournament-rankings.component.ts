import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, SimpleChanges, OnChanges
} from '@angular/core';


import * as _ from 'lodash';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {TournamentGame} from '../../../../../shared/model/tournament-game';
import {ScenarioSelectedModel} from '../../../../../shared/dto/scenario-selected-model';
import {SwapGames} from '../../../../../shared/dto/swap-player';
import {GameResult} from '../../../../../shared/dto/game-result';
import {MdPaginator, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';

import {ArmyList} from '../../../../../shared/model/armyList';
import {Player} from '../../../../../shared/model/player';

import {PageScrollInstance, PageScrollService} from 'ng2-page-scroll';
import {DOCUMENT} from '@angular/common';

import {RankingsDatabase, RankingsDataSource} from '../../../../../shared/table-model/ranking';



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

  @Output() onGameResultEntered = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onScenarioSelected = new EventEmitter<ScenarioSelectedModel>();

  @Output() onClearPlayerGameResult = new EventEmitter<TournamentGame>();

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;


  displayedColumns = ['playerName', 'score', 'sos', 'cp', 'vp'];

  rankingsDb: RankingsDatabase;
  dataSource: RankingsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;


  smallScreen: boolean;
  truncateMax: number;

  constructor(@Inject(DOCUMENT) private document: any,
              private pageScrollService: PageScrollService,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 10;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
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

}
