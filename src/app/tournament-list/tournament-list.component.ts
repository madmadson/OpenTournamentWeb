import {Component, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";

@Component({
  selector: 'tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.css']
})
export class TournamentListComponent implements OnInit {

  games: FirebaseListObservable<any[]>;

  constructor(af: AngularFire) {

    this.games = af.database.list('/games');
  }

  ngOnInit() {
  }

  private disabled: boolean = false;

  private items: Array<any> =
    [
      { name: 'Amsterdam', value: '1', disabled: false },
      { name: 'Birmingham', value: '2', disabled: false },
      { name: 'Dortmund', value: '3', disabled: false },
      { name: 'Gothenburg', value: '4', disabled: true },
      { name: 'London', value: '5', disabled: false },
      { name: 'Seville', value: '6', disabled: false }
    ];

  private item: string = '3';

  private change(value: any) {
    console.log('Selected value is: ', value);
  }
}
