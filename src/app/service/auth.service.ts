import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {
  DeleteUserDataAction, DeleteUserPlayerDataAction, SaveUserDataAction,
  SaveUserPlayerDataAction
} from '../store/actions/auth-actions';
import {AngularFire, AuthMethods, AuthProviders, FirebaseRef} from 'angularfire2';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {Player} from '../../../shared/model/player';


@Injectable()
export class LoginService implements OnDestroy {

  private authSubscription: Subscription;
  private query: any;

  constructor(protected afService: AngularFire,
              private store: Store<ApplicationState>,
              private  router: Router,
              @Inject(FirebaseRef) private fb,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {

    this.authSubscription.unsubscribe();
  }

  subscribeOnAuthentication() {

    this.authSubscription = this.afService.auth.subscribe(
      (auth) => {

        if (auth != null) {
          console.log('authenticated!');

          if (auth.auth.emailVerified) {

            this.store.dispatch(new SaveUserDataAction(
              {uid: auth.auth.uid, displayName: auth.auth.displayName, photoURL: auth.auth.photoURL}
            ));

            this.subscribeAsPlayer(auth.auth.uid);

            this.snackBar.open('Login Successfully', '', {
              duration: 5000
            });
            this.router.navigate(['/home']);

          } else {
            const snackBarRef = this.snackBar.open('Please verify your email first', 'SEND EMAIL AGAIN', {
              duration: 5000
            });
            snackBarRef.onAction().subscribe(() => {
              auth.auth.sendEmailVerification();
              snackBarRef.dismiss();
            });
          }
        }
      }
    );
  }

  subscribeAsPlayer(userUid: string) {

    const that = this;

    this.query = this.fb.database().ref('players').orderByChild('userUid')
      .equalTo(userUid).limitToFirst(1);

    this.query.once('child_added').then(function (snapshot) {
      if (snapshot.val() != null) {

        const player = Player.fromJson(snapshot.val());
        player.id = snapshot.key;
        that.store.dispatch(new SaveUserPlayerDataAction(player));
      } else {
        that.store.dispatch(new DeleteUserPlayerDataAction());
      }
    });

    // this.query.on('child_changed', function (snapshot) {
    //   const player = Player.fromJson(snapshot.val());
    //   player.id = snapshot.key;
    //   this.store.dispatch(new SaveUserPlayerDataAction(player));
    // });
  }

  createAccount(payload) {

    const that = this;

    this.afService.auth.createUser({email: payload.email, password: payload.password}).then((user) => {

      user.auth.sendEmailVerification();

      this.snackBar.open('Registration Successful. Please verify your email.', '', {
        duration: 5000
      });
      this.router.navigate(['/login']);

    }).catch(function (error) {

      that.snackBar.open(error.message, '', {
        duration: 5000
      });
    });
  }

  loginWithEmailAndPassword(login: LoginModel) {


    this.afService.auth.login(
      {email: login.email, password: login.password},
      {provider: AuthProviders.Password, method: AuthMethods.Password}
    ).catch((error: any) => {
      console.log(error);

      this.snackBar.open('Failed to login. Please check Email/Password', '', {
        duration: 5000
      });
    });
  }


  loginWithProvider(loginProvider ?: string) {

    this.login(loginProvider);

  }

  logout() {

    this.afService.auth.logout();

    this.router.navigate(['/login']);
  }

  private login(loginProvider ?: string) {
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

      this.snackBar.open('Failed to login with ' + loginProvider + '. Already registered with email?', '', {
        duration: 5000
      });
    });
  }

  resetPassword(email: string) {
    this.fb.auth().sendPasswordResetEmail(email);

    this.snackBar.open('Send email to ' + email, '', {
      duration: 5000
    });
    this.router.navigate(['/login']);
  }
}
