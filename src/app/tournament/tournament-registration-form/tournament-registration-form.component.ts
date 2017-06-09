import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import * as moment from 'moment';
import {Player} from '../../../../shared/model/player';
import {getAllFactions} from '../../../../shared/model/factions';

import {Tournament} from '../../../../shared/model/tournament';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {Registration} from '../../../../shared/model/registration';


@Component({
  selector: 'tournament-registration-form',
  templateUrl: './tournament-registration-form.component.html',
  styleUrls: ['./tournament-registration-form.component.scss']
})
export class TournamentRegistrationFormComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() userPlayerData: Player;
  @Input() team: TournamentTeam;

  @Output() onSaveRegistration = new EventEmitter<Registration>();

  tournamentRegistrationForm: FormGroup;
  factions: string[];

  constructor(private formBuilder: FormBuilder) {

    this.factions = getAllFactions();
  }

  ngOnInit() {

    if (this.team) {
      this.tournamentRegistrationForm = this.formBuilder.group({
        playerName: [ {
          value: this.userPlayerData.getFullPlayerName(), disabled: true
        } , [Validators.required]],
        faction: [''],
        meta: [this.userPlayerData.meta],
        teamName: [{value: this.team.teamName, disabled: true}, [Validators.required]],
      });
    } else {
      this.tournamentRegistrationForm = this.formBuilder.group({
        playerName: [ {
          value: this.userPlayerData.getFullPlayerName(), disabled: true
        } , [Validators.required]],
        faction: [''],
        meta: [this.userPlayerData.meta],
        teamName: [''],
      });
    }
  }

  saveTournamentRegistration() {

    const registration = this.prepareSaveRegistration();
    this.onSaveRegistration.emit(registration);
  }

  prepareSaveRegistration(): Registration {
    const formModel = this.tournamentRegistrationForm.getRawValue();

    return {
      tournamentId: this.actualTournament.id,
      tournamentName: this.actualTournament.name,
      tournamentLocation: this.actualTournament.location,
      tournamentDate: this.actualTournament.beginDate,
      playerName: this.userPlayerData.getFullPlayerName(),
      email: this.userPlayerData.userEmail,
      origin: this.userPlayerData.origin,
      meta: formModel.meta,
      registrationDate: moment().format(),
      teamName: formModel.teamName,
      playerId: this.userPlayerData.id,
      teamId: '',
      country: this.userPlayerData.country,
      elo: this.userPlayerData.elo,
      faction: formModel.faction,
      isTournamentPlayer: false
    };
  }

}
