import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {Observable} from "rxjs";
import {LogoutAction} from "./store/actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userName$: Observable<String>;

  constructor( private store: Store<ApplicationState>, private router: Router) {

    this.userName$ = store.select(state => state.uiState.currentUserName);


  }

  login(){
    this.router.navigate(["login-page"]);
  }

  logout(){

    this.store.dispatch(new LogoutAction());
  }

}
