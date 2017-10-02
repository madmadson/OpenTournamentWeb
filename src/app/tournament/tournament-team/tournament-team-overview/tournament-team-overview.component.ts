import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {MdDialog, MdSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Tournament} from '../../../../../shared/model/tournament';
import {Player} from '../../../../../shared/model/player';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {Registration} from '../../../../../shared/model/registration';
import {TournamentPlayersService} from '../../actual-tournament-players.service';
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
import {CHANGE_SEARCH_FIELD_TOURNAMENT_TEAMS_ACTION} from '../../store/tournament-actions';
import {PrintArmyListsDialogComponent} from '../../../dialogs/print-army-lists-dialog';
import {TournamentFormDialogComponent} from '../../../dialogs/tournament-form-dialog';
import {StartTournamentDialogComponent} from '../../../dialogs/actualTournament/start-tournament-dialog';
import {TournamentManagementConfiguration} from '../../../../../shared/dto/tournament-management-configuration';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {PairingService} from '../../pairing.service';
import {getAllFactions} from '../../../../../shared/model/factions';
import {compareTeam, TournamentTeam} from '../../../../../shared/model/tournament-team';
import {ActualTournamentTeamsService} from '../../actual-tournament-teams.service';
import {ActualTournamentTeamRegistrationService} from '../../actual-tournament-team-registration.service';
import {TeamPairingService} from '../../team-pairing.service';
import {CreateTeamDialogComponent} from '../../../dialogs/create-team-dialog';
import {ShowPlayerListDialogComponent} from '../../../dialogs/mini-dialog/show-player-list-dialog';
import {WindowRefService} from '../../../service/window-ref-service';
import {AfoListObservable, AngularFireOfflineDatabase} from 'angularfire2-offline';


@Component({
  selector: 'tournament-team-overview',
  templateUrl: './tournament-team-overview.component.html',
  styleUrls: ['./tournament-team-overview.component.scss']
})
export class TournamentTeamOverviewComponent implements OnInit, OnDestroy {

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allActualTournamentPlayers: TournamentPlayer[];
  allActualRegistrations: Registration[];

  allRegistrations$: Observable<Registration[]>;
  allTournamentPlayers$: Observable<TournamentPlayer[]>;

  allArmyLists$: Observable<ArmyList[]>;
  allArmyLists: ArmyList[];

  allTournamentTeamsRegistrations$: Observable<TournamentTeam[]>;
  allTournamentTeamsRegistrations: TournamentTeam[];

  allTournamentTeams$: Observable<TournamentTeam[]>;
  allTournamentTeams: TournamentTeam[];
  allTournamentTeamsFiltered$: Observable<TournamentTeam[]>;

  loadTeams$: Observable<boolean>;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;
  isTeamTournament: boolean;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;
  private allActualTournamentTeamsSub: Subscription;
  private allActualTournamentTeamRegsSub: Subscription;
  private allArmyListsSub: Subscription;

  searchField$: Observable<string>;

  @ViewChild('searchField') searchField: ElementRef;

  isConnected$: Observable<boolean>;
  private onlineSub: Subscription;
  private blub$: AfoListObservable<any[]>;
  private blub2$: AfoListObservable<any[]>;

  constructor(private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private registrationService: ActualTournamentRegistrationService,
              private tournamentPlayerService: TournamentPlayersService,
              private tournamentTeamService: ActualTournamentTeamsService,
              private tournamentTeamRegService: ActualTournamentTeamRegistrationService,
              private armyListService: ActualTournamentArmyListService,
              private pairingService: PairingService,
              private teamPairingService: TeamPairingService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              public router: Router,
              private winRef: WindowRefService,
              private afoDatabase: AngularFireOfflineDatabase) {

    this.isConnected$ = Observable.merge(
      Observable.of(this.winRef.nativeWindow.navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => true),
      Observable.fromEvent(window, 'offline').map(() => false));

    this.activeRouter.params.subscribe(
      params => {
        this.subscribeOnServices(params);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allRegistrations$ = this.store.select(state => state.actualTournamentRegistrations.registrations);
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);

    this.allTournamentTeams$ = this.store.select(state => state.actualTournamentTeams.teams);
    this.allTournamentTeamsRegistrations$ = this.store.select(state => state.actualTournamentTeamRegistrations.teamRegistrations);
    this.loadTeams$ = this.store.select(state => state.actualTournamentTeams.loadTeams);

    this.searchField$ = this.store.select(state => state.actualTournamentTeams.teamsSearchField);

    this.allTournamentTeamsFiltered$ = Observable.combineLatest(
      this.allTournamentTeams$,
      this.searchField$,
      (allTeams, searchField) => {
        return allTeams.filter((team: TournamentTeam) => {
          if (team.teamName) {
            const searchStr = team.teamName.toLowerCase();
            return searchStr.startsWith(searchField.toLowerCase());
          } else {
            return team;
          }
        }).sort(compareTeam);
      });
  }

  ngOnInit() {

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      this.setIsAdmin();
      this.setIsCoAdmin();
      this.setIsTournamentPlayer();


      if (actualTournament) {
        this.isTeamTournament = (actualTournament.teamSize > 0);
      }
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

    this.allArmyListsSub = this.allArmyLists$.subscribe((allLists: ArmyList[]) => {
      this.allArmyLists = allLists;
    });

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allRegistrations: Registration[]) => {
      this.allActualRegistrations = allRegistrations;
    });

    this.allActualTournamentTeamsSub = this.allTournamentTeams$.subscribe((allTeams: TournamentTeam[]) => {
      this.allTournamentTeams = allTeams;
    });

    this.allActualTournamentTeamRegsSub = this.allTournamentTeamsRegistrations$.subscribe((allTeamRegs: TournamentTeam[]) => {
      this.allTournamentTeamsRegistrations = allTeamRegs;
    });


    Observable.fromEvent(this.searchField.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        this.store.dispatch({
          type: CHANGE_SEARCH_FIELD_TOURNAMENT_TEAMS_ACTION,
          payload: this.searchField.nativeElement.value
        });
      });
  }


  ngOnDestroy() {
    this.unsubscribeServices();
    this.unsubscribeObservables();
  }

  private unsubscribeObservables() {

    this.onlineSub.unsubscribe();

    this.actualTournamentSub.unsubscribe();
    this.allArmyListsSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualRegistrationsSub.unsubscribe();
    this.allActualTournamentTeamsSub.unsubscribe();
    this.allActualTournamentTeamRegsSub.unsubscribe();
  }

  private subscribeOnServices(params) {

    this.tournamentService.subscribeOnOfflineFirebase(params['id']);
    this.registrationService.subscribeOnOfflineFirebase(params['id']);
    this.tournamentPlayerService.subscribeOnOfflineFirebase(params['id']);
    this.armyListService.subscribeOnOfflineFirebase(params['id']);

    this.tournamentTeamService.subscribeOnOfflineFirebase(params['id']);
    this.tournamentTeamRegService.subscribeOnOfflineFirebase(params['id']);

    this.blub$ = this.afoDatabase.list('tournament-team-games/' + params['id']);
    this.blub2$ = this.afoDatabase.list('tournament-games/' + params['id']);

    this.onlineSub = this.isConnected$.subscribe(online => {

      if (online) {
        console.log('online');


        this.snackBar.open('You are now online. Sync with server', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      } else {
        console.log('offline');

        this.snackBar.open('You are now offline. Write to browser DB', '', {
          extraClasses: ['snackBar-fail'],
          duration: 5000
        });
      }
    });
  }

  private unsubscribeServices() {
    this.tournamentService.unsubscribeOnFirebase();
    this.registrationService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();
    this.tournamentTeamService.unsubscribeOnFirebase();
    this.tournamentTeamRegService.unsubscribeOnFirebase();
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

  handleAddArmyLists(player: TournamentPlayer) {

    const dialogRef = this.dialog.open(AddArmyListsDialogComponent, {
      data: {
        tournamentPlayer: player,
        armyLists$: this.allArmyLists$
      },
      disableClose: true
    });
    const saveEventSubscribe = dialogRef.componentInstance.onSaveArmyListForTournamentPlayer.subscribe(
      (armyListForPlayer: ArmyListTournamentPlayerPush) => {

        if (armyListForPlayer !== undefined) {
          this.armyListService.pushArmyListForTournamentPlayer(armyListForPlayer.armyList);

          this.snackBar.open('Army List for Player saved successfully', '', {
            extraClasses: ['snackBar-success'],
            duration: 5000
          });
        }
      });
    const deleteEventSubscribe = dialogRef.componentInstance.onDeleteArmyList.subscribe(armyList => {

      if (armyList !== undefined) {
        this.armyListService.killArmyList(armyList);

        this.snackBar.open('ArmyList deleted successfully', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      }
    });

    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
      deleteEventSubscribe.unsubscribe();
    });

  }

  openCreateTeamDialog() {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      data: {
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        tournamentTeamRegistrations: this.allTournamentTeamsRegistrations,
        tournamentTeams: this.allTournamentTeams
      }
    });

    const saveEventSubscribe = dialogRef.componentInstance.onCreateTeamForTeamTournament.subscribe(team => {

      if (team !== undefined) {
        this.tournamentTeamService.pushTournamentTeam(team);

        this.snackBar.open('Team created successfully', '', {
          duration: 5000
        });
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      saveEventSubscribe.unsubscribe();
    });
  }

  openShowPlayersDialog() {
    this.dialog.open(ShowPlayerListDialogComponent, {
      data: {
        isAdmin: this.isAdmin,
        isCoOrganizer: this.isCoOrganizer,
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        players: this.allActualTournamentPlayers,
        allArmyLists: this.allArmyLists,
        isTeamTournament: this.isTeamTournament
      },
      width: '800px'
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

        this.snackBar.open('Tournament edited successfully', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
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

  openStartTeamTournamentDialog() {


    const dialogRef = this.dialog.open(StartTournamentDialogComponent, {
      data: {
        allActualTournamentPlayers: this.allActualTournamentPlayers,
        allActualTournamentTeams: this.allTournamentTeams,
        actualTournament: this.actualTournament,
      },
      width: '600px',
    });
    const startTournamentSub = dialogRef.componentInstance.onStartTournament.subscribe((config: TournamentManagementConfiguration) => {
      if (config !== undefined) {
        config.tournamentId = this.actualTournament.id;
        config.round = 1;

        // first player rankings
        const newPlayerRankings: TournamentRanking[] =
          this.pairingService.pushRankingForRound(config, this.allActualTournamentPlayers, []);

        const newTeamRankings: TournamentRanking[] =
          this.teamPairingService.pushTeamRankingForRound(config, this.allTournamentTeams, []);
        const success: boolean = this.teamPairingService.createTeamGamesForRound(
          this.actualTournament, this.allActualTournamentPlayers, [], config,
          newTeamRankings, newPlayerRankings);

        if (success) {
          this.tournamentService.startTournament(config);

          this.router.navigate(['/tournament', this.actualTournament.id, 'round', 1]);

          console.log('Success!');
        } else {

          this.snackBar.open('Failed to create Parings. Check Pairing Options.', '', {
            extraClasses: ['snackBar-fail'],
            duration: 5000
          });

          this.pairingService.killPlayerRankings(newPlayerRankings);
          this.teamPairingService.killTeamRankingsForRound(config, newTeamRankings);
        }


      }
    });

    dialogRef.afterClosed().subscribe(() => {
      startTournamentSub.unsubscribe();
    });
  }


  createRandomTeams() {

    const allFactions = getAllFactions();

    for (let i = 0; i < 30; i++) {

      const newTeam = new TournamentTeam(false, this.actualTournament.id, '',
        'Gen Team ' + (i + 1 + this.allTournamentTeams.length), '', '', false, [], [], '', '', false, false, false, false, 0);

      for (let j = 0; j < this.actualTournament.teamSize; j++) {

        const randomFaction = allFactions[Math.floor(Math.random() * allFactions.length)];

        const newPlayer = new TournamentPlayer(this.actualTournament.id, '', '', '',
          newTeam.teamName + ' Player ' + (j + 1), '', '', newTeam.teamName, '', 0, randomFaction, 0);
        const newId = this.tournamentPlayerService.pushTournamentPlayer(newPlayer);

        newTeam.tournamentPlayerIds.push(newId);

        // console.log('new Player: ' + JSON.stringify(newPlayer));
      }

      // console.log('new Team: ' + JSON.stringify(newTeam));

      this.tournamentTeamService.pushTournamentTeam(newTeam);
    }

  }

}



