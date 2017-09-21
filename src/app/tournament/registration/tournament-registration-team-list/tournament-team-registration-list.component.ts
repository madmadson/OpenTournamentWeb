import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {Player} from '../../../../../shared/model/player';
import {MdDialog, MdPaginator, MdSnackBar, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';
import {ArmyList} from '../../../../../shared/model/armyList';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentTeam} from '../../../../../shared/model/tournament-team';
import {TournamentTeamDatabase, TournamentTeamsDataSource} from '../../../../../shared/table-model/tournamentTeam';
import {AddPlayerRegistrationDialogComponent} from '../../../dialogs/tournament-preparation/add-player-registration-dialog';
import {RegistrationPush} from '../../../../../shared/dto/registration-push';
import {ActualTournamentRegistrationService} from '../../actual-tournament-registration.service';
import {ShowTeamRegistrationDialogComponent} from '../../../dialogs/show-team-registration-dialog';
import {Registration} from '../../../../../shared/model/registration';
import {TeamRegistrationChange} from '../../../../../shared/dto/team-registration-change';
import {ActualTournamentTeamRegistrationService} from '../../actual-tournament-team-registration.service';
import {TeamRegistrationPush} from '../../../../../shared/dto/team-registration-push';

import * as _ from 'lodash';

@Component({
  selector: 'tournament-team-registration-list',
  templateUrl: './tournament-team-registration-list.component.html',
  styleUrls: ['./tournament-team-registration-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentTeamRegistrationListComponent implements OnInit, OnChanges {

  @Input() actualTournament: Tournament;
  @Input() teamRegistrations: TournamentTeam[];
  @Input() allActualRegistrations: Registration[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() armyLists: ArmyList[];
  @Input() myTeam: TournamentTeam;

  @Output() onAcceptTeamRegistration = new EventEmitter<TournamentTeam>();
  @Output() onAddArmyList = new EventEmitter<Registration>();

  displayedColumns = [
    'teamName', 'teamStatus', 'locality', 'armyList', 'paid', 'actions'];
  teamDb: TournamentTeamDatabase;
  dataSource: TournamentTeamsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  smallScreen: boolean;
  truncateMax: number;

  constructor(public dialog: MdDialog,
              private winRef: WindowRefService,
              private snackBar: MdSnackBar,
              private regService: ActualTournamentRegistrationService,
              private teamRegistrationService: ActualTournamentTeamRegistrationService) {

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
    if (this.smallScreen) {
      this.displayedColumns = [
        'teamName', 'teamStatus', 'armyList', 'paid', 'actions'];
    }
  }

  ngOnInit() {

    this.teamDb = new TournamentTeamDatabase(this.teamRegistrations);
    this.dataSource = new TournamentTeamsDataSource(this.teamDb, this.sort, this.paginator);

  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.teamDb && propName === 'teamRegistrations') {
          this.teamDb.resetDatabase(change.currentValue);
        }
      }
    }
  }

  isItMyTeam(team: TournamentTeam): boolean {
    if (!this.myTeam || !team) {
      return false;
    }
    return team.teamName === this.myTeam.teamName;
  }

  teamJoinAble(team: TournamentTeam): boolean {

    return !(this.myTeam ||
      team.registeredPlayerIds.length >= this.actualTournament.teamSize ||
      this.actualTournament.actualRound > 0);

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

    const saveEventSubscribe = dialogRef.componentInstance.onAddTournamentRegistration.subscribe((regPush: RegistrationPush) => {

      if (regPush !== undefined) {
        this.regService.pushRegistration(regPush);

        this.snackBar.open('Team: ' + regPush.registration.teamName + ' joined', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });

  }

  showTeamInfo(team: TournamentTeam) {
    const dialogRef = this.dialog.open(ShowTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        team: team,
        allRegistrations: this.allActualRegistrations,
        myTeam: this.myTeam,
        isAdmin: this.isAdmin,
        isCreator: (this.userPlayerData && team.creatorUid === this.userPlayerData.userUid)
      }
    });

    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteTeam.subscribe((teamToDelete: TeamRegistrationPush) => {
      if (teamToDelete !== undefined) {
        this.teamRegistrationService.killTeamRegistration(teamToDelete);

        this.snackBar.open('Delete team: ' + teamToDelete.team.teamName, '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });

        dialogRef.close();
      }
    });

    const teamChangeEventSubscribe = dialogRef.componentInstance.onTeamRegistrationChanged.subscribe(
      (teamRegChange: TeamRegistrationChange) => {
        this.teamRegistrationService.teamRegistrationChange(teamRegChange);

        this.snackBar.open('Successfully update Team', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
        dialogRef.close();
      });

    const kickEventSubscribe = dialogRef.componentInstance.onKickPlayer.subscribe((reg: Registration) => {

      if (reg !== undefined) {
        this.regService.killRegistration({
          registration: reg,
          tournament: this.actualTournament,
          tournamentTeam: team,
        });

        this.snackBar.open('Player kicked: ' + reg.playerName, '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
        dialogRef.close();
      }
    });

    const openArmyListForTeamMemberSubscribe = dialogRef.componentInstance.onAddArmyLists.subscribe(
      (reg: Registration) => {
        this.onAddArmyList.emit(reg);

      });

    dialogRef.afterClosed().subscribe(() => {

      teamChangeEventSubscribe.unsubscribe();
      deleteEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      openArmyListForTeamMemberSubscribe.unsubscribe();

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
      registeredPlayerIds: team.registeredPlayerIds,
      droppedInRound: 0
    };

    event.stopPropagation();

    const allPlayersForTeam = _.filter(this.allActualRegistrations, function (reg: Registration) {
      return reg.teamName === team.teamName;
    });

    this.teamRegistrationService.acceptTeamRegistration({
      tournament: this.actualTournament,
      team: newTournamentTeam,
      registrations: allPlayersForTeam
    });

    this.snackBar.open('Team added successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}
