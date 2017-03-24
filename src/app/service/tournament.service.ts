import {Injectable, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {Router} from "@angular/router";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {TournamentsLoadedAction} from "../store/actions/tournament-actions";
import {Subscription} from "rxjs";
import {Tournament} from "../../../shared/model/tournament";

@Injectable()
export class TournamentService implements OnDestroy {

  private tournamentSubscription: Subscription;

  constructor(protected afService: AngularFire, private store: Store<ApplicationState>, private  router: Router) {
  }

  subscribeOnTournaments() {


    // this.pushTournament({
    //   name: 'Tournament1',
    //   location: 'Karlsruhe',
    //   beginDate: moment('2017-03-12').format(),
    //   endDate: moment('2017-03-12').format(),
    //   actualRound: 0,
    //   maxParticipants: 16,
    //   teamSize: 1
    // });
    // this.pushTournament({
    //   name: 'Tournament2',
    //   location: 'Oberhausen',
    //   beginDate: moment('2017-03-17').format(),
    //   endDate: moment('2017-03-18').format(),
    //   actualRound: 1,
    //   maxParticipants: 64,
    //   teamSize: 3
    // });
    // this.pushTournament({
    //   name: 'Tournament3',
    //   location: 'Erfurt',
    //   beginDate: moment('2017-04-01').format(),
    //   endDate: moment('2017-04-01').format(),
    //   actualRound: 0,
    //   maxParticipants: 32,
    //   teamSize: 1
    // });

    let tournaments$: FirebaseListObservable<any[]> = this.afService.database.list("tournaments", {query: {orderByChild: 'beginDate'}});

    this.tournamentSubscription = tournaments$.subscribe(tournaments => {
      this.store.dispatch(new TournamentsLoadedAction(tournaments));
    });
  }

  unsubscribeOnTournaments() {

    if (this.tournamentSubscription !== null) {
      this.tournamentSubscription.unsubscribe();
    }
  }

  pushTournament(tournament: Tournament) {
    const tournaments = this.afService.database.list("tournaments");

    tournaments.push(tournament);
  }

  ngOnDestroy(): void {

    this.unsubscribeOnTournaments()
  }
}
