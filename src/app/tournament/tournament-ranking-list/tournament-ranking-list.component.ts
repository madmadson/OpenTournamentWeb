import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Player} from '../../../../shared/model/player';

@Component({
  selector: 'tournament-ranking-table',
  templateUrl: './tournament-ranking-list.component.html',
  styleUrls: ['./tournament-ranking-list.component.css']
})
export class TournamentRankingListComponent implements OnInit {

  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() userPlayerData: Player;

  constructor() { }

  ngOnInit() {
  }

  isItMe(id: string): boolean {
    if (this.userPlayerData) {
      return (id === this.userPlayerData.id);
    }
  }
}
