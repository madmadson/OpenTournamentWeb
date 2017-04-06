import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {SaveUserDataAction} from '../store/actions/auth-actions';
import {AngularFire, AuthMethods, AuthProviders, FirebaseRef} from 'angularfire2';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';


@Injectable()
export class LoginService implements OnDestroy {

  private authSubscription: Subscription;
  private query: any;

  constructor(
    protected afService: AngularFire,
    private store: Store<ApplicationState>,
    private  router: Router,
    @Inject(FirebaseRef) private fb,
    private snackBar: MdSnackBar) {

    this.authSubscription = this.afService.auth.subscribe(
      (auth) => {
        if (auth != null) {
          console.log('authenticated!');

          this.store.dispatch(new SaveUserDataAction(
              {uid: auth.auth.uid, displayName: auth.auth.displayName, photoURL: auth.auth.photoURL}
          ));


          this.query = this.fb.database().ref('players').orderByChild('userUid')
            .equalTo(auth.auth.uid).on('child_added', function (snaphot) {
              console.log('found player for userId: ' + JSON.stringify(snaphot));
            });
        } else {
          console.log('failed?!');
        }
      }
    );
  }

  createAccount(payload) {

    const that = this;

    this.afService.auth.createUser({ email: payload.email, password: payload.password}).then((user) => {

      this.snackBar.open('Registration Successful', '', {
        duration: 5000
      });
      this.router.navigate(['/home']);

    }).catch(function(error){

      that.snackBar.open(error.message, '', {
        duration: 5000
      });
    });
  }

  loginWithEmailAndPassword(login: LoginModel) {

    this.afService.auth.login(
      {email: login.email, password: login.password},
      {provider: AuthProviders.Password, method: AuthMethods.Password}
    ).then(() => {
        this.snackBar.open('Login Successfully', '', {
          duration: 5000
        });
        this.router.navigate(['/home']);
    }).catch((error: any) => {
        console.log(error);

      this.snackBar.open('Failed to login. Please check Email/Password', '', {
        duration: 5000
      });
    });

  }

  loginWithProvider(loginProvider?: string) {

    this.login(loginProvider);

  }

  logout() {

    this.afService.auth.logout().then(() => {

      this.snackBar.open('Logout Successfully', '', {
        duration: 5000
      });
      this.router.navigate(['login']);
    });
  }

  private login(loginProvider?: string) {
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
    }).then(() => {
      this.snackBar.open('Login Successfully', '', {
        duration: 5000
      });
      this.router.navigate(['/home']);
    }).catch((error: any) => {
      console.log(error);

      this.snackBar.open('Failed to login with ' + provider, '', {
        duration: 5000
      });
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
