import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {Tournament} from '../../../shared/model/tournament';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

import {TournamentTeam} from '../../../shared/model/tournament-team';

import * as _ from 'lodash';
import {Player} from '../../../shared/model/player';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {FormControl, Validators} from '@angular/forms';
import {TeamUpdate} from '../../../shared/dto/team-update';
import {ArmyList} from '../../../shared/model/armyList';
import {WindowRefService} from "../service/window-ref-service";

@Component({
  selector: 'show-team-dialog',
  templateUrl: './show-team-dialog.html'
})
export class ShowTeamDialogComponent implements OnInit {

  @Output() onKickTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAddArmyLists = new EventEmitter<TournamentPlayer>();
  @Output() onUpdateTeam = new EventEmitter<TeamUpdate>();

  tournament: Tournament;
  team: TournamentTeam;
  allActualTournamentPlayers: TournamentPlayer[];
  allTournamentPlayerForTeam: TournamentPlayer[];
  userPlayerData: Player;
  myTeam: TournamentTeam;

  isAdmin: boolean;
  isCoOrganizer: boolean;

  teamNameAlreadyInUse: boolean;
  byeNotAllowed: boolean;

  tournamentTeams: TournamentTeam[];
  tournamentTeamRegistrations: TournamentTeam[];

  teamNameFormControl: FormControl;
  metaFormControl: FormControl;
  teamArmyLists: ArmyList[];

  smallScreen: boolean;
  truncateMax: number;

  constructor(public dialogRef: MdDialogRef<ShowTeamDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 15;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }

    this.isAdmin = data.isAdmin;
    this.isCoOrganizer = data.isCoOrganizer;
    this.tournament = data.actualTournament;
    this.team = data.team;
    this.allActualTournamentPlayers = data.allActualTournamentPlayers;
    this.userPlayerData = data.userPlayerData;
    this.myTeam = data.myTeam;
    this.tournamentTeams = data.tournamentTeams;

    this.teamArmyLists = data.teamArmyLists;

    this.allTournamentPlayerForTeam = this.getPlayersForTeam(data.team);
  }

  ngOnInit() {

    this.teamNameFormControl = new FormControl(this.team.teamName, [Validators.required]);
    this.metaFormControl = new FormControl(this.team.meta);
  }

  isItMe(playerId: string) {
    if (this.userPlayerData) {
      return playerId === this.userPlayerData.id;
    }
  }

  kickPlayer(reg: TournamentPlayer) {

    this.onKickTournamentPlayer.emit(reg);
  }

  addArmyLists(tournamentPlayer: TournamentPlayer) {

    this.onAddArmyLists.emit(tournamentPlayer);
  }

  checkTeamName() {

    const that = this;
    that.teamNameAlreadyInUse = false;

    that.byeNotAllowed = that.teamNameFormControl.value.toLowerCase() === 'bye';

    _.forEach(this.tournamentTeams, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.teamNameFormControl.value.toLowerCase() &&
          team.teamName.toLowerCase() !== that.teamNameFormControl.value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });
  }

  saveTeam() {

    this.team.teamName = this.teamNameFormControl.value;
    this.team.meta = this.metaFormControl.value;

    this.onUpdateTeam.emit({
      team: this.team,
      tournamentPlayers: this.allTournamentPlayerForTeam,
      armyLists: this.teamArmyLists
    });
  }

  getPlayersForTeam(team: TournamentTeam) {

    return _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });
  }
}
