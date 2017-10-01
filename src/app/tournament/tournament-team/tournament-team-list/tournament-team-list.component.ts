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
import {WindowRefService} from '../../../service/window-ref-service';
import {ArmyList} from '../../../../../shared/model/armyList';

import {MdDialog, MdPaginator, MdSnackBar, MdSort} from '@angular/material';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {Tournament} from '../../../../../shared/model/tournament';
import {Player} from '../../../../../shared/model/player';

import * as _ from 'lodash';
import {TournamentTeam} from '../../../../../shared/model/tournament-team';
import {TournamentTeamDatabase, TournamentTeamsDataSource} from '../../../../../shared/table-model/tournamentTeam';
import {ShowTeamDialogComponent} from '../../../dialogs/show-team-dialog';
import {TeamUpdate} from '../../../../../shared/dto/team-update';
import {ActualTournamentTeamsService} from '../../actual-tournament-teams.service';
import {TournamentPlayersService} from 'app/tournament/actual-tournament-players.service';
import {NewTournamentPlayerDialogComponent} from '../../../dialogs/add-tournament-player-dialog';
import {ShowArmyListDialogComponent} from 'app/dialogs/show-army-lists-dialog';

@Component({
  selector: 'tournament-team-list',
  templateUrl: './tournament-team-list.component.html',
  styleUrls: ['./tournament-team-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentTeamListComponent implements OnInit, OnChanges {

  @Input() actualTournament: Tournament;
  @Input() tournamentTeams: TournamentTeam[];
  @Input() allActualTournamentPlayers: TournamentPlayer[];
  @Input() userPlayerData: Player;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() armyLists: ArmyList[];

  @Output() onDeleteTeam = new EventEmitter<TournamentTeam>();
  @Output() onAddArmyLists = new EventEmitter<TournamentTeam>();

  displayedColumns = [
    'teamName', 'teamStatus', 'locality', 'actions'];
  teamDb: TournamentTeamDatabase;
  dataSource: TournamentTeamsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  smallScreen: boolean;
  truncateMax: number;

  teamDeleteRequested: string;

  constructor(private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private winRef: WindowRefService,
              private tournamentTeamService: ActualTournamentTeamsService,
              private tournamentPlayerService: TournamentPlayersService) {

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

    if (this.smallScreen) {
      this.displayedColumns = [
        'teamName', 'teamStatus', 'actions'];
    }
  }

  ngOnInit() {


    this.teamDb = new TournamentTeamDatabase(this.tournamentTeams);
    this.dataSource = new TournamentTeamsDataSource(this.teamDb, this.sort, this.paginator);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.teamDb && propName === 'tournamentTeams') {
          this.teamDb.resetDatabase(change.currentValue);
        }
      }
    }
  }

  showTeamArmyLists(event: any, team: TournamentTeam) {

    event.stopPropagation();

    const teamArmyLists: ArmyList[] = this.getArmyListsForTeam(team);

    this.dialog.open(ShowArmyListDialogComponent, {
      data: {
        tournamentTeam: team,
        armyLists: teamArmyLists
      }
    });
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
        tournamentTeams: this.tournamentTeams,
        teamArmyLists: this.getArmyListsForTeam(team)
      }
    });

    const updateTeamEventSubscribe = dialogRef.componentInstance.onUpdateTeam.subscribe((updatedTeam: TeamUpdate) => {

      if (updatedTeam !== undefined) {

        this.tournamentTeamService.updateTeam(updatedTeam);

        this.snackBar.open('Team successfully updated', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
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
        this.tournamentPlayerService.killPlayer(tournamentPlayer);


        this.snackBar.open('Player deleted successfully', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      }
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      updateTeamEventSubscribe.unsubscribe();
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
    const saveEventSubscribe = dialogRef.componentInstance.onSaveNewTournamentPlayer.subscribe((tournamentPlayer: TournamentPlayer) => {

      if (tournamentPlayer !== undefined) {
        this.tournamentPlayerService.pushTournamentPlayer(tournamentPlayer);

        this.snackBar.open('Player saved successfully', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  teamDeleteRequestedClicked(event: any, team: TournamentTeam) {
    event.stopPropagation();

    this.teamDeleteRequested = team.teamName;
  }

  teamDeleteDeclinedClicked(event: any) {
    event.stopPropagation();

    this.teamDeleteRequested = '';
  }

  checkTournamentFull(team: TournamentTeam) {

    if (!this.actualTournament) {
      return false;
    }

    const allPlayersForTeam = this.getPlayersForTeam(team);

    return allPlayersForTeam.length === this.actualTournament.teamSize;
  }

  checkTournamentOver(team: TournamentTeam) {
    const allPlayersForTeam = this.getPlayersForTeam(team);

    return allPlayersForTeam.length > this.actualTournament.teamSize;
  }

  killTeam(event: any, team: TournamentTeam) {

    event.stopPropagation();

    this.teamDeleteRequested = '';

    const allPlayersForTeam = this.getPlayersForTeam(team);

    this.tournamentTeamService.killTournamentTeam({
      team: team,
      tournament: this.actualTournament,
      players: allPlayersForTeam
    });

    this.snackBar.open('Tournament Team deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  getArmyListsForTeam(team: TournamentTeam) {

    return _.filter(this.armyLists, function (list: ArmyList) {
      return (list.teamName === team.teamName);
    });
  }

  getPlayersForTeam(team: TournamentTeam) {

    return _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.teamName === team.teamName;
    });
  }
}
