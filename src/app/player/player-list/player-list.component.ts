import {Component, Input} from "@angular/core";
import {PlayerVM} from "../player.vm";
import {Router} from "@angular/router";

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent {

  @Input()
  players: PlayerVM[];

  constructor(private router: Router) {

  }

  onSelect(player: PlayerVM) {
    this.router.navigate(['/player', player.id]);
  }
}
