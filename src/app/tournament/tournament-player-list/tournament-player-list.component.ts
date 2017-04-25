import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../shared/model/armyList';
import {ShowArmyListInTournamentRankingDialogComponent} from '../tournament-ranking-list/tournament-ranking-list.component';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {Observable} from 'rxjs/Observable';

import * as _ from 'lodash';

@Component({
  selector: 'tournament-player-list',
  templateUrl: './tournament-player-list.component.html',
  styleUrls: ['./tournament-player-list.component.css']
})
export class TournamentPlayerListComponent implements OnInit {

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() actualTournament: Tournament;
  @Input() tournamentPlayers: TournamentPlayer[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;

  @Output() onDeleteTournamentPlayer = new EventEmitter<TournamentPlayer>();

  armyLists: ArmyList[];

  constructor(public dialog: MdDialog) { }

  ngOnInit() {

    this.actualTournamentArmyList$.subscribe(armyLists => {
      this.armyLists = armyLists;
    });
  }

  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  deleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.onDeleteTournamentPlayer.emit(tournamentPlayer);
  }

  openArmyListDialog(tournamentPlayer: TournamentPlayer) {

    const myArmyLists: ArmyList[] = _.filter(this.armyLists, function (armyList: ArmyList) {
      return (armyList.playerId === tournamentPlayer.playerId);
    });

    this.dialog.open(ShowArmyListInTournamentPlayerDialogComponent, {
      data: {
        tournamentPlayer: tournamentPlayer,
        armyLists: myArmyLists
      }
    });
  }

}

@Component({
  selector: 'show-army-list-dialog',
  templateUrl: './show-army-list-dialog.html'
})
export class ShowArmyListInTournamentPlayerDialogComponent {

  tournamentPlayer: TournamentPlayer;
  armyLists: ArmyList[];

  constructor(public dialogRef: MdDialogRef<ShowArmyListInTournamentPlayerDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.tournamentPlayer = data.tournamentPlayer;
    this.armyLists = data.armyLists;
  }


}
