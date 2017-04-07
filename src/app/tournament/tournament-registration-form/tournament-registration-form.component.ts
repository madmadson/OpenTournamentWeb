import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RegistrationVM} from '../registration.vm';

import * as moment from 'moment';
import {TournamentVM} from '../tournament.vm';
import {Player} from '../../../../shared/model/player';
import {getAllFactions} from "../../../../shared/model/factions";


@Component({
  selector: 'tournament-registration-form',
  templateUrl: './tournament-registration-form.component.html',
  styleUrls: ['./tournament-registration-form.component.css']
})
export class TournamentRegistrationFormComponent implements OnInit {

  @Input()
   actualTournament: TournamentVM;

  @Input()
   playerData: Player;

  @Output() onSaveRegistration = new EventEmitter<RegistrationVM>();


  tournamentRegistrationForm: FormGroup;

  factions: string[];

  constructor(private formBuilder: FormBuilder) {

    this.factions = getAllFactions();
  }

  ngOnInit() {

    this.tournamentRegistrationForm = this.formBuilder.group({
      playerName: [ {
        value: this.playerData.getFullPlayerName(), disabled: true
      } , [Validators.required]],
      faction: [''],
      meta: [this.playerData.meta],
      team: [''],
    });


  }

  saveTournamentRegistration() {

    const registration = this.prepareSaveRegistration();
    this.onSaveRegistration.emit(registration);
  }

  prepareSaveRegistration(): RegistrationVM {
    const formModel = this.tournamentRegistrationForm.value;

    return {
      id: undefined,
      tournamentId: this.actualTournament.id,
      playerName: this.playerData.getFullPlayerName(),
      origin: this.playerData.origin,
      meta: formModel.meta,
      registrationDate: moment().format(),
      teamName: formModel.team,
      playerId: this.playerData.id,
      teamId: '',
      country: this.playerData.country,
      elo: this.playerData.elo
    };
  }

}
