import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Player} from '../../../../shared/model/player';
import {WindowRefService} from "../../service/window-ref-service";

@Component({
  selector: 'player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {

  @Input()
  players: Player[];

  smallScreen: boolean;
  truncateMax: number;
  page = 1;

  constructor(private router: Router,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  onSelect(player: Player) {
    this.router.navigate(['/player', player.id]);
  }
}
