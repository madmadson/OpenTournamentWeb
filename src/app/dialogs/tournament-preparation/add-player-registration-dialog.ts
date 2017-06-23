import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {RegistrationPush} from '../../../../shared/dto/registration-push';
import {Registration} from '../../../../shared/model/registration';

import * as moment from 'moment';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {getAllFactions} from '../../../../shared/model/factions';

@Component({
  selector: 'add-player-registration-dialog',
  templateUrl: './add-player-registration-dialog.html',
  styleUrls: ['./add-player-registration-dialog.scss']
})
export class AddPlayerRegistrationDialogComponent  implements OnInit {

  userPlayerData: Player;
  actualTournament: Tournament;
  team: TournamentTeam;

  tournamentRegistrationForm: FormGroup;
  factions: string[];

  @Output() onAddTournamentRegistration = new EventEmitter<RegistrationPush>();

  constructor(public dialogRef: MdDialogRef<AddPlayerRegistrationDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {

    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;
    this.team = data.team;

    this.factions = getAllFactions();
  }

  saveTournamentRegistration() {

    const registration = this.prepareSaveRegistration();

    this.onAddTournamentRegistration.emit({
      registration: registration,
      tournament: this.actualTournament,
      tournamentTeam: this.team,
    });
    this.dialogRef.close();
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
      isTournamentPlayer: false,
      armyListForTournament: false,
      paidForTournament: false
    };
  }
}
