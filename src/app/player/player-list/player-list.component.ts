import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Player} from '../../../../shared/model/player';

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent {

  @Input()
  players: Player[];

  constructor(private router: Router) {

  }

  onSelect(player: Player) {
    this.router.navigate(['/player', player.id]);
  }
}
