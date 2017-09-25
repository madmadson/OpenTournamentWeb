import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {MdDialog, MdSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Tournament} from '../../../../../shared/model/tournament';
import {Player} from '../../../../../shared/model/player';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {Registration} from '../../../../../shared/model/registration';
import {ActualTournamentPlayerService} from '../../actual-tournament-player.service';
import {ActualTournamentRegistrationService} from '../../actual-tournament-registration.service';
import {TournamentService} from '../../actual-tournament.service';
import {Subscription} from 'rxjs/Subscription';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers/index';

import * as _ from 'lodash';
import {AddPlayerRegistrationDialogComponent} from 'app/dialogs/tournament-preparation/add-player-registration-dialog';
import {AddArmyListsDialogComponent} from '../../../dialogs/add-army-lists-dialog';
import {ActualTournamentArmyListService} from '../../actual-tournament-army-list.service';
import {ArmyList} from '../../../../../shared/model/armyList';
import {ArmyListRegistrationPush} from '../../../../../shared/dto/armyList-registration-push';
import {PrintArmyListsDialogComponent} from '../../../dialogs/print-army-lists-dialog';
import {TournamentFormDialogComponent} from '../../../dialogs/tournament-form-dialog';
import {PlayerRegistrationChange} from '../../../../../shared/dto/playerRegistration-change';
import {ActualTournamentTeamRegistrationService} from '../../actual-tournament-team-registration.service';
import {TournamentTeam} from '../../../../../shared/model/tournament-team';
import {ActualTournamentTeamsService} from '../../actual-tournament-teams.service';
import {CreateTeamRegistrationDialogComponent} from 'app/dialogs/team/create-team-registration-dialog';
import {ShowTeamRegistrationDialogComponent} from 'app/dialogs/show-team-registration-dialog';
import {TeamRegistrationPush} from '../../../../../shared/dto/team-registration-push';
import {TeamRegistrationChange} from '../../../../../shared/dto/team-registration-change';


@Component({
  selector: 'tournament-round-overview',
  templateUrl: './tournament-registration-overview.component.html',
  styleUrls: ['./tournament-registration-overview.component.scss']
})
export class TournamentRegistrationOverviewComponent implements OnInit, OnDestroy {

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allActualTournamentPlayers: TournamentPlayer[];
  allActualRegistrations: Registration[];

  allRegistrations$: Observable<Registration[]>;
  allTournamentPlayers$: Observable<TournamentPlayer[]>;
  allArmyLists$: Observable<ArmyList[]>;
  loadReg$: Observable<boolean>;

  allTeamRegistrations$: Observable<TournamentTeam[]>;
  allActualTeamRegistrations: TournamentTeam[];
  loadTeamReg$: Observable<boolean>;

  allTeams$: Observable<TournamentTeam[]>;
  allActualTeams: TournamentTeam[];

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;
  isRegisteredPlayer: boolean;

  myRegistration: Registration;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;

  private allActualTeamRegistrationsSub: Subscription;
  private allActualTeamsSub: Subscription;

  allTeamNames: string[] = [];

   router: Router;
   isTeamTournament: boolean;
   myTeam: TournamentTeam;
   teamICreated: TournamentTeam;

  constructor(private _router: Router,
              private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private registrationService: ActualTournamentRegistrationService,
              private teamRegistrationService: ActualTournamentTeamRegistrationService,
              private teamsService: ActualTournamentTeamsService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private armyListService: ActualTournamentArmyListService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute) {
    this.router = _router;

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebase(params['id']);
        this.registrationService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
        this.armyListService.subscribeOnFirebase(params['id']);

        this.teamRegistrationService.subscribeOnFirebase(params['id']);
        this.teamsService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allRegistrations$ = this.store.select(state => state.actualTournamentRegistrations.registrations);
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);

    this.allTeamRegistrations$ = this.store.select(state => state.actualTournamentTeamRegistrations.teamRegistrations);
    this.allTeams$ = this.store.select(state => state.actualTournamentTeams.teams);

    this.loadReg$ = this.store.select(state => state.actualTournamentRegistrations.loadRegistrations);
    this.loadTeamReg$ = this.store.select(state => state.actualTournamentTeamRegistrations.loadTeamRegistrations);
  }

  ngOnInit() {

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
      this.setIsRegistered();

      if (actualTournament) {
        this.isTeamTournament = (actualTournament.teamSize > 0);
      }

    });
    this.userPlayerDataSub = this.userPlayerData$.subscribe((player: Player) => {
      this.userPlayerData = player;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
      this.setIsRegistered();
      this.setMyTeamAndTeamCreator();
    });

    this.allActualTournamentPlayersSub = this.allTournamentPlayers$.subscribe((allTournamentPlayers: TournamentPlayer[]) => {
      this.allActualTournamentPlayers = allTournamentPlayers;
      this.setIsTournamentPlayer();
    });

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allRegistrations: Registration[]) => {
      this.allActualRegistrations = allRegistrations;
      this.setIsRegistered();
    });

    this.allActualTeamRegistrationsSub = this.allTeamRegistrations$.subscribe((allTeamRegistrations: TournamentTeam[]) => {
      this.allActualTeamRegistrations = allTeamRegistrations;
      this.setMyTeamAndTeamCreator();
    });

    this.allActualTeamsSub = this.allTeams$.subscribe((teams: TournamentTeam[]) => {
      this.allActualTeams = teams;

    });
  }


  ngOnDestroy() {
    this.tournamentService.unsubscribeOnFirebase();
    this.registrationService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualRegistrationsSub.unsubscribe();

    this.teamRegistrationService.unsubscribeOnFirebase();
    this.teamsService.unsubscribeOnFirebase();
    this.allActualTeamRegistrationsSub.unsubscribe();
    this.allActualTeamsSub.unsubscribe();
  }

  getArrayForNumber(round: number): number[] {

    return round ? _.range(1, (round + 1)) : [];
  };

  setIsAdmin(): void {
    if (this.actualTournament && this.userPlayerData) {
      this.isAdmin = this.userPlayerData.userUid === this.actualTournament.creatorUid;
    } else {
      this.isAdmin = false;
    }
  }

  setIsCoAdmin(): void {

    const that = this;

    if (this.actualTournament && this.userPlayerData) {

      this.isCoOrganizer = false;
      _.findIndex(this.actualTournament.coOrganizators, function (coOrganizerEmail: string) {

        if (that.userPlayerData.userEmail === coOrganizerEmail) {
          that.isCoOrganizer = true;
        }
      });
    }
  }

  setIsTournamentPlayer(): void {
    const that = this;

    if (this.allActualTournamentPlayers && this.userPlayerData) {

      this.isTournamentPlayer = false;

      _.forEach(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
        if (that.userPlayerData && that.userPlayerData.id === player.playerId) {
          that.isTournamentPlayer = true;
        }
      });
    }
  }

  setIsRegistered(): void {
    const that = this;

    if (this.allActualRegistrations && this.userPlayerData) {

      this.myRegistration = undefined;
      this.isRegisteredPlayer = false;

      _.forEach(this.allActualRegistrations, function (reg: Registration) {

        if (that.allTeamNames.indexOf(reg.teamName) === -1 && reg.teamName !== '') {
          that.allTeamNames.push(reg.teamName);
        }

        if (that.userPlayerData && that.userPlayerData.id === reg.playerId) {
          that.isRegisteredPlayer = true;
          that.myRegistration = reg;
        }
      });
    }
  }

  setMyTeamAndTeamCreator() {

    const that = this;

    if (this.allActualTeamRegistrations && this.userPlayerData) {

      this.myTeam = undefined;
      this.teamICreated = undefined;

      _.forEach(this.allActualTeamRegistrations, function (team: TournamentTeam) {
        if (that.userPlayerData && team.registeredPlayerIds) {
          if (team.registeredPlayerIds.indexOf(that.userPlayerData.id) !== -1) {
            that.myTeam = team;
          }
          if (team.creatorUid === that.userPlayerData.userUid) {
            that.teamICreated = team;
          }
        }
      });
    }

  }

  openCreatePlayerRegistrationDialog() {
    const dialogRef = this.dialog.open(AddPlayerRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        allTeamNames: this.allTeamNames
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onAddTournamentRegistration.subscribe(registrationPush => {

      if (registrationPush !== undefined) {
        this.registrationService.pushRegistration(registrationPush);

        this.snackBar.open('Registration saved successfully', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openAddArmyListForRegistrationDialog(reg: Registration) {

    console.log('test');

    const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
      data: {
        registration: reg,
        armyLists$: this.allArmyLists$
      },
      disableClose: true
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForRegistration.subscribe(
      (armyListRegistrationPush: ArmyListRegistrationPush) => {

        if (armyListRegistrationPush !== undefined) {
          this.armyListService.pushArmyListForRegistration(armyListRegistrationPush);

          if (this.isTeamTournament && this.myTeam) {
            this.armyListService.setTeamArmyListStatus(this.myTeam);
          }
        }
      });
    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

      if (armyList !== undefined) {
        this.armyListService.killArmyList(armyList);
        if (this.isTeamTournament && this.myTeam) {
          this.armyListService.setTeamArmyListStatus(this.myTeam);
        }
      }
    });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      deleteEventSubscribe.unsubscribe();
    });
  }

  openPrintArmyListDialog() {
    this.dialog.open(PrintArmyListsDialogComponent, {
      data: {
        tournament: this.actualTournament,
        armyLists$: this.allArmyLists$
      }
    });

  }

  deleteMyRegistration() {

    this.registrationService.killRegistration({
      registration: this.myRegistration,
      tournament: this.actualTournament,
      tournamentTeam: this.isTeamTournament ? this.myTeam : undefined,
    });
  }

  handleAcceptRegistration(registration: Registration) {
    this.registrationService.acceptRegistration(registration);

    this.snackBar.open('Registration successfully accepted', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleChangeRegistration(registrationChange: PlayerRegistrationChange) {
    this.registrationService.changeRegistration(registrationChange);

    this.snackBar.open('Registration successfully updated', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleDeleteRegistration(registration: Registration) {
    this.registrationService.killRegistration({
      tournament: this.actualTournament,
      registration: registration
    });

    this.snackBar.open('Registration killed successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  openTournamentFormDialog() {

    if (!this.actualTournament.creatorMail) {
      this.actualTournament.creatorMail = '';
    }

    const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
      data: {
        tournament: this.actualTournament,
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        allRegistrations: this.allActualRegistrations,
        tournamentTeams: [],
        tournamentTeamRegistrations: []
      },
      width: '800px'
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveTournament.subscribe(tournament => {
      if (tournament) {
        this.tournamentService.updateTournament(tournament);
      }
      dialogRef.close();
    });
    const saveCoOperatorSubscribe = dialogRef.componentInstance.onAddCoOrganizator
      .subscribe(coOrganizatorPush => {
        if (coOrganizatorPush) {

          this.tournamentService.addCoOrganizer(coOrganizatorPush);
        }
      });

    const deleteCoOperatorSubscribe = dialogRef.componentInstance.onDeleteCoOrganizator
      .subscribe(coOrganizatorPush => {
        if (coOrganizatorPush) {

          this.tournamentService.deleteCoOrganizer(coOrganizatorPush);
        }
      });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      saveCoOperatorSubscribe.unsubscribe();
      deleteCoOperatorSubscribe.unsubscribe();
    });
  }

  openCreateTeamRegistrationDialog() {
    const dialogRef = this.dialog.open(CreateTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        tournamentTeamRegistrations: this.allActualTeamRegistrations,
        tournamentTeams: this.allActualTeams
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onCreateTeamRegistration.subscribe((teamRegPush: TeamRegistrationPush) => {

      if (teamRegPush !== undefined) {
        this.teamRegistrationService.pushTeamRegistration(teamRegPush);

        this.snackBar.open('Create new team: ' + teamRegPush.team.teamName, '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });

      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openShowMyTeamDialog() {

    const dialogRef = this.dialog.open(ShowTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        team: this.teamICreated,
        allRegistrations: this.allActualRegistrations,
        userPlayerData: this.userPlayerData,
        myTeam: this.myTeam,
        isAdmin: this.isAdmin,
        isCreator: true,
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

    const kickEventSubscribe = dialogRef.componentInstance.onKickPlayer.subscribe((reg: Registration) => {

      if (reg !== undefined) {

        this.registrationService.killRegistration({
          registration: reg,
          tournament: this.actualTournament,
          tournamentTeam: this.isTeamTournament ? this.myTeam : undefined,
        });

        this.snackBar.open('Player kicked: ' + reg.playerName, '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });

        dialogRef.close();
      }
    });

    const openArmyListDialogEventSubscribe = dialogRef.componentInstance.onAddArmyLists.subscribe(registration => {

      if (registration !== undefined) {
        this.openAddArmyListForRegistrationDialog(registration);
      }
    });

    const teamChangeEventSubscribe = dialogRef.componentInstance.onTeamRegistrationChanged.subscribe(
      (teamRegChange: TeamRegistrationChange) => {
        if (teamRegChange) {
          this.teamRegistrationService.teamRegistrationChange(teamRegChange);

          this.snackBar.open('Successfully update Team', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });
        }
        dialogRef.close();

      });

    dialogRef.afterClosed().subscribe(() => {

      deleteEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      openArmyListDialogEventSubscribe.unsubscribe();
      teamChangeEventSubscribe.unsubscribe();
    });

  }
}



