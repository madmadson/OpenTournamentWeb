import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {RegistrationPush} from '../../../../shared/dto/registration-push';
import {Registration} from '../../../../shared/model/registration';

import * as moment from 'moment';
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

  factions: string[];
  allTeamNames: string[];

  joinExistingTeam: boolean;

  locality: string;
  teamName: string;
  faction: string;

  @Output() onAddTournamentRegistration = new EventEmitter<RegistrationPush>();

  constructor(public dialogRef: MdDialogRef<AddPlayerRegistrationDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {

    this.userPlayerData = this.data.userPlayerData;
    this.actualTournament = this.data.actualTournament;
    this.allTeamNames = this.data.allTeamNames;

    this.factions = getAllFactions();

    this.locality = this.userPlayerData.meta;

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


  prepareSaveRegistration(): Registration {

    return {
      tournamentId: this.actualTournament.id,
      tournamentName: this.actualTournament.name,
      tournamentLocation: this.actualTournament.location,
      tournamentDate: this.actualTournament.beginDate,
      playerName: this.userPlayerData.getFullPlayerName(),
      email: this.userPlayerData.userEmail,
      origin: this.userPlayerData.origin,
      meta: this.locality ? this.locality : '',
      registrationDate: moment().format(),
      teamName: this.teamName ? this.teamName : '',
      playerId: this.userPlayerData.id,
      teamId: '',
      country: this.userPlayerData.country,
      elo: this.userPlayerData.elo,
      faction: this.faction,
      isTournamentPlayer: false,
      armyListsChecked: false,
      paymentChecked: false,
      playerMarkedPayment: false,
      playerUploadedArmyLists: false
    };
  }
}
