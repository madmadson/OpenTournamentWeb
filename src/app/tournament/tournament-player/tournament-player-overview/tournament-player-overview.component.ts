import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

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

import {AddArmyListsDialogComponent} from '../../../dialogs/add-army-lists-dialog';
import {ActualTournamentArmyListService} from '../../actual-tournament-army-list.service';
import {ArmyList} from '../../../../../shared/model/armyList';

import {ArmyListTournamentPlayerPush} from '../../../../../shared/dto/armyList-tournamentPlayer-push';
import {CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION} from '../../store/tournament-actions';
import {NewTournamentPlayerDialogComponent} from '../../../dialogs/add-tournament-player-dialog';
import {PrintArmyListsDialogComponent} from '../../../dialogs/print-army-lists-dialog';
import {TournamentFormDialogComponent} from '../../../dialogs/tournament-form-dialog';
import {StartTournamentDialogComponent} from '../../../dialogs/actualTournament/start-tournament-dialog';
import {TournamentManagementConfiguration} from '../../../../../shared/dto/tournament-management-configuration';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {PairingService} from '../../pairing.service';
import {getAllFactions} from '../../../../../shared/model/factions';


@Component({
  selector: 'tournament-round-overview',
  templateUrl: './tournament-player-overview.component.html',
  styleUrls: ['./tournament-player-overview.component.scss']
})
export class TournamentPlayerOverviewComponent implements OnInit, OnDestroy {

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allActualTournamentPlayers: TournamentPlayer[];
  allActualRegistrations: Registration[];

  allRegistrations$: Observable<Registration[]>;
  allTournamentPlayers$: Observable<TournamentPlayer[]>;
  allTournamentPlayersFiltered$: Observable<TournamentPlayer[]>;
  allArmyLists$: Observable<ArmyList[]>;
  loadPlayers$: Observable<boolean>;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;

  searchField$: Observable<string>;

  @ViewChild('searchField') searchField: ElementRef;


  constructor( private snackBar: MdSnackBar,
               private dialog: MdDialog,
              private tournamentService: TournamentService,
              private registrationService: ActualTournamentRegistrationService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private armyListService: ActualTournamentArmyListService,
              private pairingService: PairingService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              private router: Router) {

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebase(params['id']);
        this.registrationService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
        this.armyListService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allRegistrations$ = this.store.select(state => state.actualTournament.actualTournamentRegisteredPlayers);
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);

    this.loadPlayers$ = this.store.select(state => state.actualTournamentPlayers.loadPlayers);

    this.searchField$ = this.store.select(state => state.actualTournamentPlayers.playersSearchField);

    this.allTournamentPlayersFiltered$ = Observable.combineLatest(
      this.allTournamentPlayers$,
      this.searchField$,
      (allPlayers, searchField) => {
        return allPlayers.filter((p: TournamentPlayer) => {
          const searchStr = p.playerName.toLowerCase();
          return searchStr.startsWith(searchField.toLowerCase());
        });
      });
  }

  ngOnInit() {

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
    });
    this.userPlayerDataSub = this.userPlayerData$.subscribe((player: Player) => {
      this.userPlayerData = player;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();
    });

    this.allActualTournamentPlayersSub = this.allTournamentPlayers$.subscribe((allTournamentPlayers: TournamentPlayer[]) => {
      this.allActualTournamentPlayers = allTournamentPlayers;
    });

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allRegistrations: Registration[]) => {
      this.allActualRegistrations = allRegistrations;
    });


    Observable.fromEvent(this.searchField.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this.store.dispatch({type: CHANGE_SEARCH_FIELD_TOURNAMENT_PLAYERS_ACTION, payload: this.searchField.nativeElement.value});
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

  handleDeletePlayer(player: TournamentPlayer) {
    this.tournamentPlayerService.killPlayer(player);
  }

  handleAddArmyLists(player: TournamentPlayer) {

    const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
      data: {
        tournamentPlayer: player,
        armyLists$: this.allArmyLists$
      }
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForTournamentPlayer.subscribe(
      (armyListForPlayer: ArmyListTournamentPlayerPush) => {

        if (armyListForPlayer !== undefined) {
          this.armyListService.pushArmyListForTournamentPlayer(armyListForPlayer.armyList);
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
        this.tournamentPlayerService.pushTournamentPlayer(tournamentPlayer);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
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

  openStartTournamentDialog() {


    const dialogRef = this.dialog.open(StartTournamentDialogComponent, {
      data: {
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        allActualTournamentTeams: [],
        actualTournament: this.actualTournament,
      },
      width: '600px',
    });
    const startTournamentSub = dialogRef.componentInstance.onStartTournament.subscribe((config: TournamentManagementConfiguration) => {
      if (config !== undefined) {
        config.tournamentId = this.actualTournament.id;
        config.round = 1;
        if (this.actualTournament.teamSize === 0) {

          const newRankings: TournamentRanking[] =
            this.pairingService.pushRankingForRound(config, this.allActualTournamentPlayers, []);
          const success: boolean = this.pairingService.pushGamesForRound(config, newRankings);

          if (success) {
            this.tournamentService.startTournament(config);

            this.router.navigate(['/tournament', this.actualTournament.id, 'round', 1]);
          } else {

            this.snackBar.open('Failed to create Parings. Check Pairing Options.', '', {
              extraClasses: ['snackBar-fail'],
              duration: 5000
            });

            this.pairingService.killRankingsForRound(config);
            this.pairingService.killGamesForRound(config);
          }

        } else {
          // this.onStartTeamTournament.emit(config);
        }
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      startTournamentSub.unsubscribe();
    });

  }

  createRandomPlayers() {

    for (let i = 0; i < 100; i++) {

      const allFactions = getAllFactions();
      const randomFaction = allFactions[Math.floor(Math.random() * allFactions.length)];

      const newPlayer = new TournamentPlayer(this.actualTournament.id, '', '', '', 'GeneratedPlayer ' + (i + 1), '', '', '', '', 0, randomFaction, 0);
      this.tournamentPlayerService.pushTournamentPlayer(newPlayer);
    }

  }
}



