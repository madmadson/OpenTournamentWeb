import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../shared/model/armyList';
import {Player} from '../../../../shared/model/player';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {TournamentGame} from '../../../../shared/model/tournament-game';

@Component({
  selector: 'tournament-round-overview',
  templateUrl: './tournament-round-overview.component.html',
  styleUrls: ['./tournament-round-overview.component.css']
})
export class TournamentRoundOverviewComponent implements OnInit {

  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() gamesForRound$: Observable<TournamentGame[]>;


  userPlayerData: Player;

  constructor() { }

  ngOnInit() {

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
    });
  }

  isItMe(id: string): boolean {
    if (this.userPlayerData) {
      return (id === this.userPlayerData.id);
    }
  }

  isItMyGame(playerOne_id: string, playerTwo_id: string) {
    if (this.userPlayerData) {
      return (playerOne_id === this.userPlayerData.id) || (playerTwo_id === this.userPlayerData.id);
    }
  }
}
