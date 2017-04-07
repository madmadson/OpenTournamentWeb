import {Component} from "@angular/core";
import {ApplicationState} from "../store/application-state";
import {Store} from "@ngrx/store";
import {Player} from "../../../shared/model/player";


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  private playerData: Player;
  private loggedIn: boolean;

  constructor(private store: Store<ApplicationState>) {

    store.select(state => state.storeData.playerData).subscribe(

      playerData => {
        console.log('found player data in store: ' + JSON.stringify(playerData));
        this.playerData = playerData;
      }
    );

    store.select(state => state.uiState.loggedIn).subscribe(
      loggedIn => this.loggedIn = loggedIn
    );
  }
}
