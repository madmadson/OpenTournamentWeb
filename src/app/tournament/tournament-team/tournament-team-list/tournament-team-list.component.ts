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

import {MdDialog, MdPaginator, MdSort} from '@angular/material';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {
  TournamentPlayerDatabase,
  TournamentPlayersDataSource
} from '../../../../../shared/table-model/tournamentPlayer';
import {Tournament} from '../../../../../shared/model/tournament';
import {Player} from '../../../../../shared/model/player';

import * as _ from 'lodash';
import {TournamentTeam} from "../../../../../shared/model/tournament-team";
import {TournamentTeamDatabase, TournamentTeamsDataSource} from "../../../../../shared/table-model/tournamentTeam";
import {ShowTeamDialogComponent} from "../../../dialogs/show-team-dialog";
import {TeamUpdate} from "../../../../../shared/dto/team-update";

@Component({
  selector: 'tournament-team-list',
  templateUrl: './tournament-team-list.component.html',
  styleUrls: ['./tournament-team-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentTeamListComponent implements OnInit, OnChanges  {

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
    'teamName', 'locality', 'actions'];
  teamDb: TournamentTeamDatabase;
  dataSource: TournamentTeamsDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  smallScreen: boolean;
  truncateMax: number;

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

    if (this.smallScreen) {
      this.displayedColumns = [
        'teamName', 'actions'];
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
      }
    });

    const updateTeamEventSubscribe = dialogRef.componentInstance.onUpdateTeam.subscribe((updatedTeam: TeamUpdate) => {

      if (updatedTeam !== undefined) {

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

      }
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      updateTeamEventSubscribe.unsubscribe();
    });
  }

}
