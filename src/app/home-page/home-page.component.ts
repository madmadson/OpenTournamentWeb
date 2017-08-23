import {Component, OnDestroy} from '@angular/core';

import {Store} from '@ngrx/store';
import {Player} from '../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../store/reducers/index';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy {

  userPlayerData: Player;
  loggedIn: boolean;

  private authSubscription: Subscription;

  constructor(private store: Store<AppState>) {

    this.authSubscription = store.select(state => state.authentication).subscribe(

      authentication => {
        this.userPlayerData = authentication.userPlayerData;
        this.loggedIn = authentication.loggedIn;
      }
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}
