import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {PlayersSubscribeAction} from '../../store/actions/players-actions';

import * as _ from 'lodash';
import {Player} from '../../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'player-list-overview',
  templateUrl: './player-list-overview.component.html',
  styleUrls: ['./player-list-overview.component.css']
})
export class PlayerListOverviewComponent implements OnInit, OnDestroy {

  playerSub: Subscription;
  orderedPlayers: Player[];
  filteredPlayers: Player[];

  constructor(private store: Store<ApplicationState>) {
    this.store.dispatch(new PlayersSubscribeAction());
  }

  ngOnInit() {

    this.playerSub = this.store.select(state => state.players.players).map(players => {
      return _.orderBy(players, ['elo', 'nickname'], ['desc', 'asc']);
    }).subscribe(orderedPlayers => {
      this.orderedPlayers = orderedPlayers;
      this.filteredPlayers = orderedPlayers;
    });

  }

  ngOnDestroy() {
    this.playerSub.unsubscribe();
  }


  search(searchString: string) {

    if (searchString === '') {
      this.filteredPlayers = this.orderedPlayers;
    }

    this.filteredPlayers = _.filter(this.orderedPlayers, function (player) {
      return player.firstName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        player.nickName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        player.lastName.toLowerCase().startsWith(searchString.toLowerCase());
    });

  }

}
