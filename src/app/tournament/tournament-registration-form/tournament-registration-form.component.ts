import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import * as moment from 'moment';
import {TournamentVM} from '../tournament.vm';
import {Player} from '../../../../shared/model/player';
import {getAllFactions} from '../../../../shared/model/factions';
import {Registration} from '../../../../shared/model/registration';


@Component({
  selector: 'tournament-registration-form',
  templateUrl: './tournament-registration-form.component.html',
  styleUrls: ['./tournament-registration-form.component.css']
})
export class TournamentRegistrationFormComponent implements OnInit {

  @Input()
  actualTournament: TournamentVM;

  @Input()
  userPlayerData: Player;

  @Output() onSaveRegistration = new EventEmitter<Registration>();


  tournamentRegistrationForm: FormGroup;

  factions: string[];

  constructor(private formBuilder: FormBuilder) {

    this.factions = getAllFactions();
  }

  ngOnInit() {

    this.tournamentRegistrationForm = this.formBuilder.group({
      playerName: [ {
        value: this.userPlayerData.getFullPlayerName(), disabled: true
      } , [Validators.required]],
      faction: [''],
      meta: [this.userPlayerData.meta],
      team: [''],
    });


  }

  saveTournamentRegistration() {

    const registration = this.prepareSaveRegistration();
    this.onSaveRegistration.emit(registration);
  }

  prepareSaveRegistration(): Registration {
    const formModel = this.tournamentRegistrationForm.value;

    return {
      id: undefined,
      tournamentId: this.actualTournament.id,
      playerName: this.userPlayerData.getFullPlayerName(),
      email: this.userPlayerData.userEmail,
      origin: this.userPlayerData.origin,
      meta: formModel.meta,
      registrationDate: moment().format(),
      teamName: formModel.team,
      playerId: this.userPlayerData.id,
      teamId: '',
      country: this.userPlayerData.country,
      elo: this.userPlayerData.elo,
      faction: formModel.faction,
      armyLists: []
    };
  }

}
