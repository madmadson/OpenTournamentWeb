import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {ArmyList} from '../../../../shared/model/armyList';
import {Tournament} from '../../../../shared/model/tournament';
import {Player} from '../../../../shared/model/player';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {WindowRefService} from 'app/service/window-ref-service';
import {MdDialog} from '@angular/material';


import * as _ from 'lodash';
import {TournamentTeamEraseModel} from '../../../../shared/dto/tournament-team-erase';
import {ShowTeamDialogComponent} from '../../dialogs/show-team-dialog';
import {NewTournamentPlayerDialogComponent} from '../../dialogs/add-tournament-player-dialog';

import {ShowArmyListDialogComponent} from '../../dialogs/show-army-lists-dialog';
import {TeamUpdate} from '../../../../shared/dto/team-update';


@Component({
  selector: 'tournament-team-list2',
  templateUrl: './tournament-team-list.component.html',
  styleUrls: ['./tournament-team-list.component.scss']
})
export class TournamentTeamListComponentA implements OnInit {

  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() actualTournamentTeams: TournamentTeam[];
  @Input() actualTournament: Tournament;
  @Input() userPlayerData: Player;
  @Input() allActualTournamentPlayers: TournamentPlayer[];

  @Output() onEraseTournamentTeam = new EventEmitter<TournamentTeamEraseModel>();
  @Output() onAddTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onKickTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAddArmyLists = new EventEmitter<TournamentPlayer>();
  @Output() onUpdateTeam = new EventEmitter<TeamUpdate>();

  truncateMax: number;
  smallScreen: boolean;

  teamDeleteRequested: string;

  armyLists: ArmyList[];

  constructor(public dialog: MdDialog,
              private winRef: WindowRefService) {
    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 10;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  ngOnInit() {

    this.actualTournamentArmyList$.subscribe(armyLists => {
      this.armyLists = armyLists;
    });
  }

  getPlayersForTeam(teamName: string): number {
    const allPlayersForTeam = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === teamName;
    });

    return allPlayersForTeam.length;
  }

  showTeam(team: TournamentTeam) {

    const dialogRef = this.dialog.open(ShowTeamDialogComponent, {
      data: {
        isAdmin: this.isAdmin,
        isCoOrganizer: this.isCoOrganizer,
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        team: team,
        tournamentTeams: this.actualTournamentTeams,
      }
    });

    const updateTeamEventSubscribe = dialogRef.componentInstance.onUpdateTeam.subscribe((updatedTeam: TeamUpdate) => {

      if (updatedTeam !== undefined) {
        this.onUpdateTeam.emit(updatedTeam);
      }
      dialogRef.close();
    });

    const saveEventSubscribe = dialogRef.componentInstance.onAddArmyLists.subscribe(tournamentPlayer => {

      if (tournamentPlayer !== undefined) {
        this.onAddArmyLists.emit(tournamentPlayer);
      }
    });

    const kickEventSubscribe = dialogRef.componentInstance.onKickTournamentPlayer.subscribe(tournamentPlayer => {

      if (tournamentPlayer !== undefined) {
        this.onKickTournamentPlayer.emit(tournamentPlayer);
      }
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      updateTeamEventSubscribe.unsubscribe();
    });
  }

  eraseTeam(event: any, team: TournamentTeam) {

    event.stopPropagation();

    this.teamDeleteRequested = '';

    const allPlayersForTeam = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });


    this.onEraseTournamentTeam.emit({
      team: team,
      tournament: this.actualTournament,
      players: allPlayersForTeam
    });
  }

  teamDeleteRequestedClicked(event: any, team: TournamentTeam ) {
    event.stopPropagation();

    this.teamDeleteRequested = team.teamName;
  }

  teamDeleteDeclinedClicked(event: any) {
    event.stopPropagation();

    this.teamDeleteRequested = '';
  }

  checkTournamentFull(team: TournamentTeam) {
    const allPlayersForTeam = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });

    return allPlayersForTeam.length === this.actualTournament.teamSize;
  }

  checkTournamentOver(team: TournamentTeam) {
    const allPlayersForTeam = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });

    return allPlayersForTeam.length > this.actualTournament.teamSize;
  }

  showArmyList(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const myArmyLists: ArmyList[] = _.filter(this.armyLists, function (list: ArmyList) {
      if (list.teamName) {
        return (list.teamName === team.teamName);
      }
    });

    this.dialog.open(ShowArmyListDialogComponent, {
      data: {
        tournamentTeam: team,
        armyLists: myArmyLists
      }
    });
  }

  addPlayerToTeam(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const dialogRef = this.dialog.open(NewTournamentPlayerDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        team: team
      },
      width: '800px',
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveNewTournamentPlayer.
    subscribe((tournamentPlayer: TournamentPlayer) => {

      if (tournamentPlayer !== undefined) {
        this.onAddTournamentPlayer.emit(tournamentPlayer);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }
}
