import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";

import {ActivatedRoute, Router} from "@angular/router";
import {TournamentSubscribeAction} from "../../store/actions/tournament-actions";
import {TournamentVM} from "../tournament.vm";
import {mapTournamentToTournamentVM} from "../tournamentToVMSelector";
import {Observable} from "rxjs/Observable";
import {ApplicationState} from "../../store/application-state";


@Component({
  selector: 'tournament-preparation',
  templateUrl: './tournament-preparation.component.html',
  styleUrls: ['./tournament-preparation.component.css']
})
export class TournamentPreparationComponent implements OnInit {
  private actualTournament$: Observable<TournamentVM>;
  private tournamentId: string;


  constructor( private store: Store<ApplicationState>, private activeRouter: ActivatedRoute, private router: Router) {
    this.actualTournament$ = this.store.select(state => {
      return  mapTournamentToTournamentVM(state.storeData.actualTournament);
    });

  }

  ngOnInit() {

    this.activeRouter.params.subscribe(

      params => {
        this.tournamentId = params['id'];
        this.store.dispatch(new TournamentSubscribeAction(params['id']));
      }
    );

  }


  register() {
    this.router.navigate(['register'], { relativeTo: this.activeRouter });
  }
}
