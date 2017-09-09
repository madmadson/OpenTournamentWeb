import {Observable} from 'rxjs/Observable';

import {Store} from '@ngrx/store';

import {MdDialog} from '@angular/material';


import {Component} from '@angular/core';
import {Player} from '../../../../shared/model/player';

import {AppState} from '../../store/reducers/index';
import {Router} from '@angular/router';


@Component({
  selector: 'my-site-profile',
  templateUrl: './my-site-profile.component.html',
  styleUrls: ['./my-site-profile.component.scss']
})
export class MySiteProfileComponent {

  userPlayerData$: Observable<Player>;

  router: Router;

  constructor(private _router: Router,
              private store: Store<AppState>,
              public dialog: MdDialog) {

    this.router = _router;

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
  }
}
