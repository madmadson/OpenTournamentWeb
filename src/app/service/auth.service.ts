import {Inject, Injectable, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {SaveUserDataAction} from "../store/actions/auth-actions";
import {AngularFire, AuthMethods, AuthProviders, FirebaseRef} from "angularfire2";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";


@Injectable()
export class LoginService implements OnDestroy {

  private authSubscription: Subscription;
  private query: any;

  constructor(
    protected afService: AngularFire,
    private store: Store<ApplicationState>,
    private  router: Router,
    @Inject(FirebaseRef) private fb) {
  }

  login(loginProvider?: string) {

    console.log('Login for provider: ' + loginProvider);
    this.loginWithProvider(loginProvider);

    this.authSubscription = this.afService.auth.subscribe(
      (auth) => {
        if (auth == null) {
          console.log('Not Logged in.');
        } else {
          console.log('Successfully Logged in.');
          this.store.dispatch(
            new SaveUserDataAction(
              {uid: auth.auth.uid, displayName: auth.auth.displayName, photoURL: auth.auth.photoURL}
            ));


          this.query = this.fb.database().ref('players').orderByChild('userUid')
            .equalTo(auth.auth.uid).on('child_added', function (snaphot) {
              console.log('found player for userId: ' + JSON.stringify(snaphot));
            });

        }
      }
    );


  }

  logout() {

    console.log('Logout: ');

    this.authSubscription.unsubscribe();
    this.afService.auth.logout().then();
    this.router.navigate(['login']);

  }

  private loginWithProvider(loginProvider?: string) {
    let provider;
    let method;
    if (loginProvider === 'google') {
      provider = AuthProviders.Google;
      method = AuthMethods.Popup;
    } else if (loginProvider === 'facebook') {
      provider = AuthProviders.Facebook;
      method = AuthMethods.Popup;
    } else {
      provider = AuthProviders.Anonymous;
      method = AuthMethods.Anonymous;
    }

    this.afService.auth.login({
      provider: provider,
      method: method,
    });
  }

  // routeToLoginPageWhenUnauthenticated(actionPayload: RouterMethodCall) {
  //
  //   if (actionPayload.path !== '/login-page') {
  //     if (this.authSubscription === undefined) {
  //       console.log('redirect to login page');
  //       //this.router.navigate(["login-page"]);
  //     }
  //   }
  // }

  ngOnDestroy(): void {

    this.authSubscription.unsubscribe();
  }
}
