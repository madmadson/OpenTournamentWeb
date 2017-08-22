import {Component, EventEmitter, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Tournament} from '../../../../shared/model/tournament';

import {MdPaginator, MdSort} from '@angular/material';

import { DOCUMENT } from '@angular/common';


import {WindowRefService} from '../../service/window-ref-service';
import {PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import {GamesDataSource, GamesDatabase} from '../../../../shared/table-model/game';


@Component({
  selector: 'tournament-game-table',
  templateUrl: './tournament-game-table.component.html',
  styleUrls: ['./tournament-game-table.component.scss']
})
export class TournamentGameTableComponent implements OnInit {

  @Input() games: TournamentGame[];
  @Input() isAdmin: boolean;
  @Input() actualTournament: Tournament;

  displayedColumns = ['playingField', 'playerOnePlayerName', 'playerOneScore', 'playerTwoPlayerName', 'playerTwoScore'];
  gamesDb: GamesDatabase;
  dataSource: GamesDataSource | null;

  smallScreen: boolean;
  truncateMax: number;

  onReachBottomOfPageEvent: EventEmitter<boolean>;
  onReachTopOfPageEvent: EventEmitter<boolean>;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

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
      this.truncateMax = 25;
    }

  }

  ngOnInit() {
    this.gamesDb = new GamesDatabase(this.games);

    this.dataSource = new GamesDataSource(this.gamesDb, this.sort, this.paginator);
  }


  playerOneWon(game: TournamentGame): boolean {
    return game.playerOneScore > game.playerTwoScore;

  }

  playerTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;

  }

  startAutoScroll() {

    const that = this;

    this.onReachBottomOfPageEvent = new EventEmitter();

    this.onReachBottomOfPageEvent.subscribe( function (x) {

      if (!x) {
        that.onReachBottomOfPageEvent.complete();
      }
      that.autoScrollToTop();
    });

    this.onReachTopOfPageEvent = new EventEmitter();

    this.onReachTopOfPageEvent.subscribe( function (x) {

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



