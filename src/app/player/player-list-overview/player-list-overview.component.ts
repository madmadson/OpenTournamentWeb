import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';

import {PlayersSubscribeAction} from '../../store/actions/players-actions';

import * as _ from 'lodash';
import {Player} from '../../../../shared/model/player';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from '../../store/reducers/index';
import {PlayersService} from "../players.service";
import {Observable} from "rxjs/Observable";
import {CHANGE_SEARCH_FIELD_PLAYERS_ACTION} from "../players-actions";


@Component({
  selector: 'player-list-overview',
  templateUrl: './player-list-overview.component.html',
  styleUrls: ['./player-list-overview.component.scss']
})
export class PlayerListOverviewComponent implements OnInit, OnDestroy {

  allPlayer$: Observable<Player[]>;
  allPlayerFiltered$: Observable<Player[]>;

  playersLoaded$: Observable<boolean>;
  searchField$: Observable<string>;

  @ViewChild('searchField') searchField: ElementRef;

  constructor(private playersService: PlayersService,
              private store: Store<AppState>) {

    this.playersService.subscribeOnFirebase();

    this.allPlayer$ = this.store.select(state => state.players.players).map(data => {
      data.sort((a, b) => {
        return a.elo > b.elo ? -1 : 1;
      });
      return data;
    });
    this.playersLoaded$ = this.store.select(state => state.players.loadPlayers);
    this.searchField$ = this.store.select(state => state.players.searchField);


    this.allPlayerFiltered$ = Observable.combineLatest(
      this.allPlayer$,
      this.searchField$,
      (allPlayers, searchField) => {
        return allPlayers.filter((p: Player) => {
          const searchStr = p.firstName.toLowerCase() ||
            p.nickName.toLowerCase() ||
            p.lastName.toLowerCase();
          return searchStr.startsWith(searchField.toLowerCase());
        });
      });
  }

  ngOnInit() {

    Observable.fromEvent(this.searchField.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this.store.dispatch({type: CHANGE_SEARCH_FIELD_PLAYERS_ACTION, payload: this.searchField.nativeElement.value});
      });

  }

  ngOnDestroy() {
    this.playersService.unsubscribeOnFirebase();
  }



}
