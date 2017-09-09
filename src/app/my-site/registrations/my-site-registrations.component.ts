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

  constructor(private _router: Router,
              private store: Store<AppState>,
              private myRegistrationsService: MyRegistrationsService,
              private winRef: WindowRefService) {

    this.router = _router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);


    this.userPlayerSubscription = this.userPlayerData$.subscribe((player: Player) => {
      if (player && player.id) {
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


}
