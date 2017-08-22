import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {TournamentGame} from '../../../../shared/model/tournament-game';


import * as _ from 'lodash';
import {GamesService} from '../games.service';
import {Store} from "@ngrx/store";

@Component({
  selector: 'game-list-overview',
  templateUrl: './game-list-overview.component.html',
  styleUrls: ['./game-list-overview.component.scss']
})
export class GameListOverviewComponent implements OnInit, OnDestroy {

  gamesSub: Subscription;
  filteredGames;

  constructor(private gamesService: GamesService, private store: Store<any>) {

    this.gamesService.subscribeOnFirebaseGames();

    this.store.select('games');
  }

  ngOnInit() {
    this.gamesSub = this.store.select(state => state.games.games).map(games => {
      return _.orderBy(games, ['id'], ['desc']);
    }).subscribe(orderedGames => {
      this.filteredGames = orderedGames;
    });

  }


  ngOnDestroy() {
    this.gamesService.unsubscribeOnFirebaseGames();
    this.gamesSub.unsubscribe();
  }


  search(searchString: string) {

    // if (searchString === '') {
    //   this.filteredGames = this.orderedGames;
    // }
    //
    // this.filteredGames = _.filter(this.orderedGames, function (game: TournamentGame) {
    //   return game.playerOnePlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
    //     game.playerTwoPlayerName.toLowerCase().startsWith(searchString.toLowerCase());
    // });

  }

}
