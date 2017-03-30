import {Component, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {Observable, Subscription} from "rxjs";
import {LogoutAction} from "./store/actions/auth-actions";
import {UiState} from "./store/ui-state";
import * as _ from "lodash";
import {TournamentsSubscribeAction} from "./store/actions/tournament-actions";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  currentUserName$: Observable<String>;

  uiState: UiState;


  constructor(private router: Router, private store: Store<ApplicationState>) {

    this.currentUserName$ = store.select(state => state.uiState.currentUserName);

    this.subscription = store.select(state => state.uiState).subscribe(uiState => {
        console.log('new state' + JSON.stringify(uiState));
        this.uiState = _.cloneDeep(uiState);
      }
    );

  }

  ngOnInit() {
    this.store.dispatch(new TournamentsSubscribeAction());
  }


  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }


  logout() {

    this.store.dispatch(new LogoutAction());
  }

  login() {

    this.router.navigate(['/login']);
  }

}
