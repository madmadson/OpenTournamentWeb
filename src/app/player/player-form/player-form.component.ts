import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {Player} from '../../../../shared/model/player';

import {PlayerPushAction} from '../../store/actions/players-actions';
import {getAllCountries} from '../../../../shared/model/countries';

@Component({
  selector: 'player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss']
})
export class PlayerFormComponent implements OnInit {

  @Input()
  playerData: Player;

  playerForm: FormGroup;

  countries: string[];

  currentUserId: string;
  currentUserEmail: string;

  constructor(protected formBuilder: FormBuilder,
              protected store: Store<ApplicationState>) {

    this.countries = getAllCountries();

    this.store.select(state => state.authenticationStoreState).subscribe(authenticationState => {
      this.currentUserId = authenticationState.currentUserId;
      this.currentUserEmail = authenticationState.currentUserEmail;
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.playerForm = this.formBuilder.group({
      firstName: [this.playerData ? this.playerData.firstName : '',
        Validators.compose([Validators.required, Validators.maxLength(50)])],
      nickName: [this.playerData ? {value: this.playerData.nickName, disabled: true} : '', [Validators.required]],
      lastName: [this.playerData ? this.playerData.lastName : '', [Validators.required]],
      origin: [this.playerData ? this.playerData.origin : ''],
      meta: [this.playerData ? this.playerData.meta : ''],
      elo: [this.playerData ? {value: this.playerData.elo, disabled: true} : {value: 1000, disabled: true}],
      country: [this.playerData ? this.playerData.country : ''],
    });
  }

  save() {

    const playerModel: Player = this.preparePlayer();

    if (this.playerData) {
      playerModel.id = this.playerData.id;
    }

    this.store.dispatch(new PlayerPushAction(playerModel));

  }

  private preparePlayer(): Player {

    const formModel = this.playerForm.value;

    return new Player(
      this.currentUserId,
      this.currentUserEmail,
      formModel.firstName as string,
      this.playerData ? this.playerData.nickName : formModel.nickName as string,
      formModel.lastName as string,
      this.playerData ? this.playerData.elo : 1000,
      formModel.origin as string,
      formModel.meta as string,
      formModel.country as string
    );
  }

}
