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
import {AuthenticationStoreState} from '../../store/authentication-state';
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

@Component({
  selector: 'tournament-preparation',
  templateUrl: './tournament-preparation.component.html',
  styleUrls: ['./tournament-preparation.component.scss']
})
export class TournamentPreparationComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() actualTournamentRegisteredPlayers$: Observable<Registration[]>;
  @Input() allActualTournamentPlayers$: Observable<TournamentPlayer[]>;
  @Input() actualTournamentTeams$: Observable<TournamentTeam[]>;
  @Input() actualTournamentTeamRegistrations$: Observable<TournamentTeam[]>;

  @Output() onStartTournament = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onStartTeamTournament = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onAddDummyPlayer = new EventEmitter();
  @Output() onAddDummyTeam = new EventEmitter();
  @Output() onSaveTournament = new EventEmitter<Tournament>();

  @Output() onAddTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  @Output() onAddTournamentRegistration = new EventEmitter<RegistrationPush>();
  @Output() onAddArmyListForRegistration = new EventEmitter<ArmyListRegistrationPush>();
  @Output() onAddArmyListForTournamentPlayer = new EventEmitter<ArmyListTournamentPlayerPush>();
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

  allRegistrations: Registration[];
  userPlayerData: Player;
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

  armyLists$: Observable<ArmyList[]>;

  constructor(public dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    const that = this;

    this.armyLists$ = this.actualTournamentArmyList$;

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.loggedIn = auth.loggedIn;
      this.currentUserId = auth.currentUserId;

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

        this.tournamentTeams = teams.length;
      });

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

  isAdmin(): boolean {
    if (this.actualTournament && this.currentUserId) {
      return (this.currentUserId === this.actualTournament.creatorUid);
    } else {
      return false;
    }

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
    const onAddDummyPlayer = dialogRef.componentInstance.onAddDummyPlayer.subscribe(() => {

      this.onAddDummyPlayer.emit();

    });
    const onAddDummyTeam = dialogRef.componentInstance.onAddDummyTeam.subscribe(() => {

      this.onAddDummyTeam.emit();

    });
    dialogRef.afterClosed().subscribe(() => {

      onAddDummyPlayer.unsubscribe();
      startTournamentSub.unsubscribe();
      onAddDummyTeam.unsubscribe();
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
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
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

    const isAdmin = this.isAdmin();

    const dialogRef = this.dialog.open(ShowTeamRegistrationDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        team: this.teamCreator,
        allRegistrations: this.allRegistrations,
        userPlayerData: this.userPlayerData,
        myTeam: this.myTeam,
        isAdmin: isAdmin
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
  dummyNotAllowed: boolean;

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
      playerUploadedArmyLists:  false
    };
  }

  checkTeamName() {

    const that = this;
    that.teamNameAlreadyInUse = false;

    that.dummyNotAllowed = that.createTournamentForm.get('teamName').value.toLowerCase() === 'dummy';

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
  dummyNotAllowed: boolean;

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
      playerUploadedArmyLists:  false
    };
  }

  checkTeamName() {

    const that = this;
    that.teamNameAlreadyInUse = false;

    that.dummyNotAllowed = that.registerTournamentForm.get('teamName').value.toLowerCase() === 'dummy';

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

@Component({
  selector: 'start-tournament-dialog',
  templateUrl: './start-tournament-dialog.html'
})
export class StartTournamentDialogComponent {

  allActualTournamentPlayers: TournamentPlayer[];
  allActualTournamentTeams: TournamentTeam[];
  suggestedRoundsToPlay: number;
  actualTournament: Tournament;

  @Output() onStartTournament = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onAddDummyPlayer = new EventEmitter();
  @Output() onAddDummyTeam = new EventEmitter();

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.actualTournament = data.actualTournament;

    data.allActualTournamentPlayers$.subscribe(players => {
      this.allActualTournamentPlayers = players;
      if (data.actualTournament.teamSize === 0) {
        this.suggestedRoundsToPlay = Math.ceil(Math.log2(players.length));
      }
    });

    data.allActualTournamentTeams$.subscribe(teams => {
      this.allActualTournamentTeams = teams;
      if (data.actualTournament.teamSize > 0) {
        this.suggestedRoundsToPlay = Math.ceil(Math.log2(teams.length));
      }
    });
  }

  dummyPlayerAlreadyIn(): TournamentPlayer {
    return _.find(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
      if (player.playerName === 'DUMMY') {
        return player;
      }
    });
  }

  dummyTeamAlreadyIn(): TournamentTeam {
    return _.find(this.allActualTournamentTeams, function (team: TournamentTeam) {
      if (team.teamName === 'DUMMY') {
        return team;
      }
    });
  }

  checkAllTeamsAreFull(): boolean {

    const that = this;

    let allTeamsFull = true;

    _.each(this.allActualTournamentTeams, function (team: TournamentTeam) {

      const playersFromTeam = _.filter(that.allActualTournamentPlayers, function (player: TournamentPlayer) {
        return team.teamName === player.teamName;
      });
      if (that.actualTournament.teamSize > playersFromTeam.length) {
        allTeamsFull = false;
      }
    });
    return allTeamsFull;
  }

  checkNoTeamIsOver9000(): boolean {

    const that = this;

    let teamIsOver9000 = false;

    _.each(this.allActualTournamentTeams, function (team: TournamentTeam) {

      const playersFromTeam = _.filter(that.allActualTournamentPlayers, function (player: TournamentPlayer) {
        return team.teamName === player.teamName;
      });
      if (that.actualTournament.teamSize < playersFromTeam.length) {
        teamIsOver9000 = true;
      }
    });
    return teamIsOver9000;
  }

  startTournament() {

    this.onStartTournament.emit({
      tournamentId: '',
      round: 1,
      teamRestriction: this.teamRestriction,
      metaRestriction: this.metaRestriction,
      originRestriction: this.originRestriction,
      countryRestriction: this.countryRestriction,
    });
    this.dialogRef.close();
  }

  addDummyPlayer() {
    this.onAddDummyPlayer.emit();
  }

  addDummyTeam() {
    this.onAddDummyTeam.emit();
  }
}
