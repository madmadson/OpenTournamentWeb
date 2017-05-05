import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';

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
import {getAllFactions} from '../../../../shared/model/factions';
import {TournamentFormDialogComponent} from '../../dialogs/tournament-form-dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TournamentTeam} from '../../../../shared/model/tournament-team';
import {ShowTeamRegistrationDialogComponent} from '../../dialogs/show-team-registration-dialog';
import {TeamRegistrationPush} from '../../../../shared/dto/team-registration-push';
import {TournamentTeamEraseModel} from '../../../../shared/dto/tournament-team-erase';
import {NewTournamentPlayerDialogComponent} from "../../dialogs/add-tournament-player-dialog";


@Component({
  selector: 'tournament-preparation',
  templateUrl: './tournament-preparation.component.html',
  styleUrls: ['./tournament-preparation.component.css']
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
  @Output() onAddDummyPlayer = new EventEmitter();
  @Output() onSaveTournament = new EventEmitter<Tournament>();

  @Output() onAddTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onAcceptRegistration = new EventEmitter<Registration>();
  @Output() onAddTournamentRegistration = new EventEmitter<Registration>();
  @Output() onAddArmyList = new EventEmitter<ArmyList>();
  @Output() onCreateTeamForTeamTournament = new EventEmitter<TournamentTeam>();
  @Output() onRegisterTeamForTeamTournament = new EventEmitter<TournamentTeam>();
  @Output() onAcceptTeamRegistration = new EventEmitter<TeamRegistrationPush>();

  @Output() onDeleteTournamentPlayer = new EventEmitter<TournamentPlayer>();
  @Output() onDeleteRegistration = new EventEmitter<Registration>();
  @Output() onDeleteArmyList = new EventEmitter<ArmyList>();
  @Output() onEraseTournamentTeam = new EventEmitter<TournamentTeamEraseModel>();

  allRegistrations: Registration[];
  userPlayerData: Player;
  myRegistration: Registration;
  myTeam: TournamentTeam;

  allActualTournamentPlayers: TournamentPlayer[];
  filteredActualTournamentPlayers: TournamentPlayer[];
  loggedIn: boolean;
  currentUserId: string;

  suggestedRoundsToPlay: number;

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
        this.myTeam = _.find(teams, function (team) {
          if (that.userPlayerData !== undefined) {
            return team.creatorUid === that.userPlayerData.userUid;
          }
        });
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

  openStartTournamentDialog() {
    const dialogRef = this.dialog.open(StartTournamentDialogComponent, {
      data: {
        allActualTournamentPlayers$: this.allActualTournamentPlayers$
      },
      width: '600px',
    });
    const startTournamentSub = dialogRef.componentInstance.onStartTournament.subscribe(config => {
      if (config !== undefined) {
        config.tournamentId = this.actualTournament.id;
        config.round = 1;
        this.onStartTournament.emit(config);
      }
    });
    const onAddDummyPlayer = dialogRef.componentInstance.onAddDummyPlayer.subscribe(() => {

        this.onAddDummyPlayer.emit();

    });
    dialogRef.afterClosed().subscribe(() => {

      onAddDummyPlayer.unsubscribe();
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
        tournament: this.actualTournament
      }
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

  openRegistrationDialog() {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData
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

  openCreateTeamDialog() {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData
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
        userPlayerData: this.userPlayerData
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
        team: this.myTeam,
        allRegistrations: this.allRegistrations,
        userPlayerData: this.userPlayerData
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onKickPlayer.subscribe(registration => {

      if (registration !== undefined) {
        this.onDeleteRegistration.emit(registration);
        dialogRef.close();
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });

  }


  deleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    if (tournamentPlayer !== undefined) {
      this.onDeleteTournamentPlayer.emit(tournamentPlayer);
    }
  }

  deleteMyRegistration(registration: Registration) {
    if (registration !== undefined) {

      this.onDeleteRegistration.emit(registration);
    }
  }

  addArmyList(registration: Registration) {
    if (registration !== undefined) {

      const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
        data: {
          registration: registration,
          armyListForRegistration: this.actualTournamentArmyList$
        },
        width: '800px',
        height: '800px'
      });
      const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyList.subscribe(armyList => {

        if (armyList !== undefined) {
          this.onAddArmyList.emit(armyList);
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

  handleAddTournamentRegistration(registration: Registration) {

    this.onAddTournamentRegistration.emit(registration);
  }

  handleKickPlayer(registration: Registration) {

    this.onDeleteRegistration.emit(registration);
  }

  handleAcceptTeamRegistration(teamRegPush: TeamRegistrationPush) {
    this.onAcceptTeamRegistration.emit(teamRegPush);
  }

  handleEraseTournamentTeam(eraseModel: TournamentTeamEraseModel) {
    this.onEraseTournamentTeam.emit(eraseModel);
  }

  handleAddTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.onAddTournamentPlayer.emit(tournamentPlayer);
  }
}


@Component({
  selector: 'registration-dialog',
  templateUrl: './registration-dialog.html'
})
export class RegisterDialogComponent {

  userPlayerData: Player;
  actualTournament: Tournament;
  team: TournamentTeam;

  @Output() onAddTournamentRegistration = new EventEmitter<Registration>();

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;
    this.team = data.team;
  }

  onSaveRegistration(registration: Registration) {

    this.onAddTournamentRegistration.emit(registration);
    this.dialogRef.close();
  }
}

@Component({
  selector: 'create-team-dialog',
  templateUrl: './create-team-dialog.html'
})
export class CreateTeamDialogComponent implements OnInit {
  userPlayerData: Player;
  actualTournament: Tournament;
  countries: string[];

  createTournamentForm: FormGroup;

  @Output() onCreateTeamForTeamTournament = new EventEmitter<TournamentTeam>();

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>,
              private formBuilder: FormBuilder) {

    this.countries = getAllCountries();
    this.userPlayerData = dialogRef._containerInstance.dialogConfig.data.userPlayerData;
    this.actualTournament = dialogRef._containerInstance.dialogConfig.data.actualTournament;
  }

  ngOnInit(): void {

    this.createTournamentForm = this.formBuilder.group({
      teamName: [ '' , [Validators.required]],
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
      isAcceptedTournamentTeam: false
    };
  }
}

@Component({
  selector: 'register-team-dialog',
  templateUrl: './register-team-dialog.html'
})
export class RegisterTeamDialogComponent implements OnInit {
  userPlayerData: Player;
  actualTournament: Tournament;
  countries: string[];

  registerTournamentForm: FormGroup;

  @Output() onRegisterTeamForTeamTournament = new EventEmitter<TournamentTeam>();

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {

    this.countries = getAllCountries();
    this.userPlayerData = data.userPlayerData;
    this.actualTournament = data.actualTournament;
  }

  ngOnInit(): void {

    this.registerTournamentForm = this.formBuilder.group({
      teamName: [ '' , [Validators.required]],
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
      isAcceptedTournamentTeam: false
    };
  }
}


@Component({
  selector: 'add-army-lists-dialog',
  templateUrl: './add-army-lists-dialog.html'
})
export class AddArmyListsDialogComponent {

  registration: Registration;
  armyListForRegistration: ArmyList[];

  armyListModel: ArmyList;
  selectedTab = 0;

  @Output() onSaveArmyList = new EventEmitter<ArmyList>();
  @Output() onDeleteArmyList = new EventEmitter<ArmyList>();

  constructor(public dialogRef: MdDialogRef<RegisterDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    const that = this;
    this.registration = data.registration;

    this.armyListModel = new ArmyList(this.registration.tournamentId, this.registration.id, this.registration.playerId, '', '');
    data.armyListForRegistration.subscribe(armyLists => {
      this.armyListForRegistration = _.filter(armyLists, function (armyList: ArmyList) {
        if (that.registration !== undefined) {
          return armyList.playerId === that.registration.playerId;
        }
      });
    });
  }

  addArmyList() {
    this.selectedTab = (this.armyListForRegistration.length + 1);
    this.onSaveArmyList.emit(this.armyListModel);
    this.armyListModel = new ArmyList(this.registration.tournamentId, this.registration.id, this.registration.playerId, '', '');
  };

  deleteArmyList(armyList: ArmyList) {
    this.onDeleteArmyList.emit(armyList);
  };
}

@Component({
  selector: 'start-tournament-dialog',
  templateUrl: './start-tournament-dialog.html'
})
export class StartTournamentDialogComponent {

  allActualTournamentPlayers: TournamentPlayer[];
  suggestedRoundsToPlay: number;

  @Output() onStartTournament = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onAddDummyPlayer = new EventEmitter();

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
     data.allActualTournamentPlayers$.subscribe(players => {
        this.allActualTournamentPlayers = players;
       this.suggestedRoundsToPlay = Math.round(Math.log2(players.length));
     });
  }

  dummyPlayerAlreadyIn(): TournamentPlayer {


    const foundDummy = _.find(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
        if (player.playerName === 'DUMMY') {
         return player;
        }
    });

    return foundDummy;
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
}
