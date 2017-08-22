import {Component, OnDestroy} from '@angular/core';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {Player} from '../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy {

  userPlayerData: Player;
  loggedIn: boolean;

  private authSubscription: Subscription;

  constructor(private store: Store<ApplicationState>) {

    this.authSubscription = store.select(state => state.authenticationStoreState).subscribe(

      authenticationStoreState => {
        this.userPlayerData = authenticationStoreState.userPlayerData;
        this.loggedIn = authenticationStoreState.loggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
