import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {Player} from '../../../../shared/model/player';
import {composeValidators} from '@angular/forms/src/directives/shared';

@Component({
  selector: 'player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {

  playerForm: FormGroup;

  playerData: Player;

  countries = ['Australia', 'Austria', 'Belarius', 'Belgium', 'Canada', 'China', 'Czech', 'Denmark', 'England',
               'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Netherlands',
               'New Zealand', 'Northern Ireland', 'Norway', 'Poland', 'Portugal', 'Rusia', 'Scotland', 'Slovenia',
               'Spain', 'Sweden', 'Switzerland', 'USA' , 'Wales'];

  constructor(private formBuilder: FormBuilder,
              private store: Store<ApplicationState>) {

    this.store.select(state => state.storeData.playerData).subscribe(playerDate => {
       this.playerData = playerDate;
    });
  }

  ngOnInit() {

    this.initForm();

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

  update() {

  }

  save() {

  }

}
