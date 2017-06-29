import {Component} from '@angular/core';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {Player} from '../../../shared/model/player';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {

  userPlayerData: Player;
  loggedIn: boolean;

  constructor(private store: Store<ApplicationState>) {

    store.select(state => state.authenticationStoreState).subscribe(

      authenticationStoreState => {
        this.userPlayerData = authenticationStoreState.userPlayerData;
        this.loggedIn = authenticationStoreState.loggedIn;
      }
    );
  }
}
