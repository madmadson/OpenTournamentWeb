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

  constructor(private myGamesService: MyGamesService,
              private store: Store<AppState>,
              private _router: Router,
              private winRef: WindowRefService) {

    this.router = this._router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);


    this.userPlayerSubscription = this.userPlayerData$.subscribe((player: Player) => {
      if (player && player.id) {
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


  onSelect(game: TournamentGame) {
    this.router.navigate(['/tournament/' + game.tournamentId]);
  }
}
