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
import {compareRanking, TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../../shared/model/armyList';
import {DropPlayerPush} from "../../../../../shared/dto/drop-player-push";
import {PairingService} from "../../pairing.service";
import {EloService} from "../../elo.service";
import {Registration} from "../../../../../shared/model/registration";
import {TournamentGame} from "../../../../../shared/model/tournament-game";


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

  loadRanking$: Observable<boolean>;

  allTournamentRankings$: Observable<TournamentRanking[]>;
  allTournamentRankings: TournamentRanking[];
  rankingsForRound$: Observable<TournamentRanking[]>;

  allRegistrations$: Observable<Registration[]>;
  allRegistrations: Registration[];

  allTournamentGames$: Observable<TournamentGame[]>;
  allTournamentGames: TournamentGame[];

  allArmyLists$: Observable<ArmyList[]>;

  swapPlayerMode: boolean;
  smallScreen: boolean;

  isAdmin: boolean;
  isCoOrganizer: boolean;
  isTournamentPlayer: boolean;

  private actualTournamentSub: Subscription;
  private userPlayerDataSub: Subscription;
  private allActualTournamentPlayersSub: Subscription;
  private allActualRegistrationsSub: Subscription;
  private allActualTournamentGamesSub: Subscription;


  constructor(private snackBar: MdSnackBar,
              private dialog: MdDialog,
              private tournamentService: TournamentService,
              private armyListService: ActualTournamentArmyListService,
              private tournamentPlayerService: ActualTournamentPlayerService,
              private rankingService: ActualTournamentRankingService,
              private eloService: EloService,
              private store: Store<AppState>,
              private activeRouter: ActivatedRoute,
              private router: Router) {

    this.activeRouter.params.subscribe(
      params => {
        this.tournamentService.subscribeOnFirebase(params['id']);
        this.tournamentPlayerService.subscribeOnFirebase(params['id']);
        this.armyListService.subscribeOnFirebase(params['id']);
        this.rankingService.subscribeOnFirebase(params['id']);
      }
    );

    this.userPlayerData$ = this.store.select(state => state.authentication.userPlayerData);
    this.actualTournament$ = this.store.select(state => state.actualTournament.actualTournament);
    this.allTournamentPlayers$ = this.store.select(state => state.actualTournamentPlayers.players);
    this.allTournamentRankings$ = this.store.select(state => state.actualTournamentRankings.rankings);
    this.allArmyLists$ = this.store.select(state => state.actualTournamentArmyLists.armyLists);
    this.allRegistrations$ = this.store.select(state => state.actualTournamentRegistrations.registrations);
    this.allRegistrations$ = this.store.select(state => state.actualTournamentRegistrations.registrations);
    this.allTournamentGames$ = this.store.select(state => state.actualTournamentGames.games);


    this.rankingsForRound$ = this.allTournamentRankings$.map(
      rankings => rankings.filter(r => r.tournamentRound === this.round).sort(compareRanking).reverse());

    this.loadRanking$ = this.store.select(state => state.actualTournamentRankings.loadRankings);

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

    this.allActualRegistrationsSub = this.allRegistrations$.subscribe((allReg: Registration[]) => {
      this.allRegistrations = allReg;
    });

    this.allActualTournamentGamesSub = this.allTournamentGames$.subscribe((allTournamentGames: TournamentGame[]) => {
      this.allTournamentGames = allTournamentGames;
    });

  }

  ngOnDestroy() {

    this.tournamentService.unsubscribeOnFirebase();
    this.tournamentPlayerService.unsubscribeOnFirebase();
    this.armyListService.unsubscribeOnFirebase();
    this.rankingService.unsubscribeOnFirebase();

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

  undoTournamentEnd() {
    this.tournamentService.undoTournamentEnd(this.actualTournament);

    this.snackBar.open('Undo end Tournament successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

    this.router.navigate(['/tournament', this.actualTournament.id, 'round', this.actualTournament.actualRound]);
  }

  publishTournament() {
    this.tournamentService.uploadTournament(this.actualTournament.id);
    this.eloService.calculateEloForTournament(this.actualTournament, this.allRegistrations, this.allTournamentGames);

    this.snackBar.open('Upload Tournament successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

   }

}



