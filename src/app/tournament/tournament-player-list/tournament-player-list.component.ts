import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {ArmyList} from '../../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';

import {WindowRefService} from '../../service/window-ref-service';

@Component({
  selector: 'tournament-player-list',
  templateUrl: './tournament-player-list.component.html',
  styleUrls: ['./tournament-player-list.component.scss']
})
export class TournamentPlayerListComponent implements OnInit {

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() actualTournament: Tournament;
  @Input() tournamentPlayers: TournamentPlayer[];
  @Input() userPlayerData: Player;

  @Output() onDeleteTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAddArmyLists = new EventEmitter<TournamentPlayer>();

  armyLists: ArmyList[];
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
  }

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

  addArmyLists(tournamentPlayer: TournamentPlayer) {
    this.onAddArmyLists.emit(tournamentPlayer);
  }

}
