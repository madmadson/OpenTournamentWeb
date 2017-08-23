import {Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';

import {
  DeleteUserPlayerDataAction, SaveUserDataAction,
  SaveUserPlayerDataAction
} from '../store/actions/auth-actions';

import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {Player} from '../../../shared/model/player';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store/reducers/index';

@Injectable()
export class LoginService implements OnDestroy {

  private authSubscription: Subscription;
  private redirectUrlSubscription: Subscription;
  private query: any;
  private redirectUrl: string;

  user$: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
              private store: Store<AppState>,
              private router: Router,
              private snackBar: MdSnackBar) {

    this.user$ = afAuth.authState;

    this.redirectUrlSubscription = this.store.select(state => state.authentication.redirectUrl).subscribe(redirectUrl => {
      this.redirectUrl = redirectUrl;
    });
  }


  ngOnDestroy(): void {

    this.authSubscription.unsubscribe();
    this.redirectUrlSubscription.unsubscribe();
  }

  subscribeOnAuthentication() {


    this.authSubscription = this.user$.subscribe(
      (auth) => {

        if (auth != null) {
          console.log('authenticated!');

          if (auth.emailVerified) {

            this.store.dispatch(new SaveUserDataAction(
              {uid: auth.uid, displayName: auth.displayName, photoURL: auth.photoURL, email: auth.email}
            ));

            this.subscribeAsPlayer(auth.uid);

            this.snackBar.open('Login Successfully', '', {
              extraClasses: ['snackBar-success'],
              duration: 5000
            });
          } else {
            const snackBarRef = this.snackBar.open('Found account without verified email. Please verify your email first. ' +
              'Check your spam folder for an email with \'noreply@devopentournament.firebaseapp.com\'', 'SEND EMAIL AGAIN', {
              extraClasses: ['snackBar-info'],
              duration: 20000
            });
            snackBarRef.onAction().subscribe(() => {
              auth.sendEmailVerification();
              snackBarRef.dismiss();
            });
          }
        }
      }
    );
  }

  subscribeAsPlayer(userUid: string) {

    const that = this;

    this.query = firebase.database().ref('players').orderByChild('userUid')
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

    this.query.on('child_changed', function (snapshot) {
      const player = Player.fromJson(snapshot.val());
      player.id = snapshot.key;
      that.store.dispatch(new SaveUserPlayerDataAction(player));
    });
  }

  createAccount(payload) {

    const that = this;

    this.afAuth.auth.createUserWithEmailAndPassword(payload.email, payload.password).then((user: firebase.User) => {

      user.sendEmailVerification();

      this.snackBar.open('Registration Successful. Please verify your userEmail.', '', {
        extraClasses: ['snackBar-success'],
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
    this.afAuth.auth.signInWithEmailAndPassword(login.email, login.password
    ).then(() => {
      if (this.redirectUrl !== undefined) {
        console.log('found redirect!' + this.redirectUrl);
        this.router.navigate([this.redirectUrl]);
      } else {
        this.router.navigate(['/home']);
      }
    }).catch((error: any) => {
      console.log(error);

      this.snackBar.open('Failed to login. Please check Email/Password', '', {
        extraClasses: ['snackBar-fail'],
        duration: 5000
      });
    });
  }


  loginWithProvider(loginProvider ?: string) {

    this.login(loginProvider);

  }

  logout() {

    this.afAuth.auth.signOut();

    this.router.navigate(['/login']);
  }

  private login(loginProvider ?: string) {
    let provider;
    if (loginProvider === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (loginProvider === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    } else {
      provider = new firebase.auth.GoogleAuthProvider();
    }

    this.afAuth.auth.signInWithPopup(
      provider).then(() => {
      if (this.redirectUrl !== undefined) {
        console.log('found redirect!' + this.redirectUrl);
        this.router.navigate([this.redirectUrl]);
      } else {
        this.router.navigate(['/home']);
      }
    }).catch((error: any) => {
      console.log(error);

      this.snackBar.open('Failed to login with ' + loginProvider + '. Already registered with userEmail?', '', {
        extraClasses: ['snackBar-fail'],
        duration: 5000
      });
    });
  }

  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email);

    this.snackBar.open('Send userEmail to ' + email, '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
    this.router.navigate(['/login']);
  }
}
