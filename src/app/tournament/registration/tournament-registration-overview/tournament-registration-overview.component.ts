import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {MdDialog} from '@angular/material';
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
import {PrintArmyListsDialogComponent} from "../../../dialogs/print-army-lists-dialog";


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

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;
  isRegisteredPlayer: boolean;

  myRegistration: Registration;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;

  private allTeamNames: string[] = [];


  constructor(private dialog: MdDialog,
              private tournamentService: TournamentService,
              private registrationService: ActualTournamentRegistrationService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private armyListService: ActualTournamentArmyListService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              private router: Router) {

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebaseTournament(params['id']);
        this.registrationService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
        this.armyListService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allRegistrations$ = this.store.select(state => state.actualTournament.actualTournamentRegisteredPlayers);
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournament.actualTournamentPlayers);
    this.allArmyLists$ = this.store.select(state => state.actualTournament.actualTournamentArmyLists);

    this.loadReg$ = this.store.select(state => state.actualTournament.loadRegistrations);
  }

  ngOnInit() {

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
      this.setIsRegistered();
    });
    this.userPlayerDataSub = this.userPlayerData$.subscribe((player: Player) => {
      this.userPlayerData = player;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
      this.setIsRegistered();
    });

    this.allActualTournamentPlayersSub = this.allTournamentPlayers$.subscribe((allTournamentPlayers: TournamentPlayer[]) => {
      this.allActualTournamentPlayers = allTournamentPlayers;
      this.setIsTournamentPlayer();
    });

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allRegistrations: Registration[]) => {
      this.allActualRegistrations = allRegistrations;
      this.setIsRegistered();
    });

  }


  ngOnDestroy() {
    this.tournamentService.unsubscribeOnFirebaseTournament();
    this.registrationService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualRegistrationsSub.unsubscribe();
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

      _.find(this.allActualTournamentPlayers, function (player: TournamentPlayer) {
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

      _.find(this.allActualRegistrations, function (reg: Registration) {

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

  openRegistrationDialog() {
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
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openAddArmyListForRegistrationDialog() {

    const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
      data: {
        registration: this.myRegistration,
        armyLists$: this.allArmyLists$
      }
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForRegistration.subscribe(
      (armyListRegistrationPush: ArmyListRegistrationPush) => {

        if (armyListRegistrationPush !== undefined) {
          this.armyListService.pushArmyListForRegistration(armyListRegistrationPush);
        }
      });
    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

      if (armyList !== undefined) {
        this.armyListService.killArmyList(armyList);
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
      tournament: this.actualTournament
    });
  }

  handleAcceptRegistration(registration: Registration) {
    this.registrationService.acceptRegistration(registration);
  }


}



