import {Component, OnInit, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {SocialLoginAction} from "../store/actions";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private store: Store<ApplicationState>, private  router: Router) {

   this.subscription = store.select(state => state.uiState.currentUserName).subscribe(res => {
      if(res !== undefined){
        this.router.navigate(["home"]);
      }
     }
   )
  }

  ngOnInit() {}

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  socialLogin(loginProvider: string) {

    this.store.dispatch(new SocialLoginAction(loginProvider));

  }

}
