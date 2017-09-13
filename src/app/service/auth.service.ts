import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {DeleteUserPlayerDataAction, SaveUserDataAction, SaveUserPlayerDataAction} from '../store/actions/auth-actions';

import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {MdSnackBar} from '@angular/material';
import {Player} from '../../../shared/model/player';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import {AppState} from '../store/reducers/index';

@Injectable()
export class AuthService {

  private authSubscription: Subscription;
  private redirectUrlSubscription: Subscription;
  private redirectUrl: string;

  authState$: Observable<firebase.User>;
  private actualUser: firebase.User;

  constructor(public afAuth: AngularFireAuth,
              private store: Store<AppState>,
              private router: Router,
              private snackBar: MdSnackBar) {

  }

  unsubscribeOnAuthentication(): void {

    this.authSubscription.unsubscribe();
    this.redirectUrlSubscription.unsubscribe();

    if (this.afAuth.auth) {
      this.afAuth.auth.signOut();
    }
  }

  subscribeOnAuthentication() {


    this.authState$ = this.afAuth.authState;


    this.authSubscription = this.authState$.subscribe(
      (firebaseUser: firebase.User) => {
        if (firebaseUser != null) {

          this.actualUser = firebaseUser;

          console.log('authenticated!');

          if (firebaseUser.emailVerified) {

            this.store.dispatch(new SaveUserDataAction(
              {uid: firebaseUser.uid, displayName: firebaseUser.displayName, photoURL: firebaseUser.photoURL, email: firebaseUser.email}
            ));

            this.subscribeAsPlayer(firebaseUser.uid);

            this.snackBar.open('Login Successfully', '', {
              extraClasses: ['snackBar-success'],
              duration: 5000
            });
          } else {
            const snackBarRef = this.snackBar.open('Found account without verified email. Please verify your email first. ' +
              'Check your spam folder for an email with \'noreply@opentournament.de\'', 'SEND EMAIL AGAIN', {
              extraClasses: ['snackBar-info'],
              duration: 20000
            });
            snackBarRef.onAction().subscribe(() => {
              firebaseUser.sendEmailVerification();
              snackBarRef.dismiss();
            });
          }
        }
      }
    );

    this.redirectUrlSubscription = this.store.select(state => state.redirectUrl.redirectUrl).subscribe(redirectUrl => {
      this.redirectUrl = redirectUrl;
    });
  }

  subscribeAsPlayer(userUid: string) {

    const that = this;

    const query = firebase.database().ref('players').orderByChild('userUid')
      .equalTo(userUid).limitToFirst(1);

    query.once('child_added').then(function (snapshot) {
      if (snapshot.val() != null) {

        const player = Player.fromJson(snapshot.val());
        player.id = snapshot.key;
        that.store.dispatch(new SaveUserPlayerDataAction(player));
      } else {
        that.store.dispatch(new DeleteUserPlayerDataAction());
      }
    });

    query.on('child_changed', function (snapshot) {
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

    this.reSubscribeOnAuth();

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

    this.reSubscribeOnAuth();

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

  logout() {
    this.reSubscribeOnAuth();

    this.afAuth.auth.signOut();

    this.router.navigate(['/login']);
  }


  resetPassword(email: string) {
    this.afAuth.auth.sendPasswordResetEmail(email);

    this.snackBar.open('Send userEmail to ' + email, '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
    this.router.navigate(['/login']);
  }

  private reSubscribeOnAuth() {

    this.unsubscribeOnAuthentication();
    this.subscribeOnAuthentication();
  }

  isLoggedIn(): boolean {

    return !!this.actualUser;
  }
}
