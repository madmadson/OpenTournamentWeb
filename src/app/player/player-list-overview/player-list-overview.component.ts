import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {PlayersSubscribeAction, PlayersUnsubscribeAction} from '../../store/actions/players-actions';

import * as _ from 'lodash';
import {Player} from '../../../../shared/model/player';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'player-list-overview',
  templateUrl: './player-list-overview.component.html',
  styleUrls: ['./player-list-overview.component.css']
})
export class PlayerListOverviewComponent implements OnInit, OnDestroy {

  orderedPlayers: Player[];
  filteredPlayers: Player[];

  constructor(private store: Store<ApplicationState>) {
    this.store.dispatch(new PlayersSubscribeAction());
  }

  ngOnInit() {

    this.store.select(state => state.players.players).map(players => {
      return _.orderBy(players, ['elo', 'nickname'], ['desc', 'asc']);
    }).subscribe(orderedPlayers => {
      this.orderedPlayers = orderedPlayers;
      this.filteredPlayers = orderedPlayers;
    });

  }

  ngOnDestroy(): void {
    this.store.dispatch(new PlayersUnsubscribeAction());
  }

  search(searchString: string) {

    console.log('searchString: ' + searchString);

    if (searchString === '') {
      this.filteredPlayers = this.orderedPlayers;
    }

    this.filteredPlayers = _.filter(this.orderedPlayers, function (player) {
      return player.firstName.startsWith(searchString) ||
        player.nickName.startsWith(searchString) ||
        player.lastName.startsWith(searchString);
    });

  }

}
