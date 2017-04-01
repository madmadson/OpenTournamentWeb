import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {TournamentVM} from "../tournament.vm";

@Component({
  selector: 'tournament-edit',
  templateUrl: 'tournament-edit.component.html',
  styleUrls: ['tournament-edit.component.css']
})
export class TournamentEditComponent implements OnInit, OnDestroy {


  private tournamentId: string;
  private sub: any;

  tournament$: Observable<TournamentVM>;

  constructor(private store: Store<ApplicationState>,
    private route: ActivatedRoute) {

    // this.tournament$ = store.select(state => state.storeData.actualTournament);
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {

      this.tournamentId = params['id'];

      // this.store.dispatch(new TournamentLoadAction(this.tournamentId));

    });


  }
  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }

}
