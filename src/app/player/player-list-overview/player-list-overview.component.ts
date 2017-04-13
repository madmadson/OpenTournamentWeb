import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {PlayersSubscribeAction, PlayersUnsubscribeAction} from '../../store/actions/players-actions';

import * as _ from 'lodash';
import {Player} from '../../../../shared/model/player';

@Component({
  selector: 'player-list-overview',
  templateUrl: './player-list-overview.component.html',
  styleUrls: ['./player-list-overview.component.css']
})
export class PlayerListOverviewComponent implements OnInit, OnDestroy {

  allPlayers: Player[];
  filteredPlayers: Player[];

  constructor(private store: Store<ApplicationState>) {

  }

  ngOnInit() {

    this.store.select(state => state.globalState.players).subscribe(players => {
      this.allPlayers = players;
      this.filteredPlayers = players;
    });
    this.store.dispatch(new PlayersSubscribeAction());
  }

  ngOnDestroy(): void {


    this.store.dispatch(new PlayersUnsubscribeAction());
  }

  search(searchString: string) {

    console.log('searchString: ' + searchString);

    if (searchString === '') {
      this.filteredPlayers = this.allPlayers;
    }

    this.filteredPlayers = _.filter(this.allPlayers, function (player) {
      return player.firstName.startsWith(searchString) ||
        player.nickName.startsWith(searchString) ||
        player.lastName.startsWith(searchString);
    });

  }

}
