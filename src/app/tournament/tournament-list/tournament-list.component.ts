import {Component, Input} from '@angular/core';

import {Router} from '@angular/router';
import {Tournament} from '../../../../shared/model/tournament';
import {WindowRefService} from "../../service/window-ref-service";

@Component({
  selector: 'tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent  {

  @Input() tournaments: Tournament[];

  verySmallDevice: boolean;
  truncateMax: number;

  constructor(private router: Router,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.verySmallDevice = true;
      this.truncateMax = 20;
    }  else {
      this.verySmallDevice = false;
      this.truncateMax = 40;
    }

  }

  onSelect(tournament: Tournament) {
    this.router.navigate(['/tournament', tournament.id]);
  }


}
