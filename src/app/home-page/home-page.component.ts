import {Component} from '@angular/core';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {Player} from '../../../shared/model/player';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  private userPlayerData: Player;
  private loggedIn: boolean;

  constructor(private store: Store<ApplicationState>) {

    store.select(state => state.authenticationStoreData).subscribe(

      authenticationStoreData => {
        this.userPlayerData = authenticationStoreData.userPlayerData;
        this.loggedIn = authenticationStoreData.loggedIn;
      }
    );
  }
}
