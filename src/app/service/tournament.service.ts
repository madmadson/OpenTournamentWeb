import {Inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {AngularFire, FirebaseRef} from "angularfire2";
import {TournamentsClearAction} from "../store/actions/tournaments-actions";
import {SetActualTournamentAction} from "../store/actions/tournament-actions";
import {Registration} from "../../../shared/model/registration";
import {Router} from "@angular/router";

@Injectable()
export class TournamentService {

  private tournament: any;

  constructor(protected afService: AngularFire, protected store: Store<ApplicationState>, @Inject(FirebaseRef) private fb, private router: Router) {

  }

  subscribeOnTournament(tournamentId: string) {
    console.log('subscribe on tournament with id: ' + tournamentId);
    this.store.dispatch(new TournamentsClearAction());

    this.afService.database.object('tournaments/' + tournamentId).subscribe(
      tournament => this.store.dispatch(new SetActualTournamentAction(tournament))
    );
  }

  pushRegistration(payload: Registration) {
    const newRegistration = Registration.fromRegistrationVM(payload);

    const registrations = this.afService.database.list('tournament-registration/' + newRegistration.tournamentId );
    // registrations.push(newRegistration);


  }
}
