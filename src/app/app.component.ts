import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from './store/application-state';

import {AuthSubscribeAction, LogoutAction} from './store/actions/auth-actions';
import {TournamentsSubscribeAction, TournamentsUnsubscribeAction} from './store/actions/tournaments-actions';
import {Router} from '@angular/router';
import {GlobalEventService} from './service/global-event-service';
import { Subscription } from 'rxjs/Subscription';
import {MdSidenav} from '@angular/material';
import {WindowRefService} from './service/window-ref-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {


  @ViewChild('sidenav') sidenav: MdSidenav;

  private fullScreenModeSub: Subscription;

  currentUserName: string;
  loggedIn: boolean;
  currentUserEmail: string;
  currentUserImage: string;

  fullscreenMode: boolean;

  sideNavOpen: boolean;

  constructor(private router: Router,
              private store: Store<ApplicationState>,
              private messageService: GlobalEventService,
              private winRef: WindowRefService) {

    this.fullScreenModeSub = messageService.subscribe('fullScreenMode', (payload: boolean) => {
      this.fullscreenMode = payload;
      this.sidenav.close();
    });

    this.store.select(state => state.authenticationStoreState).subscribe(authenticationStoreState => {
        this.currentUserName = authenticationStoreState.currentUserName;
        this.loggedIn = authenticationStoreState.loggedIn;
        this.currentUserEmail = authenticationStoreState.currentUserEmail;
        this.currentUserImage = authenticationStoreState.currentUserImage;
      }
    );

    this.store.dispatch(new AuthSubscribeAction());
    this.store.dispatch(new TournamentsSubscribeAction());
    // console.log('window width: ' + winRef.nativeWindow.screen.width);
    if (this.winRef.nativeWindow.screen.width < 800) {
      this.sideNavOpen = false;
    } else {
      this.sideNavOpen = true;
    }

  }

  ngOnDestroy(): void {
    this.store.dispatch(new TournamentsUnsubscribeAction());
    this.fullScreenModeSub.unsubscribe();
  }

  logout() {

    this.store.dispatch(new LogoutAction());
  }

  login() {

    this.router.navigate(['/login']);
  }

}
