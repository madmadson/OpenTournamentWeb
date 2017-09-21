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
import {DropPlayerPush} from '../../../../../shared/dto/drop-player-push';
import {ActualTournamentTeamRankingService} from '../../actual-tournament-team-ranking.service';
import {ShowSoloRankingsComponent} from '../../../dialogs/mini-dialog/show-solo-rankings-dialog';


@Component({
  selector: 'tournament-ranking-overview',
  templateUrl: './tournament-ranking-overview.component.html',
  styleUrls: ['./tournament-ranking-overview.component.scss']
})
export class TournamentRankingsOverviewComponent implements OnInit, OnDestroy {

  round: number;

  actualTournament$: Observable<Tournament>;
  actualTournament: Tournament;

  userPlayerData$: Observable<Player>;
  userPlayerData: Player;

  allTournamentPlayers$: Observable<TournamentPlayer[]>;
  allActualTournamentPlayers: TournamentPlayer[];

  loadRanking$: Observable<boolean>;
  loadTeamRanking$: Observable<boolean>;

  allPlayerRankings$: Observable<TournamentRanking[]>;
  playerRankingsForRound$: Observable<TournamentRanking[]>;
  playerRankingsForRound: TournamentRanking[];

  allTeamRankings$: Observable<TournamentRanking[]>;
  teamRankingsForRound$: Observable<TournamentRanking[]>;

  allArmyLists$: Observable<ArmyList[]>;
  allArmyLists: ArmyList[];

  smallScreen: boolean;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private playerRankingsSub: Subscription;
  private armyListSub: Subscription;

  isTeamTournament: boolean;

  constructor(private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private armyListService: ActualTournamentArmyListService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private rankingService: ActualTournamentRankingService,
              private teamRankingService: ActualTournamentTeamRankingService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              private router: Router) {

    this.round = +this.activeRouter.snapshot.paramMap.get('round');

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
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allPlayerRankings$ = this.store.select(state => state.actualTournamentRankings.rankings);
    this.allTeamRankings$ = this.store.select(state => state.actualTournamentTeamRankings.teamRankings);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);

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


  showGamesOfRound() {
    this.router.navigate(['/tournament', this.actualTournament.id, 'round', (this.round )]);
  }


  handleDropPlayer(dropPush: DropPlayerPush) {

    this.rankingService.dropPlayer(dropPush);

    this.snackBar.open('Drop player successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  handleUndoDropPlayer(rank: TournamentRanking) {

    this.rankingService.undoDropPlayer(rank);

    this.snackBar.open('Undo drop player successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
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



