import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from './store/application-state';
import {Subscription} from 'rxjs/Subscription';
import {AuthSubscribeAction, LogoutAction} from './store/actions/auth-actions';
import {TournamentsSubscribeAction, TournamentsUnsubscribeAction} from './store/actions/tournaments-actions';
import {Router} from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  currentUserName: string;
  loggedIn: boolean;
  currentUserEmail: string;
  currentUserImage: string;

  constructor(private router: Router, private store: Store<ApplicationState>) {
    this.store.select(state => state.authenticationStoreData).subscribe(authenticationStoreData => {
        this.currentUserName = authenticationStoreData.currentUserName;
        this.loggedIn = authenticationStoreData.loggedIn;
        this.currentUserEmail = authenticationStoreData.currentUserEmail;
        this.currentUserImage = authenticationStoreData.currentUserImage;
      }
    );

    this.store.dispatch(new AuthSubscribeAction());
    this.store.dispatch(new TournamentsSubscribeAction());
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.store.dispatch(new TournamentsUnsubscribeAction());
  }


  logout() {

    this.store.dispatch(new LogoutAction());
  }

  login() {

    this.router.navigate(['/login']);
  }

}
