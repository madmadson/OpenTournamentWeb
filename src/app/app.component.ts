import {Component, isDevMode, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';


import {LogoutAction} from './store/actions/auth-actions';

import {Router} from '@angular/router';
import {GlobalEventService} from './service/global-event-service';
import {Subscription} from 'rxjs/Subscription';
import {MdSidenav} from '@angular/material';
import {WindowRefService} from './service/window-ref-service';
import {Observable} from 'rxjs/Observable';
import {AppState} from './store/reducers/index';
import {AuthService} from './service/auth.service';
import {AuthenticationState} from './store/reducers/authenticationReducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {


  @ViewChild('sidenav') sidenav: MdSidenav;

  fullScreenModeSub: Subscription;

  fullscreenMode: boolean;

  sideNavOpen: boolean;


  smallScreen: boolean;

  isDevMode: boolean;
  auth$: Observable<AuthenticationState>;
  isConnected$: Observable<boolean>;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>,
              private messageService: GlobalEventService,
              private winRef: WindowRefService) {

    authService.subscribeOnAuthentication();

    this.auth$ = this.store.select(state => state.authentication);

    this.isDevMode = isDevMode();

    this.fullScreenModeSub = messageService.subscribe('fullScreenMode', (payload: boolean) => {
      this.fullscreenMode = payload;
      this.sidenav.close();
    });


    this.sideNavOpen = this.winRef.nativeWindow.screen.width >= 800;


    this.isConnected$ = Observable.merge(
      Observable.of(this.winRef.nativeWindow.navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));

    this.smallScreen = this.winRef.nativeWindow.screen.width < 800;

  }

  ngOnDestroy(): void {

    this.authService.unsubscribeOnAuthentication();
    this.fullScreenModeSub.unsubscribe();
  }

  logout() {

    this.store.dispatch(new LogoutAction());
  }

  login() {

    this.router.navigate(['/login']);
  }

  closeIfSmallDevice() {
    if (this.smallScreen) {
      this.sidenav.close();
    }
  }

}
