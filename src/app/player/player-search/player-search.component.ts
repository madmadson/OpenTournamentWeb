import {Component, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Player} from '../../../../shared/model/player';

import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'player-search',
  templateUrl: './player-search.component.html',
  styleUrls: ['./player-search.component.css']
})
export class PlayerSearchComponent {

  @Input() players: Player[];

  formControl: FormControl;
  filteredPlayers: Observable<Player[]>;

  constructor() {
    this.formControl = new FormControl();
    this.filteredPlayers = this.formControl.valueChanges
      .startWith(null)
      .map(input => this.filterPlayers(input));
  }

  filterPlayers(val: string) {

    console.log('val: ' + val);

    const filteredPlayers = _.filter(this.players, function (player: Player) {


      return player.firstName.startsWith(val) ||
             player.nickName.startsWith(val) ||
             player.lastName.startsWith(val) ||
             player.meta.startsWith(val);
    });

    return filteredPlayers ? filteredPlayers : this.players;
  }

  onSelect(player: Player) {
    console.log('log: ' + JSON.stringify(player));
  }

}
