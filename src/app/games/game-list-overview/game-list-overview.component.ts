import {Component, OnDestroy} from '@angular/core';

import {GamesService} from '../games.service';

import {Observable} from 'rxjs/Observable';
import {AppState} from '../../store/reducers/index';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Store} from '@ngrx/store';

@Component({
  selector: 'game-list-overview',
  templateUrl: './game-list-overview.component.html',
  styleUrls: ['./game-list-overview.component.scss']
})
export class GameListOverviewComponent implements OnDestroy {

  allGames$: Observable<TournamentGame[]>;

  constructor(private gamesService: GamesService, private store: Store<AppState>) {

    this.gamesService.subscribeOnFirebaseGames();

    this.allGames$ = this.store.select(state => state.games.allGames);
  }
  ngOnDestroy() {
    this.gamesService.unsubscribeOnFirebaseGames();
  }
}
