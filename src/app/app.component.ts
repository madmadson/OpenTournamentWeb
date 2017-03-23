import {Component, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {Observable, Subscription} from "rxjs";
import {LogoutAction} from "./store/actions/auth-actions";
import {UiState} from "./store/ui-state";
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  private subscription: Subscription;

  currentUserName$: Observable<String>;

  uiState: UiState;


  constructor(private store: Store<ApplicationState>) {

    this.currentUserName$ = store.select(state => state.uiState.currentUserName);

    this.subscription = store.select(state => state.uiState).subscribe(uiState => {
        console.log("new state" + JSON.stringify(uiState));
        this.uiState = _.cloneDeep(uiState);
      }
    );

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }


  logout() {

    this.store.dispatch(new LogoutAction());
  }

}
