import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {getAllCountries} from '../../../shared/model/countries';
import {getAllFactions} from '../../../shared/model/factions';
import {Tournament} from '../../../shared/model/tournament';

import * as _ from 'lodash';

@Component({
  selector: 'add-offline-player-dialog',
  templateUrl: './add-tournament-player-dialog.html'
})
export class NewTournamentPlayerDialogComponent {

  tournamentPlayerModel: TournamentPlayer;
  tournament: Tournament;
  allActualTournamentPlayers: TournamentPlayer[];

  countries: string[];
  factions: string[];

  preselectTeam: string;

  nameWarning: boolean;
  playerNameAlreadyInUse: boolean;
  dummyNotAllowed: boolean;

  @Output() onSaveNewTournamentPlayer = new EventEmitter<TournamentPlayer>();

  constructor(public dialogRef: MdDialogRef<NewTournamentPlayerDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.countries = getAllCountries();
    this.factions = getAllFactions();
    this.tournament = data.actualTournament;
    this.allActualTournamentPlayers = data.allActualTournamentPlayers;
    this.preselectTeam = data.team;

    this.tournamentPlayerModel = {
      tournamentId: this.tournament.id,
      playerName: '',
      teamName: data.team ? data.team.teamName : '',
      origin: '',
      meta: '',
      country: '',
      faction: ''
    };
  }

  checkName() {

    const that = this;
    that.playerNameAlreadyInUse = false;


    that.dummyNotAllowed = that.tournamentPlayerModel.playerName.toLowerCase() === 'dummy';

    _.each(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      that.nameWarning = _.includes(
        player.playerName.toLowerCase(), that.tournamentPlayerModel.playerName.toLowerCase()
      );

      if (player.playerName.toLowerCase() === that.tournamentPlayerModel.playerName.toLowerCase()) {
        that.playerNameAlreadyInUse = true;
      }
    });

  }

  saveTournamentPlayer() {


    if (this.tournamentPlayerModel.playerName !== '') {
      this.onSaveNewTournamentPlayer.emit(this.tournamentPlayerModel);
      this.dialogRef.close();
    }
  }
}
