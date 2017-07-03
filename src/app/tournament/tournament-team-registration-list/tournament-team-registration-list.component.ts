import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {MdDialog} from '@angular/material';
import {WindowRefService} from '../../service/window-ref-service';
import {Registration} from '../../../../shared/model/registration';

import * as _ from 'lodash';

import {Player} from '../../../../shared/model/player';
import {Tournament} from '../../../../shared/model/tournament';
import {ShowTeamRegistrationDialogComponent} from '../../dialogs/show-team-registration-dialog';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';

import {RegistrationPush} from '../../../../shared/dto/registration-push';

import {AddPlayerRegistrationDialogComponent} from '../../dialogs/tournament-preparation/add-player-registration-dialog';
import {TeamRegistrationChange} from '../../../../shared/dto/team-registration-change';
import {ArmyListTeamPush} from '../../../../shared/dto/team-armyList-push';


@Component({
  selector: 'tournament-team-registration-list',
  templateUrl: './tournament-team-registration-list.component.html',
  styleUrls: ['./tournament-team-registration-list.component.scss']
})
export class TournamentTeamRegistrationListComponent {

  @Input() actualTournamentTeamRegistrations$: Observable<TournamentTeam[]>;
  @Input() allRegistrations: Registration[];
  @Input() myRegistration: Registration;
  @Input() actualTournament: Tournament;
  @Input() userPlayerData: Player;
  @Input() myTeam: TournamentTeam;

  @Output() onAddTournamentRegistration = new EventEmitter<RegistrationPush>();
  @Output() onKickPlayer = new EventEmitter<Registration>();
  @Output() onAcceptTeamRegistration = new EventEmitter<TeamRegistrationPush>();
  @Output() onEraseTeamRegistration = new EventEmitter<TeamRegistrationPush>();
  @Output() onAddArmyListsForTeam = new EventEmitter<ArmyListTeamPush>();
  @Output() onTeamRegChangeEventSubscribe = new EventEmitter<TeamRegistrationChange>();

  truncateMax: number;
  smallScreen: boolean;

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

  isAdmin(): boolean {
    if (this.actualTournament && this.userPlayerData) {
      return this.actualTournament.creatorUid === this.userPlayerData.userUid;
    }
    return false;
  }

  joinTeam(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const dialogRef = this.dialog.open(AddPlayerRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        team: team,
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onAddTournamentRegistration.subscribe(registration => {

      if (registration !== undefined) {
        this.onAddTournamentRegistration.emit(registration);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });

  }

  acceptTeamRegistration(event: any, team: TournamentTeam) {

    const newTournamentTeam: TournamentTeam = {
      id: team.id,
      isRegisteredTeam: team.isRegisteredTeam,
      tournamentId: team.tournamentId,
      creatorUid: team.creatorUid,
      teamName: team.teamName,
      country: team.country,
      meta: team.meta,
      isAcceptedTournamentTeam: team.isAcceptedTournamentTeam,
      armyListsChecked: team.armyListsChecked ? team.armyListsChecked : false,
      paymentChecked: team.paymentChecked ? team.paymentChecked : false,
      playerMarkedPayment: team.playerMarkedPayment ? team.playerMarkedPayment : false,
      playerUploadedArmyLists: team.playerUploadedArmyLists ? team.playerUploadedArmyLists : false,
      creatorMail: team.creatorMail ? team.creatorMail : 'noMail',
      leaderName: team.leaderName ? team.leaderName : 'noLeader',
      tournamentPlayerIds: team.tournamentPlayerIds,
      registeredPlayerIds: team.registeredPlayerIds
    };

    event.stopPropagation();

    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === team.teamName;
    });

    this.onAcceptTeamRegistration.emit({
      tournament: this.actualTournament,
      team: newTournamentTeam,
      registrations: allPlayersForTeam
    });
  }

  eraseTeamRegistration(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === team.teamName;
    });

    this.onEraseTeamRegistration.emit({
      tournament: this.actualTournament,
      team: team,
      registrations: allPlayersForTeam
    });
  }

  showTeamDialog(team: TournamentTeam) {

    const isAdmin = this.isAdmin();

    const dialogRef = this.dialog.open(ShowTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        team: team,
        allRegistrations: this.allRegistrations,
        myTeam: this.myTeam,
        isAdmin: isAdmin
      }
    });

    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteTeam.subscribe(teamToDelete => {
      if (teamToDelete !== undefined) {
        const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
          return reg.teamName === team.teamName;
        });

        this.onEraseTeamRegistration.emit({
          tournament: this.actualTournament,
          team: teamToDelete,
          registrations: allPlayersForTeam
        });

        dialogRef.close();
      }
    });

    const teamChangeEventSubscribe = dialogRef.componentInstance.onTeamRegistrationChanged.subscribe(
      (teamRegChange: TeamRegistrationChange) => {
        if (teamRegChange) {
          this.onTeamRegChangeEventSubscribe.emit(teamRegChange);
        }
        dialogRef.close();
      });

    const kickEventSubscribe = dialogRef.componentInstance.onKickPlayer.subscribe(registration => {

      if (registration !== undefined) {
        this.onKickPlayer.emit(registration);
        dialogRef.close();
      }
    });

    const addArmyListEventSubscribe = dialogRef.componentInstance.onAddArmyLists.subscribe(registration => {

      if (registration !== undefined) {
        this.onAddArmyListsForTeam.emit({
          registration: registration,
          team: this.myTeam,
          armyList: null
        });
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      teamChangeEventSubscribe.unsubscribe();
      deleteEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      addArmyListEventSubscribe.unsubscribe();
    });

  }

  getPlayersForTeam(teamName: string): number {
    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === teamName;
    });

    return allPlayersForTeam.length;
  }

  isItMyTeam(team: TournamentTeam): boolean {
    if (!this.myTeam) {
      return false;
    }
    return team.teamName === this.myTeam.teamName;
  }

  checkTournamentFull(team: TournamentTeam) {
    const allPlayersForTeam = _.filter(this.allRegistrations, function (reg: Registration) {
      return reg.teamName === team.teamName;
    });

    return allPlayersForTeam.length >= this.actualTournament.teamSize;
  }

  addTeamArmyLists(event: any, registration: Registration) {

    event.stopPropagation();

    this.onAddArmyListsForTeam.emit({
      registration: registration,
      team: this.myTeam,
      armyList: null
    });
  }

}
