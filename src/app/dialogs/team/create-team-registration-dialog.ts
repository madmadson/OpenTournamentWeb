import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {getAllCountries} from '../../../../shared/model/countries';

import * as _ from 'lodash';
import * as moment from 'moment';
import {getAllFactions} from '../../../../shared/model/factions';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';

@Component({
  selector: 'create-team-registration-dialog',
  templateUrl: './create-team-registration-dialog.html',
  styleUrls: ['./create-team-registration-dialog.scss']
})
export class CreateTeamRegistrationDialogComponent implements OnInit {

  @Output() onCreateTeamRegistration = new EventEmitter<TeamRegistrationPush>();

  userPlayerData: Player;
  actualTournament: Tournament;
  countries: string[];
  tournamentTeams: TournamentTeam[];
  tournamentTeamRegistrations: TournamentTeam[];

  registerTournamentForm: FormGroup;

  teamNameAlreadyInUse: boolean;
  byeNotAllowed: boolean;
  factions: string[];

  constructor(public dialogRef: MdDialogRef<CreateTeamRegistrationDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {

    this.countries = getAllCountries();
    this.factions = getAllFactions();
    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;

    this.tournamentTeamRegistrations = data.tournamentTeamRegistrations;
    this.tournamentTeams = data.tournamentTeams;
  }

  ngOnInit(): void {

    this.registerTournamentForm = this.formBuilder.group({
      teamName: ['', [Validators.required]],
      meta: [this.userPlayerData.meta],
      country: [''],
      faction: [this.factions[0], [Validators.required]]
    });
  }

  onRegisterTeam() {
    const team = this.prepareTeam();

    this.onCreateTeamRegistration.emit({
      team: team,
      tournament: this.actualTournament,
      registrations: [{
        tournamentId: this.actualTournament.id,
        tournamentName: this.actualTournament.name,
        tournamentLocation: this.actualTournament.location,
        tournamentDate: this.actualTournament.beginDate,
        playerName: this.userPlayerData.getFullPlayerName(),
        email: this.userPlayerData.userEmail,
        origin: this.userPlayerData.origin,
        meta: this.registerTournamentForm.value.meta ? this.registerTournamentForm.value.meta  : '',
        registrationDate: moment().format(),
        teamName: this.registerTournamentForm.value.teamName ,
        playerId: this.userPlayerData.id,
        teamId: '',
        country: this.userPlayerData.country,
        elo: this.userPlayerData.elo,
        faction: this.registerTournamentForm.value.faction,
        isTournamentPlayer: false,
        armyListsChecked: false,
        paymentChecked: false,
        playerMarkedPayment: false,
        playerUploadedArmyLists: false
      }]
    });
    this.dialogRef.close();
  }

  prepareTeam(): TournamentTeam {
    const formModel = this.registerTournamentForm.value;

    return {
      isRegisteredTeam: true,
      tournamentId: this.actualTournament.id,
      creatorUid: this.userPlayerData.userUid,
      teamName: formModel.teamName,
      country: formModel.country,
      meta: formModel.meta,
      isAcceptedTournamentTeam: false,
      tournamentPlayerIds: [],
      registeredPlayerIds: [this.userPlayerData.id],
      creatorMail: this.userPlayerData.userEmail,
      leaderName: this.userPlayerData.nickName,
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

    that.byeNotAllowed = that.registerTournamentForm.get('teamName').value.toLowerCase() === 'bye';

    _.forEach(this.tournamentTeams, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.registerTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

    _.forEach(this.tournamentTeamRegistrations, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.registerTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

  }
}
