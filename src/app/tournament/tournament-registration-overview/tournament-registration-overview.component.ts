import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {TournamentService} from '../actual-tournament.service';
import {ActualTournamentRegistrationService} from '../actual-tournament-registration.service';
import {Observable} from 'rxjs/Observable';
import {Tournament} from '../../../../shared/model/tournament';
import {Player} from '../../../../shared/model/player';
import {AppState} from '../../store/reducers/index';
import {Store} from '@ngrx/store';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';

import * as _ from 'lodash';
import {Registration} from '../../../../shared/model/registration';
import {ActualTournamentPlayerService} from '../actual-tournament-player.service';
import {Subscription} from 'rxjs/Subscription';
import {AddPlayerRegistrationDialogComponent} from '../../dialogs/tournament-preparation/add-player-registration-dialog';
import {MdDialog} from '@angular/material';

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

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;
  isRegisteredPlayer: boolean;

  myRegistration: Registration;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;

  constructor(private dialog: MdDialog,
              private tournamentService: TournamentService,
              private registrationService: ActualTournamentRegistrationService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute) {

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebase(params['id']);
        this.registrationService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allRegistrations$ = this.store.select(state => state.actualTournament.actualTournamentRegisteredPlayers);
    // this.allTournamentPlayers$ = this.store.select(state => state.actualTouacrnament.actualTournamentPlayers);
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
    });

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allRegistrations: Registration[]) => {
      this.allActualRegistrations = allRegistrations;
    });

  }


  ngOnDestroy() {
    this.tournamentService.unsubscribeOnFirebase();
    this.registrationService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualRegistrationsSub.unsubscribe();
  }

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

      _.find(this.allActualRegistrations, function (reg: Registration) {
        console.log('search regs: ' + JSON.stringify(reg));
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
        userPlayerData: this.userPlayerData
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

  deleteMyRegistration() {

    this.registrationService.killRegistration({
      registration: this.myRegistration,
      tournament: this.actualTournament
    });
  }
}



