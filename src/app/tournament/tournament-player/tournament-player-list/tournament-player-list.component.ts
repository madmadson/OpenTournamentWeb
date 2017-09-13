import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {WindowRefService} from '../../../service/window-ref-service';
import {ArmyList} from '../../../../../shared/model/armyList';

import {MdPaginator, MdSort} from '@angular/material';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {
  TournamentPlayerDatabase,
  TournamentPlayersDataSource
} from '../../../../../shared/table-model/tournamentPlayer';
import {Tournament} from '../../../../../shared/model/tournament';
import {Player} from '../../../../../shared/model/player';

import * as _ from 'lodash';

@Component({
  selector: 'tournament-player-list',
  templateUrl: './tournament-player-list.component.html',
  styleUrls: ['./tournament-player-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentPlayerListComponent implements OnInit, OnChanges  {

  @Input() actualTournament: Tournament;
  @Input() tournamentPlayers: TournamentPlayer[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() armyLists: ArmyList[];
  @Input() isTeamTournament: boolean;

  @Output() onDeletePlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAddArmyLists = new EventEmitter<TournamentPlayer>();

  displayedColumns = [
    'playerName', 'team', 'locality', 'faction', 'actions'];
  tournamentPlayerDb: TournamentPlayerDatabase;
  dataSource: TournamentPlayersDataSource | null;

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
        'playerName', 'faction', 'actions'];
    }
  }

  ngOnInit() {


    this.tournamentPlayerDb = new TournamentPlayerDatabase(this.tournamentPlayers);
    this.dataSource = new TournamentPlayersDataSource(this.tournamentPlayerDb, this.sort, this.paginator);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.tournamentPlayerDb && propName === 'tournamentPlayers') {
          this.tournamentPlayerDb.resetDatabase(change.currentValue);
        }
      }
    }
  }


  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  playerHasArmyList(tournamentPlayer: TournamentPlayer): boolean {

    let hasArmyList = false;

    if (this.userPlayerData && tournamentPlayer) {

      _.forEach(this.armyLists, function (armyList: ArmyList) {

        if (armyList.playerId === tournamentPlayer.playerId) {
          hasArmyList = true;
        }
      });
    }
    return hasArmyList;
  }

  deleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.onDeletePlayer.emit(tournamentPlayer);
  }

  addArmyLists(tournamentPlayer: TournamentPlayer) {
    this.onAddArmyLists.emit(tournamentPlayer);
  }

}
