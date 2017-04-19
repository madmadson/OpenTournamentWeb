import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {Player} from '../../../../shared/model/player';

import * as _ from 'lodash';

@Component({
  selector: 'tournament-ranking-table',
  templateUrl: './tournament-ranking-list.component.html',
  styleUrls: ['./tournament-ranking-list.component.css']
})
export class TournamentRankingListComponent implements OnInit {

  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() userPlayerData: Player;

  orderedRankings$: Observable<TournamentRanking[]>;

  constructor() { }

  ngOnInit() {

    this.orderedRankings$ = this.rankingsForRound$.map(rankings => {
     return  _.orderBy(rankings, ['score', 'sos', 'controlPoints', 'victoryPoints'], ['desc', 'desc', 'desc', 'desc']);
    });
  }

  isItMe(id: string): boolean {
    if (this.userPlayerData) {
      return (id === this.userPlayerData.id);
    }
  }
}
