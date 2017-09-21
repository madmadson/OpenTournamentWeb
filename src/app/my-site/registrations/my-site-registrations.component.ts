import {Component, OnDestroy} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';
import {Observable} from 'rxjs/Observable';
import {Player} from '../../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';
import {MyRegistrationsService} from './my-registrations.service';
import {AppState} from '../../store/reducers/index';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {TournamentFormDialogComponent} from "../../dialogs/tournament-form-dialog";
import {MdDialog} from "@angular/material";
import {Tournament} from "../../../../shared/model/tournament";
import {TournamentsService} from "../../tournaments/tournaments.service";


@Component({
  selector: 'my-site-registrations',
  templateUrl: './my-site-registrations.component.html',
  styleUrls: ['./my-site-registrations.component.scss']
})
export class MySiteRegistrationsComponent implements OnDestroy{


  allMyRegistrations$: Observable<Registration[]>;
  loadMyRegistrations$: Observable<boolean>;

  userPlayerData$: Observable<Player>;
  userPlayerSubscription: Subscription;

  router: Router;
  userPlayerData: Player;

  constructor(private _router: Router,
              private store: Store<AppState>,
              public dialog: MdDialog,
              private myRegistrationsService: MyRegistrationsService,
              private tournamentsService: TournamentsService,
              private winRef: WindowRefService) {

    this.router = _router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);


    this.userPlayerSubscription = this.userPlayerData$.subscribe((player: Player) => {
      if (player && player.id) {
        this.userPlayerData = player;
        this.myRegistrationsService.subscribeOnFirebaseMyRegistrations(player.id);
      }
    });
    this.allMyRegistrations$ = this.store.select(state => state.myRegistrations.myRegistrations).
    map(data => {
      data.sort((a, b) => {
        return moment(a.tournamentDate).isAfter(moment(b.tournamentDate)) ? -1 : 1;
      });
      return data;
    });
    this.loadMyRegistrations$ = this.store.select(state => state.myRegistrations.loadMyRegistrations);
  }

  ngOnDestroy(): void {

    this.myRegistrationsService.unsubscribeOnFirebaseMyRegistrations();
    this.userPlayerSubscription.unsubscribe();
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
      this.tournamentsService.pushTournament(tournament);
      }
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }
}
