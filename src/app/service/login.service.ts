import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {SaveUserDataAction, DeleteUserDataAction} from "../store/actions";
import {AuthProviders, AuthMethods, AngularFire} from "angularfire2";
import {Subscription} from "rxjs";


@Injectable()
export class LoginService {
  private subscription: Subscription;

  constructor(protected afService: AngularFire, private store: Store<ApplicationState>) {
  }

  login(loginProvider: string) {

    console.log("Social Login for provider: " + loginProvider);
    this.socialLogin(loginProvider);

    this.subscription = this.afService.auth.subscribe(
      (auth) => {
        if (auth == null) {
          console.log("Not Logged in.");
        }
        else {
          console.log("Successfully Logged in.");
          this.store.dispatch(new SaveUserDataAction({uid: auth.auth.uid, displayName: auth.auth.displayName}));

        }
      }
    );
  }

  logout() {

    console.log("Logout: ");

    this.subscription.unsubscribe();

    this.afService.auth.logout().then();

    this.store.dispatch(new DeleteUserDataAction());
  }

  private socialLogin(loginProvider) {
    let provider;
    if (loginProvider === 'google') {
      provider = AuthProviders.Google;
    }
    else if (loginProvider === 'facebook') {
      provider = AuthProviders.Facebook;
    }

    this.afService.auth.login({
      provider: provider,
      method: AuthMethods.Popup,
    });
  }
}
