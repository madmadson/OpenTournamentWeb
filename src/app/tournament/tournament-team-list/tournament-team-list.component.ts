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


@Component({
  selector: 'tournament-team-list',
  templateUrl: './tournament-team-list.component.html',
  styleUrls: ['./tournament-team-list.component.scss']
})
export class TournamentTeamListComponent implements OnInit {

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() actualTournamentTeams$: Observable<TournamentTeam[]>;
  @Input() actualTournament: Tournament;
  @Input() userPlayerData: Player;
  @Input() allActualTournamentPlayers: TournamentPlayer[];

  @Output() onEraseTournamentTeam = new EventEmitter<TournamentTeamEraseModel>();
  @Output() onAddTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onKickTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAddArmyLists = new EventEmitter<TournamentPlayer>();

  truncateMax: number;
  smallScreen: boolean;

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
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        team: team,
      }
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
    });
  }

  isAdmin(): boolean {
    if (this.actualTournament && this.userPlayerData) {
      return this.actualTournament.creatorUid === this.userPlayerData.userUid;
    }
   return false;
  }

  eraseTeam(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const allPlayersForTeam = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });


    this.onEraseTournamentTeam.emit({
      team: team,
      tournament: this.actualTournament,
      players: allPlayersForTeam
    });
  }

  checkTournamentFull(team: TournamentTeam) {
    const allPlayersForTeam = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });

    return allPlayersForTeam.length >= this.actualTournament.teamSize;
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
