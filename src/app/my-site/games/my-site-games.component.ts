import {Component, OnDestroy} from '@angular/core';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';
import {Observable} from 'rxjs/Observable';
import {Player} from '../../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';
import {MyGamesService} from './my-games.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers/index';
import {TournamentFormDialogComponent} from '../../dialogs/tournament-form-dialog';
import {Tournament} from '../../../../shared/model/tournament';
import {MdDialog} from '@angular/material';
import {TournamentsService} from '../../tournaments/tournaments.service';

@Component({
  selector: 'my-site-games',
  templateUrl: './my-site-games.component.html',
  styleUrls: ['./my-site-games.component.scss']
})
export class MySiteGamesComponent implements OnDestroy{

  allMyGames$: Observable<TournamentGame[]>;
  loadMyGames$: Observable<boolean>;

  userPlayerData$: Observable<Player>;
  userPlayerSubscription: Subscription;

  router: Router;

  userPlayerData: Player;

  constructor(private myGamesService: MyGamesService,
              private store: Store<AppState>,
              private _router: Router,
              public dialog: MdDialog,
              private tournamentsService: TournamentsService,
              private winRef: WindowRefService) {

    this.router = this._router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);


    this.userPlayerSubscription = this.userPlayerData$.subscribe((player: Player) => {
      if (player && player.id) {
        this.userPlayerData = player;
        this.myGamesService.subscribeOnFirebaseMyGames(player.id);
      }
    });
    this.allMyGames$ = this.store.select(state => state.myGames.myGames);
    this.loadMyGames$ = this.store.select(state => state.myGames.loadMyGames);
  }

  ngOnDestroy(): void {

    this.myGamesService.unsubscribeOnFirebaseMyGames();
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
