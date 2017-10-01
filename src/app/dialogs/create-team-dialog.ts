

import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {Player} from '../../../shared/model/player';
import {Tournament} from '../../../shared/model/tournament';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {getAllCountries} from '../../../shared/model/countries';

import * as _ from 'lodash';

@Component({
  selector: 'create-team-dialog',
  templateUrl: './create-team-dialog.html'
})
export class CreateTeamDialogComponent implements OnInit {

  @Output() onCreateTeamForTeamTournament = new EventEmitter<TournamentTeam>();

  userPlayerData: Player;
  actualTournament: Tournament;
  countries: string[];
  tournamentTeams: TournamentTeam[];
  tournamentTeamRegistrations: TournamentTeam[];

  createTournamentForm: FormGroup;

  teamNameAlreadyInUse: boolean;
  byeNotAllowed: boolean;

  constructor(public dialogRef: MdDialogRef<CreateTeamDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {

    this.countries = getAllCountries();
    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;

    this.tournamentTeamRegistrations = data.tournamentTeamRegistrations;
    this.tournamentTeams = data.tournamentTeams;
  }

  ngOnInit(): void {

    this.createTournamentForm = this.formBuilder.group({
      teamName: ['', [Validators.required]],
      meta: [this.userPlayerData.meta],
      country: [''],
    });
  }

  onSaveTeam() {
    const team = this.prepareTeam();

    this.onCreateTeamForTeamTournament.emit(team);
    this.dialogRef.close();
  }

  prepareTeam(): TournamentTeam {
    const formModel = this.createTournamentForm.value;

    return {
      isRegisteredTeam: false,
      tournamentId: this.actualTournament.id,
      creatorUid: this.userPlayerData.userUid,
      teamName: formModel.teamName,
      country: formModel.country,
      meta: formModel.meta,
      isAcceptedTournamentTeam: false,
      tournamentPlayerIds: [],
      registeredPlayerIds: [],
      creatorMail: '',
      leaderName: 'Created by Orga',
      armyListsChecked: false,
      paymentChecked: false,
      playerMarkedPayment: false,
      playerUploadedArmyLists: false,
      droppedInRound: 0
    };
  }

  checkTeamName() {

    const that = this;
    that.teamNameAlreadyInUse = false;

    that.byeNotAllowed = that.createTournamentForm.get('teamName').value.toLowerCase() === 'bye';

    _.forEach(this.tournamentTeams, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.createTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

    _.forEach(this.tournamentTeamRegistrations, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.createTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

  }
}
