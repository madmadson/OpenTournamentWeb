import {Component, Input} from "@angular/core";
import {TournamentVM} from "../tournament.vm";

@Component({
  selector: 'tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.css']
})
export class TournamentListComponent  {

  @Input()
  tournaments: TournamentVM[];

  constructor() {

  }
}
