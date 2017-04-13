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

    store.select(state => state.globalState).subscribe(globalState => {
        this.currentUserName = globalState.currentUserName;
        this.loggedIn = globalState.loggedIn;
        this.currentUserEmail = globalState.currentUserEmail;
        this.currentUserImage = globalState.currentUserImage;
      }
    );

  }

  ngOnInit() {
    this.store.dispatch(new AuthSubscribeAction());
    this.store.dispatch(new TournamentsSubscribeAction());
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
