import {Component, Input} from '@angular/core';

import {Router} from '@angular/router';
import {Tournament} from '../../../../shared/model/tournament';

@Component({
  selector: 'tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent  {

  @Input()
  tournaments: Tournament[];

  constructor(private router: Router) {

  }

  onSelect(tournament: Tournament) {
    this.router.navigate(['/tournament', tournament.id]);
  }


}
