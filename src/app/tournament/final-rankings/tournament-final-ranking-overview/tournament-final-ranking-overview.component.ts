import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';


import * as _ from 'lodash';
import {Subscription} from 'rxjs/Subscription';
import {Player} from '../../../../../shared/model/player';
import {MdDialog, MdSnackBar} from '@angular/material';
import {TournamentService} from '../../actual-tournament.service';
import {ActualTournamentPlayerService} from '../../actual-tournament-player.service';
import {ActualTournamentArmyListService} from '../../actual-tournament-army-list.service';
import {ActualTournamentRankingService} from 'app/tournament/actual-tournament-ranking.service';
import {AppState} from '../../../store/reducers/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';
import {compareRanking, compareTeamRanking, TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../../shared/model/armyList';
import {EloService} from '../../elo.service';
import {Registration} from '../../../../../shared/model/registration';
import {TournamentGame} from '../../../../../shared/model/tournament-game';
import {ShowSoloRankingsComponent} from '../../../dialogs/mini-dialog/show-solo-rankings-dialog';
import {ActualTournamentTeamRankingService} from '../../actual-tournament-team-ranking.service';
import {UploadTournamentDialogComponent} from '../../../dialogs/upload-tournament-dialog';


@Component({
  selector: 'tournament-final-ranking-overview',
  templateUrl: './tournament-final-ranking-overview.component.html',
  styleUrls: ['./tournament-final-ranking-overview.component.scss']
})
export class TournamentFinalRankingsOverviewComponent implements OnInit, OnDestroy {

  round: number;

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allTournamentPlayers$: Observable<TournamentPlayer[]>;
  allActualTournamentPlayers: TournamentPlayer[];

  allPlayerRankings$: Observable<TournamentRanking[]>;
  playerRankingsForRound$: Observable<TournamentRanking[]>;
  playerRankingsForRound: TournamentRanking[];

  allTeamRankings$: Observable<TournamentRanking[]>;
  teamRankingsForRound$: Observable<TournamentRanking[]>;

  loadRanking$: Observable<boolean>;
  loadTeamRanking$: Observable<boolean>;

  allRegistrations$: Observable<Registration[]>;
  allRegistrations: Registration[];

  allTournamentGames$: Observable<TournamentGame[]>;
  allTournamentGames: TournamentGame[];

  allArmyLists$: Observable<ArmyList[]>;
  allArmyLists: ArmyList[];

  smallScreen: boolean;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;
  private allActualTournamentGamesSub: Subscription;
  private armyListSub: Subscription;
  private playerRankingsSub: Subscription;

  isTeamTournament: boolean;

  constructor(private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private armyListService: ActualTournamentArmyListService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private rankingService: ActualTournamentRankingService,
              private teamRankingService: ActualTournamentTeamRankingService,
              private eloService: EloService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              public router: Router) {

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
        this.armyListService.subscribeOnFirebase(params['id']);
        this.rankingService.subscribeOnFirebase(params['id']);
        this.teamRankingService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);
    this.allRegistrations$ = this.store.select(state => state.actualTournamentRegistrations.registrations);

    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);

    this.allPlayerRankings$ = this.store.select(state => state.actualTournamentRankings.rankings);
    this.allTeamRankings$ = this.store.select(state => state.actualTournamentTeamRankings.teamRankings);

    this.allTournamentGames$ = this.store.select(state => state.actualTournamentGames.games);

    this.playerRankingsForRound$ = this.allPlayerRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === this.round).sort(compareRanking).reverse());

    this.teamRankingsForRound$ = this.allTeamRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === this.round).sort(compareTeamRanking).reverse());

    this.loadRanking$ = this.store.select(state => state.actualTournamentRankings.loadRankings);
    this.loadTeamRanking$ = this.store.select(state => state.actualTournamentTeamRankings.loadTeamRankings);

  }

  ngOnInit() {

    this.actualTournamentSub = this.actualTournament$.subscribe((actualTournament: Tournament) => {
      this.actualTournament = actualTournament;
      if (actualTournament) {
        this.round = actualTournament.actualRound;
      }

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
      this.setIsTournamentPlayer();
    });

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allReg: Registration[]) => {
      this.allRegistrations = allReg;
    });

    this.allActualTournamentGamesSub = this.allTournamentGames$.subscribe((allTournamentGames: TournamentGame[]) => {
      this.allTournamentGames = allTournamentGames;
    });

    this.playerRankingsSub = this.playerRankingsForRound$.subscribe((rankings: TournamentRanking[]) => {
      this.playerRankingsForRound = rankings;
    });

    this.armyListSub = this.allArmyLists$.subscribe((armyLists: ArmyList[]) => {
      this.allArmyLists = armyLists;
    });
  }

  ngOnDestroy() {

    this.tournamentService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();
    this.rankingService.unsubscribeOnFirebase();
    this.teamRankingService.unsubscribeOnFirebase();

    this.actualTournamentSub.unsubscribe();
    this.userPlayerDataSub.unsubscribe();
    this.allActualTournamentPlayersSub.unsubscribe();
    this.allActualRegistrationsSub.unsubscribe();
    this.playerRankingsSub.unsubscribe();
    this.armyListSub.unsubscribe();
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

  undoTournamentEnd() {
    this.tournamentService.undoTournamentEnd(this.actualTournament);

    this.snackBar.open('Undo end Tournament successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

    this.router.navigate(['/tournament', this.actualTournament.id, 'round', this.actualTournament.actualRound]);
  }


  uploadTournament() {
    const dialogRef = this.dialog.open(UploadTournamentDialogComponent);

    const eventSubscribe = dialogRef.componentInstance.onUploadTournament
      .subscribe(() => {

        this.tournamentService.uploadTournament(this.actualTournament.id);
        this.eloService.calculateEloForTournament(this.actualTournament, this.allRegistrations, this.allTournamentGames);

        this.snackBar.open('Upload Tournament successfully', '', {
          extraClasses: ['snackBar-success'],
          duration: 5000
        });
      });

    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  showPlayerRankings() {
    this.dialog.open(ShowSoloRankingsComponent, {
      data: {
        isAdmin: this.isAdmin,
        isCoOrganizer: this.isCoOrganizer,
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        rankingsForRound: this.playerRankingsForRound,
        allArmyLists: this.allArmyLists
      },
      width: '800px',
    });
  }
}



