import {Component, Input} from '@angular/core';
import {Tournament} from '../tournament.vm';
import {Router} from '@angular/router';

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
