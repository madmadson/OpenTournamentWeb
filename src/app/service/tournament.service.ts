import {Injectable, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {Router} from "@angular/router";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {TournamentsLoadedAction} from "../store/actions/tournament-actions";
import {Subscription} from "rxjs";
import {Tournament} from "../../../shared/model/tournament";

@Injectable()
export class TournamentService implements OnDestroy{

  private tournamentSubscription: Subscription;

  constructor(protected afService: AngularFire, private store: Store<ApplicationState>, private  router: Router) {
  }

  subscribeOnTournaments() {

    let tournaments$: FirebaseListObservable<any[]> = this.afService.database.list("tournaments");

     this.tournamentSubscription = tournaments$.subscribe(tournaments => {
       this.store.dispatch(new TournamentsLoadedAction(tournaments));
    });
  }

  unsubscribeOnTournaments() {

    if(this.tournamentSubscription !== null) {
      this.tournamentSubscription.unsubscribe();
    }
  }

  pushTournament(tournament:Tournament){
    const tournaments = this.afService.database.list("tournaments");

    tournaments.push(tournament);
  }

  ngOnDestroy(): void {

    this.unsubscribeOnTournaments()
  }
}
