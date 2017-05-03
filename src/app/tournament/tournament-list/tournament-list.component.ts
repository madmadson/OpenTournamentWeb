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

  constructor(private router: Router,
              private winRef: WindowRefService) {

    if (winRef.nativeWindow.screen.width < 800) {
      this.verySmallDevice = true;
    } else {
      this.verySmallDevice = false;
    }

  }

  onSelect(tournament: Tournament) {
    this.router.navigate(['/tournament', tournament.id]);
  }


}
