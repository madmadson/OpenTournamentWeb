import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {Player} from '../../../../shared/model/player';
import {composeValidators} from '@angular/forms/src/directives/shared';
import {Subscription} from 'rxjs/Subscription';

import {PlayerPushAction} from '../../store/actions/players-actions';
import {getAllCountries} from '../../../../shared/model/countries';

@Component({
  selector: 'player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit, OnDestroy {


  @Input()
  playerData: Player;

  playerForm: FormGroup;

  countries: string[];

  private userDataSub: Subscription;
  private currentUserId: string;
  private currentUserEmail: string;

  constructor(private formBuilder: FormBuilder,
              private store: Store<ApplicationState>) {

    this.countries = getAllCountries();
  }


  ngOnInit() {

    this.initForm();


    this.userDataSub = this.store.select(state => state.authenticationState).subscribe(authenticationState => {
      this.currentUserId = authenticationState.currentUserId;
      this.currentUserEmail = authenticationState.currentUserEmail;
    });

  }

  ngOnDestroy(): void {

    this.userDataSub.unsubscribe();
  }

  initForm() {
    this.playerForm = this.formBuilder.group({
      firstName: [this.playerData ? this.playerData.firstName : '',
        composeValidators([Validators.required, Validators.maxLength(50)])],
      nickName: [this.playerData ? {value: this.playerData.nickName, disabled: true} : '', [Validators.required]],
      lastName: [this.playerData ? this.playerData.lastName : '', [Validators.required]],
      origin: [this.playerData ? this.playerData.origin : ''],
      meta: [this.playerData ? this.playerData.meta : ''],
      country: [this.playerData ? this.playerData.country : ''],
    });
  }

  save() {

    const playerModel: Player = this.preparePlayer();

    this.store.dispatch(new PlayerPushAction(playerModel));

  }

  private preparePlayer(): Player {

    const formModel = this.playerForm.value;

    return new Player(
      this.currentUserId,
      this.currentUserEmail,
      formModel.firstName as string,
      formModel.nickName as string,
      formModel.lastName as string,
      1000,
      formModel.origin as string,
      formModel.meta as string,
      formModel.country as string
    );
  }

}
