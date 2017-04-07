import {Component, Input} from '@angular/core';
import {TournamentVM} from '../tournament.vm';
import {Router} from '@angular/router';

@Component({
  selector: 'tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent  {

  @Input()
  tournaments: TournamentVM[];

  constructor(private router: Router) {

  }

  onSelect(tournament: TournamentVM) {
    this.router.navigate(['/tournament', tournament.id]);
  }


}
