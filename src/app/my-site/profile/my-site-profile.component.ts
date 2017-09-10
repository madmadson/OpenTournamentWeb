import {Observable} from 'rxjs/Observable';

import {Store} from '@ngrx/store';

import {MdDialog} from '@angular/material';


import {Component} from '@angular/core';
import {Player} from '../../../../shared/model/player';

import {AppState} from '../../store/reducers/index';
import {Router} from '@angular/router';
import {TournamentFormDialogComponent} from "../../dialogs/tournament-form-dialog";
import {Tournament} from "../../../../shared/model/tournament";
import {Subscription} from "rxjs/Subscription";
import {TournamentPushAction} from "../../store/actions/tournaments-actions";


@Component({
  selector: 'my-site-profile',
  templateUrl: './my-site-profile.component.html',
  styleUrls: ['./my-site-profile.component.scss']
})
export class MySiteProfileComponent {

  userPlayerData$: Observable<Player>;

  router: Router;
  userPlayerSubscription: Subscription;
  userPlayerData: Player;

  constructor(private _router: Router,
              private store: Store<AppState>,
              public dialog: MdDialog) {

    this.router = _router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);

    this.userPlayerSubscription = this.userPlayerData$.subscribe((player: Player) => {
      if (player && player.id) {
        this.userPlayerData = player;
      }
    });
  }

  openCreateTournamentDialog(): void {
    const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
      data: {
        tournament: new Tournament('', '', '', '', 16, 0, 0, 0, 0,
          this.userPlayerData.userUid, this.userPlayerData.userEmail, true, false, false, '', '', []),
        allActualTournamentPlayers: [],
        allRegistrations: [],
        tournamentTeams: 0,
        tournamentTeamRegistrations: 0
      },
      width: '800px'
    });

    const saveEventSubscribe = dialogRef.componentInstance.onSaveTournament.subscribe(tournament => {
      if (tournament) {
        this.store.dispatch(new TournamentPushAction(tournament));
      }
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }
}
