import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {WindowRefService} from '../../service/window-ref-service';
import {Player} from '../../../../shared/model/player';
import {PlayerDatabase, PlayersDataSource} from '../../../../shared/table-model/player';
import {MdPaginator, MdSort} from '@angular/material';

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerListComponent implements OnInit, OnChanges {

  @Input() players: Player[];

  displayedColumns = [
    'rank', 'firstName', 'nickName', 'lastName', 'locality', 'elo', 'country'];
  playerDb: PlayerDatabase;
  dataSource: PlayersDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  smallScreen: boolean;
  truncateMax: number;

  constructor(private winRef: WindowRefService) {

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
    if (this.smallScreen) {
      this.displayedColumns = [
        'rank', 'firstName', 'nickName', 'lastName', 'elo'];
    }
  }

  ngOnInit() {

    this.playerDb = new PlayerDatabase(this.players);
    this.dataSource = new PlayersDataSource(this.playerDb, this.sort, this.paginator);

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.playerDb && propName === 'players') {
          this.playerDb.resetDatabase(change.currentValue);
        }
      }
    }
  }

}
