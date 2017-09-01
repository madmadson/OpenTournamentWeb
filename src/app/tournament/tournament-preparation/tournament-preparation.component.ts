import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';

import {Player} from '../../../../shared/model/player';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import {Registration} from '../../../../shared/model/registration';

import * as _ from 'lodash';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {ArmyList} from '../../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';


import {getAllCountries} from '../../../../shared/model/countries';

import {Tournament} from '../../../../shared/model/tournament';

import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';

import {TournamentFormDialogComponent} from '../../dialogs/tournament-form-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {ShowTeamRegistrationDialogComponent} from '../../dialogs/show-team-registration-dialog';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';
import {TournamentTeamEraseModel} from '../../../../shared/dto/tournament-team-erase';
import {NewTournamentPlayerDialogComponent} from '../../dialogs/add-tournament-player-dialog';
import {PrintArmyListsDialogComponent} from '../../dialogs/print-army-lists-dialog';
import {AddArmyListsDialogComponent} from '../../dialogs/add-army-lists-dialog';
import {RegistrationPush} from '../../../../shared/dto/registration-push';
import {AddPlayerRegistrationDialogComponent} from '../../dialogs/tournament-preparation/add-player-registration-dialog';
import {PlayerRegistrationChange} from '../../../../shared/dto/playerRegistration-change';
import {ArmyListRegistrationPush} from '../../../../shared/dto/armyList-registration-push';
import {ArmyListTournamentPlayerPush} from '../../../../shared/dto/armyList-tournamentPlayer-push';
import {TeamRegistrationChange} from '../../../../shared/dto/team-registration-change';
import {ArmyListTeamPush} from '../../../../shared/dto/team-armyList-push';
import {CoOrganizatorPush} from '../../../../shared/dto/co-organizator-push';
import {TeamUpdate} from '../../../../shared/dto/team-update';
import {StartTournamentDialogComponent} from "../../dialogs/actualTournament/start-tournament-dialog";

@Component({
  selector: 'tournament-preparation',
  templateUrl: './tournament-preparation.component.html',
  styleUrls: ['./tournament-preparation.component.scss']
})
export class TournamentPreparationComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() userPlayerData: Player;

  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() actualTournamentRegisteredPlayers$: Observable<Registration[]>;
  @Input() allActualTournamentPlayers$: Observable<TournamentPlayer[]>;
  @Input() actualTournamentTeams$: Observable<TournamentTeam[]>;
  @Input() actualTournamentTeamRegistrations$: Observable<TournamentTeam[]>;

  @Output() onStartTournament = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onStartTeamTournament = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onSaveTournament = new EventEmitter<Tournament>();

  @Output() onAddTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  @Output() onAddTournamentRegistration = new EventEmitter<RegistrationPush>();
  @Output() onAddArmyListForRegistration = new EventEmitter<ArmyListRegistrationPush>();
  @Output() onAddArmyListForTournamentPlayer = new EventEmitter<ArmyListTournamentPlayerPush>();
  @Output() onAddArmyListForTeamRegistration = new EventEmitter<ArmyListTeamPush>();
  @Output() onAddArmyListForTeamTournamentPlayer = new EventEmitter<ArmyListTeamPush>();
  @Output() onCreateTeamForTeamTournament = new EventEmitter<TournamentTeam>();
  @Output() onRegisterTeamForTeamTournament = new EventEmitter<TournamentTeam>();
  @Output() onAcceptTeamRegistration = new EventEmitter<TeamRegistrationPush>();
  @Output() onEraseTeamRegistration = new EventEmitter<TeamRegistrationPush>();

  @Output() onDeleteTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onDeleteRegistration = new EventEmitter<RegistrationPush>();
  @Output() onDeleteArmyList = new EventEmitter<ArmyList>();
  @Output() onEraseTournamentTeam = new EventEmitter<TournamentTeamEraseModel>();
  @Output() onPlayerRegChangeEventSubscribe = new EventEmitter<PlayerRegistrationChange>();
  @Output() onTeamChangeEventSubscribe = new EventEmitter<TeamRegistrationChange>();

  @Output() onAddCoOrganizator = new EventEmitter<CoOrganizatorPush>();
  @Output() onDeleteCoOrganizator = new EventEmitter<CoOrganizatorPush>();

  @Output() onUpdateTeam = new EventEmitter<TeamUpdate>();

  allRegistrations: Registration[];
  myRegistration: Registration;
  teamCreator: TournamentTeam;
  myTeam: TournamentTeam;

  allActualTournamentPlayers: TournamentPlayer[];
  filteredActualTournamentPlayers: TournamentPlayer[];
  loggedIn: boolean;
  currentUserId: string;

  suggestedRoundsToPlay: number;

  tournamentTeamRegistrations: number;
  tournamentTeams: number;
  actualTournamentTeams: TournamentTeam[];

  armyLists$: Observable<ArmyList[]>;

  constructor(public dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    const that = this;

    this.armyLists$ = this.actualTournamentArmyList$;


    this.actualTournamentRegisteredPlayers$.subscribe(allRegistrations => {
      this.allRegistrations = allRegistrations;
      this.myRegistration = _.find(allRegistrations,
        function (reg) {
          if (that.userPlayerData !== undefined) {
            return reg.playerId === that.userPlayerData.id;
          }
        });
    });
    this.actualTournamentTeamRegistrations$.subscribe(teams => {
      this.teamCreator = _.find(teams, function (team) {
        if (that.userPlayerData !== undefined) {
          return team.creatorUid === that.userPlayerData.userUid;
        }
      });
      this.myTeam = _.find(teams, function (team) {
        if (that.userPlayerData && team.registeredPlayerIds) {
          if (team.registeredPlayerIds.indexOf(that.userPlayerData.id) !== -1) {
            return team;
          }
        }
      });
      this.tournamentTeamRegistrations = teams.length;
    });

    this.actualTournamentTeams$.subscribe(teams => {

      this.actualTournamentTeams = teams;
      this.tournamentTeams = teams.length;
    });


    this.allActualTournamentPlayers$.subscribe(players => {
      this.allActualTournamentPlayers = players;

      this.filteredActualTournamentPlayers = players;
    });
  }

  filter(searchString: string) {

    if (searchString === '') {
      this.filteredActualTournamentPlayers = this.allActualTournamentPlayers;
    }

    this.filteredActualTournamentPlayers = _.filter(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.playerName.toLocaleLowerCase().includes(searchString.toLowerCase());
    });

  }


  openStartTournamentDialog() {


    const dialogRef = this.dialog.open(StartTournamentDialogComponent, {
      data: {
        allActualTournamentPlayers$: this.allActualTournamentPlayers$,
        allActualTournamentTeams$: this.actualTournamentTeams$,
        actualTournament: this.actualTournament,
      },
      width: '600px',
    });
    const startTournamentSub = dialogRef.componentInstance.onStartTournament.subscribe(config => {
      if (config !== undefined) {
        config.tournamentId = this.actualTournament.id;
        config.round = 1;
        if (this.actualTournament.teamSize === 0) {
          this.onStartTournament.emit(config);
        } else {
          this.onStartTeamTournament.emit(config);
        }
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      startTournamentSub.unsubscribe();
    });

  }

  addTournamentPlayer() {
    const dialogRef = this.dialog.open(NewTournamentPlayerDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        allActualTournamentPlayers: this.allActualTournamentPlayers
      },
      width: '800px',
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveNewTournamentPlayer.subscribe((tournamentPlayer: TournamentPlayer) => {

      if (tournamentPlayer !== undefined) {
        this.onAddTournamentPlayer.emit(tournamentPlayer);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  acceptRegistration(registration: Registration) {
    if (registration !== undefined) {
      const alreadyRegistered = _.find(this.allActualTournamentPlayers, function (tournamentPlayer: TournamentPlayer) {
        return tournamentPlayer.playerId === registration.playerId;
      });
      if (alreadyRegistered) {
        this.snackBar.open('Player already in Tournament', '', {
          duration: 5000
        });
      } else {
        this.onAcceptRegistration.emit(registration);
      }
    }
  }

  openTournamentFormDialog() {

    if (!this.actualTournament.creatorMail) {
      this.actualTournament.creatorMail = '';
    }

    const dialogRef = this.dialog.open(TournamentFormDialogComponent, {
      data: {
        tournament: this.actualTournament,
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        allRegistrations: this.allRegistrations,
        tournamentTeams: this.tournamentTeams,
        tournamentTeamRegistrations: this.tournamentTeamRegistrations
      },
      width: '800px'
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveTournament.subscribe(tournament => {
      if (tournament) {
        this.onSaveTournament.emit(tournament);
      }
      dialogRef.close();
    });
    const saveCoOperatorSubscribe = dialogRef.componentInstance.onAddCoOrganizator
      .subscribe(coOrganizatorPush => {
        if (coOrganizatorPush) {
          this.onAddCoOrganizator.emit(coOrganizatorPush);
        }
      });

    const deleteCoOperatorSubscribe = dialogRef.componentInstance.onDeleteCoOrganizator
      .subscribe(coOrganizatorPush => {
        if (coOrganizatorPush) {
          this.onDeleteCoOrganizator.emit(coOrganizatorPush);
        }
      });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      saveCoOperatorSubscribe.unsubscribe();
      deleteCoOperatorSubscribe.unsubscribe();
    });
  }

  openPrintArmyListDialog() {
    this.dialog.open(PrintArmyListsDialogComponent, {
      data: {
        tournament: this.actualTournament,
        armyLists$: this.armyLists$
      }
    });

  }

  openRegistrationDialog() {
    const dialogRef = this.dialog.open(AddPlayerRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onAddTournamentRegistration.subscribe(registrationPush => {

      if (registrationPush !== undefined) {
        this.onAddTournamentRegistration.emit({
          registration: registrationPush.registration,
          tournament: this.actualTournament,
        });
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openCreateTeamDialog() {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        tournamentTeamRegistrations$: this.actualTournamentTeamRegistrations$,
        tournamentTeams$: this.actualTournamentTeams$
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onCreateTeamForTeamTournament.subscribe(team => {

      if (team !== undefined) {
        this.onCreateTeamForTeamTournament.emit(team);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openRegisterTeamDialog() {
    const dialogRef = this.dialog.open(RegisterTeamDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        tournamentTeamRegistrations$: this.actualTournamentTeamRegistrations$,
        tournamentTeams$: this.actualTournamentTeams$
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onRegisterTeamForTeamTournament.subscribe(team => {

      if (team !== undefined) {
        this.onRegisterTeamForTeamTournament.emit(team);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openShowTeamDialog() {

    const dialogRef = this.dialog.open(ShowTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        team: this.teamCreator,
        allRegistrations: this.allRegistrations,
        userPlayerData: this.userPlayerData,
        myTeam: this.myTeam,
        isAdmin: this.isAdmin
      }
    });

    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteTeam.subscribe(teamToDelete => {

      if (teamToDelete !== undefined) {
        this.onEraseTeamRegistration.emit(teamToDelete);
        dialogRef.close();
      }
    });

    const kickEventSubscribe = dialogRef.componentInstance.onKickPlayer.subscribe(registration => {

      if (registration !== undefined) {
        this.onDeleteRegistration.emit({
          registration: registration,
          tournament: this.actualTournament,
          tournamentTeam: this.myTeam
        });
        dialogRef.close();
      }
    });

    const openArmyListDialogEventSubscribe = dialogRef.componentInstance.onAddArmyLists.subscribe(registration => {

      if (registration !== undefined) {
        this.openAddArmyListForRegistrationDialog(registration);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      deleteEventSubscribe.unsubscribe();
      kickEventSubscribe.unsubscribe();
      openArmyListDialogEventSubscribe.unsubscribe();
    });

  }


  deleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    if (tournamentPlayer !== undefined) {
      this.onDeleteTournamentPlayer.emit(tournamentPlayer);
    }
  }

  deleteMyRegistration(registration: Registration) {
    if (registration !== undefined) {

      this.onDeleteRegistration.emit({
        registration: registration,
        tournamentTeam: this.myTeam,
        tournament: this.actualTournament
      });
    }
  }

  handleUpdateTeam(team: TeamUpdate) {
    this.onUpdateTeam.emit(team);
  }

  addArmyListForTournamentPlayer(tournamentPlayer: TournamentPlayer) {

    if (tournamentPlayer !== undefined) {

      const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
        data: {
          tournamentPlayer: tournamentPlayer,
          armyLists: this.actualTournamentArmyList$
        }
      });
      const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForTournamentPlayer.subscribe(armyList => {

        if (armyList !== undefined) {
          this.onAddArmyListForTournamentPlayer.emit(armyList);
        }
      });
      const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.onDeleteArmyList.emit(armyList);
        }
      });

      dialogRef.afterClosed().subscribe(() => {

        saveEventSubscribe.unsubscribe();
        deleteEventSubscribe.unsubscribe();
      });
    }
  }


  openAddArmyListForRegistrationDialog(registration: Registration) {
    if (registration !== undefined) {

      const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
        data: {
          registration: registration,
          armyLists: this.actualTournamentArmyList$
        }
      });
      const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForRegistration.subscribe(
        armyListRegistrationPush => {

          if (armyListRegistrationPush !== undefined) {
            this.onAddArmyListForRegistration.emit(armyListRegistrationPush);
          }
        });
      const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.onDeleteArmyList.emit(armyList);
        }
      });

      dialogRef.afterClosed().subscribe(() => {

        saveEventSubscribe.unsubscribe();
        deleteEventSubscribe.unsubscribe();
      });
    }
  }

  openAddArmyListForRegistrationDialogForTeam(teamArmyList: ArmyListTeamPush) {
    if (teamArmyList.registration !== undefined) {

      const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
        data: {
          registration: teamArmyList.registration,
          armyLists: this.actualTournamentArmyList$
        }
      });
      const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForRegistration.subscribe(
        (armyListRegistrationPush: ArmyListRegistrationPush) => {

          if (armyListRegistrationPush !== undefined) {

            const armyListForTeamRegistrationPush: ArmyListTeamPush = {
              armyList: armyListRegistrationPush.armyList,
              team: teamArmyList.team,
              registration: teamArmyList.registration
            };

            console.log('armyListForTeamRegistrationPush: ' + JSON.stringify(armyListForTeamRegistrationPush));

            this.onAddArmyListForTeamRegistration.emit(
              armyListForTeamRegistrationPush
            );
          }
        });
      const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.onDeleteArmyList.emit(armyList);
        }
      });

      dialogRef.afterClosed().subscribe(() => {

        saveEventSubscribe.unsubscribe();
        deleteEventSubscribe.unsubscribe();
      });
    }
  }

  openAddArmyListForTournamentPlayerDialogForTeam(teamArmyList: ArmyListTeamPush) {
    if (teamArmyList.registration !== undefined) {

      const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
        data: {
          registration: teamArmyList.registration,
          armyLists: this.actualTournamentArmyList$
        }
      });
      const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForRegistration.subscribe(
        (armyListRegistrationPush: ArmyListRegistrationPush) => {

          if (armyListRegistrationPush !== undefined) {
            this.onAddArmyListForTeamRegistration.emit({
              armyList: armyListRegistrationPush.armyList,
              team: teamArmyList.team,
              registration: teamArmyList.registration
            });
          }
        });
      const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.onDeleteArmyList.emit(armyList);
        }
      });

      dialogRef.afterClosed().subscribe(() => {

        saveEventSubscribe.unsubscribe();
        deleteEventSubscribe.unsubscribe();
      });
    }
  }

  handlePlayerRegChange(regChange: PlayerRegistrationChange) {
    this.onPlayerRegChangeEventSubscribe.emit(regChange);
  }

  handleTeamRegChange(regChange: TeamRegistrationChange) {
    this.onTeamChangeEventSubscribe.emit(regChange);
  }

  alreadyInTournament(): TournamentPlayer {

    const that = this;

    return _.find(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      return player.playerId === that.userPlayerData.id;
    });

  }

  handleAddTournamentRegistration(registrationPush: RegistrationPush) {

    this.onAddTournamentRegistration.emit(registrationPush);
  }

  handleKickTournamentPlayer(tournamentPlayer: TournamentPlayer) {

    this.onDeleteTournamentPlayer.emit(tournamentPlayer);
  }

  handleAcceptTeamRegistration(teamRegPush: TeamRegistrationPush) {
    this.onAcceptTeamRegistration.emit(teamRegPush);
  }

  handleEraseTeamRegistration(teamRegPush: TeamRegistrationPush) {
    this.onEraseTeamRegistration.emit(teamRegPush);
  }

  handleEraseTournamentTeam(eraseModel: TournamentTeamEraseModel) {
    this.onEraseTournamentTeam.emit(eraseModel);
  }

  handleAddTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.onAddTournamentPlayer.emit(tournamentPlayer);
  }
}


@Component({
  selector: 'create-team-dialog',
  templateUrl: './create-team-dialog.html'
})
export class CreateTeamDialogComponent implements OnInit {

  @Output() onCreateTeamForTeamTournament = new EventEmitter<TournamentTeam>();

  userPlayerData: Player;
  actualTournament: Tournament;
  countries: string[];
  tournamentTeams: TournamentTeam[];
  tournamentTeamRegistrations: TournamentTeam[];

  createTournamentForm: FormGroup;

  teamNameAlreadyInUse: boolean;
  byeNotAllowed: boolean;

  constructor(public dialogRef: MdDialogRef<CreateTeamDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {

    this.countries = getAllCountries();
    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;

    this.actualTournament = data.actualTournament;
    data.tournamentTeamRegistrations$.subscribe((teamRegs: TournamentTeam[]) => {
      this.tournamentTeamRegistrations = teamRegs;
    });
    data.tournamentTeams$.subscribe((teams: TournamentTeam[]) => {
      this.tournamentTeams = teams;
    });
  }

  ngOnInit(): void {

    this.createTournamentForm = this.formBuilder.group({
      teamName: ['', [Validators.required]],
      meta: [this.userPlayerData.meta],
      country: [''],
    });
  }

  onSaveTeam() {
    const team = this.prepareTeam();

    this.onCreateTeamForTeamTournament.emit(team);
    this.dialogRef.close();
  }

  prepareTeam(): TournamentTeam {
    const formModel = this.createTournamentForm.value;

    return {
      isRegisteredTeam: false,
      tournamentId: this.actualTournament.id,
      creatorUid: this.userPlayerData.userUid,
      teamName: formModel.teamName,
      country: formModel.country,
      meta: formModel.meta,
      isAcceptedTournamentTeam: false,
      tournamentPlayerIds: [],
      registeredPlayerIds: [],
      creatorMail: '',
      leaderName: 'Created by Orga',
      armyListsChecked: false,
      paymentChecked: false,
      playerMarkedPayment: false,
      playerUploadedArmyLists: false,
      droppedInRound: 0
    };
  }

  checkTeamName() {

    const that = this;
    that.teamNameAlreadyInUse = false;

    that.byeNotAllowed = that.createTournamentForm.get('teamName').value.toLowerCase() === 'bye';

    _.each(this.tournamentTeams, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.createTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

    _.each(this.tournamentTeamRegistrations, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.createTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

  }
}

@Component({
  selector: 'register-team-dialog',
  templateUrl: './register-team-dialog.html'
})
export class RegisterTeamDialogComponent implements OnInit {

  @Output() onRegisterTeamForTeamTournament = new EventEmitter<TournamentTeam>();

  userPlayerData: Player;
  actualTournament: Tournament;
  countries: string[];
  tournamentTeams: TournamentTeam[];
  tournamentTeamRegistrations: TournamentTeam[];

  registerTournamentForm: FormGroup;

  teamNameAlreadyInUse: boolean;
  byeNotAllowed: boolean;

  constructor(public dialogRef: MdDialogRef<RegisterTeamDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {

    this.countries = getAllCountries();
    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;
    data.tournamentTeamRegistrations$.subscribe((teamRegs: TournamentTeam[]) => {
      this.tournamentTeamRegistrations = teamRegs;
    });
    data.tournamentTeams$.subscribe((teams: TournamentTeam[]) => {
      this.tournamentTeams = teams;
    });
  }

  ngOnInit(): void {

    this.registerTournamentForm = this.formBuilder.group({
      teamName: ['', [Validators.required]],
      meta: [this.userPlayerData.meta],
      country: [''],
    });
  }

  onRegisterTeam() {
    const team = this.prepareTeam();

    this.onRegisterTeamForTeamTournament.emit(team);
    this.dialogRef.close();
  }

  prepareTeam(): TournamentTeam {
    const formModel = this.registerTournamentForm.value;

    return {
      isRegisteredTeam: true,
      tournamentId: this.actualTournament.id,
      creatorUid: this.userPlayerData.userUid,
      teamName: formModel.teamName,
      country: formModel.country,
      meta: formModel.meta,
      isAcceptedTournamentTeam: false,
      tournamentPlayerIds: [],
      registeredPlayerIds: [],
      creatorMail: this.userPlayerData.userEmail,
      leaderName: this.userPlayerData.nickName,
      armyListsChecked: false,
      paymentChecked: false,
      playerMarkedPayment: false,
      playerUploadedArmyLists: false,
      droppedInRound: 0
    };
  }

  checkTeamName() {

    const that = this;
    that.teamNameAlreadyInUse = false;

    that.byeNotAllowed = that.registerTournamentForm.get('teamName').value.toLowerCase() === 'bye';

    _.each(this.tournamentTeams, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.registerTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

    _.each(this.tournamentTeamRegistrations, function (team: TournamentTeam) {
      if (team.teamName.toLowerCase() === that.registerTournamentForm.get('teamName').value.toLowerCase()) {
        that.teamNameAlreadyInUse = true;
      }
    });

  }
}


