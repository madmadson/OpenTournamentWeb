import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {ApplicationState} from '../../store/application-state';
import {GamesSubscribeAction} from '../../store/actions/games-actions';

import * as _ from 'lodash';

@Component({
  selector: 'game-list-overview',
  templateUrl: './game-list-overview.component.html',
  styleUrls: ['./game-list-overview.component.scss']
})
export class GameListOverviewComponent implements OnInit, OnDestroy {

  gameSub: Subscription;
  orderedGames: TournamentGame[];
  filteredGames: TournamentGame[];

  constructor(private store: Store<ApplicationState>) {
    this.store.dispatch(new GamesSubscribeAction());
  }

  ngOnInit() {

    this.gameSub = this.store.select(state => state.games.games).map(games => {
      return _.orderBy(games, ['playerOnePlayerName'], ['desc']);
    }).subscribe(orderedGames => {
      this.orderedGames = orderedGames;
      this.filteredGames = orderedGames;
    });

  }

  ngOnDestroy() {
    this.gameSub.unsubscribe();
  }


  search(searchString: string) {

    if (searchString === '') {
      this.filteredGames = this.orderedGames;
    }

    this.filteredGames = _.filter(this.orderedGames, function (game: TournamentGame) {
      return game.playerOnePlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        game.playerTwoPlayerName.toLowerCase().startsWith(searchString.toLowerCase());
    });

  }

}
