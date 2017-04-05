import {Component, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";
import {Observable} from "rxjs/Observable";
import {PlayerVM} from "../player.vm";
import {PlayersSubscribeAction, PlayersUnsubscribeAction} from "../../store/actions/players-actions";

@Component({
  selector: 'player-list-overview',
  templateUrl: './player-list-overview.component.html',
  styleUrls: ['./player-list-overview.component.css']
})
export class PlayerListOverviewComponent implements OnInit, OnDestroy {
  private allPlayers$: Observable<PlayerVM[]>;

  constructor(private store: Store<ApplicationState>) { }

  ngOnInit() {

    this.allPlayers$ = this.store.select(state => state.storeData.players);
    this.store.dispatch(new PlayersSubscribeAction());
  }

  ngOnDestroy(): void {


    this.store.dispatch(new PlayersUnsubscribeAction());
  }


}
