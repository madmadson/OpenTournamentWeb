import {Component, isDevMode, OnDestroy, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';


import {LogoutAction} from './store/actions/auth-actions';

import {Router} from '@angular/router';
import {GlobalEventService} from './service/global-event-service';
import {Subscription} from 'rxjs/Subscription';
import {MdDialog, MdSidenav} from '@angular/material';
import {WindowRefService} from './service/window-ref-service';
import {Observable} from 'rxjs/Observable';
import {AppState} from './store/reducers/index';
import {AuthService} from './service/auth.service';
import {AuthenticationState} from './store/reducers/authenticationReducer';
import {TournamentFormDialogComponent} from './dialogs/tournament-form-dialog';
import {Tournament} from '../../shared/model/tournament';
import {TournamentPushAction} from './store/actions/tournaments-actions';
import {Player} from '../../shared/model/player';
import {SET_REDIRECT_URL_ACTION} from "./store/reducers/redirectReducer";

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
  userPlayerData: Player;
  authSubscription: Subscription;

  constructor(private dialog: MdDialog,
              private authService: AuthService,
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

    this.authSubscription = this.auth$.subscribe((auth: AuthenticationState) => {
      this.userPlayerData = auth.userPlayerData;
    });

  }

  ngOnDestroy(): void {

    this.authService.unsubscribeOnAuthentication();
    this.fullScreenModeSub.unsubscribe();

    this.authSubscription.unsubscribe();
  }

  logout() {

    this.store.dispatch(new LogoutAction());

    this.router.navigate(['/home']);
  }

  login() {

    console.log(this.router.url);

    this.store.dispatch({type: SET_REDIRECT_URL_ACTION, payload: this.router.url});

    this.router.navigate(['/login']);
  }

  closeIfSmallDevice() {
    if (this.smallScreen) {
      this.sidenav.close();
    }
  }

  requestNewTournament(): void {

    if (this.smallScreen) {
      this.sidenav.close();
    }

    const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
      data: {
        tournament: new Tournament('', '', '', '', 16, 0, 0, 0, 0,
          this.userPlayerData.userUid, this.userPlayerData.userEmail, true, false, false, '', '', []),
        allActualTournamentPlayers: [],
        allRegistrations: [],
        tournamentTeams: 0,
        tournamentTeamRegistrations: 0
      },
      width: '800px'
    });

    const saveEventSubscribe = dialogRef.componentInstance.onSaveTournament.subscribe(tournament => {
      if (tournament) {
        this.store.dispatch(new TournamentPushAction(tournament));
      }
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }
}
