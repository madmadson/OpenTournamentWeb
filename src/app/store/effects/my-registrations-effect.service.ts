import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {MySiteService} from '../../service/my-site.service';
import {MY_SITE_SUBSCRIBE_ACTION, MySiteSubscribeAction} from '../actions/my-site-actions';

@Injectable()
export class MySiteEffectService {


  @Effect({dispatch: false}) subscribe = this.actions$
    .ofType(MY_SITE_SUBSCRIBE_ACTION)
    .debug('MY_SITE_SUBSCRIBE_ACTION')
    .map((action: MySiteSubscribeAction) => this.mySiteService.subscribeOnMySite(action.payload));


  constructor(
    private actions$: Actions,
    private mySiteService: MySiteService
  ) { }



}
