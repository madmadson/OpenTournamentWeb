import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Tournament} from '../../../../shared/model/tournament';
import {Registration} from '../../../../shared/model/registration';
import {ArmyList} from '../../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';
import {TournamentPlayer} from '../../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {ActivatedRoute} from '@angular/router';

import {
  TournamentPlayerPushAction,
  TournamentStartAction, RegistrationAcceptAction, TournamentSubscribeAction,
  TournamentUnsubscribeAction, TournamentPlayerEraseAction, RegistrationEraseAction,
  ArmyListEraseAction, RegistrationPushAction, ArmyListPushAction, TournamentPairAgainAction
} from '../../store/actions/tournament-actions';


import {PairingConfiguration} from '../../../../shared/model/pairing-configuration';
import {AuthenticationStoreState} from 'app/store/authentication-state';

@Component({
  selector: 'tournament-overview',
  templateUrl: './tournament-overview.component.html',
  styleUrls: ['./tournament-overview.component.css']
})
export class TournamentOverviewComponent implements OnInit, OnDestroy {

  actualTournament: Tournament;
  actualTournamentRegisteredPlayers$: Observable<Registration[]>;
  actualTournamentArmyList$: Observable<ArmyList[]>;
  allActualTournamentPlayers$: Observable<TournamentPlayer[]>;

  actualTournamentRankings$:  Observable<TournamentRanking[]>;
  actualTournamentGames$:  Observable<TournamentGame[]>;

  authenticationStoreState$: Observable<AuthenticationStoreState>;

  selectedIndex: number;

  constructor(private store: Store<ApplicationState>,
              private activeRouter: ActivatedRoute) {

    this.activeRouter.params.subscribe(
      params => {
        this.store.dispatch(new TournamentSubscribeAction(params['id']));
      }
    );


  }
  ngOnInit() {
    this.actualTournamentArmyList$ = this.store.select(state => state.actualTournamentArmyLists.actualTournamentArmyLists);
    this.actualTournamentRegisteredPlayers$ = this.store.select(
      state => state.actualTournamentRegistrations.actualTournamentRegisteredPlayers);
    this.authenticationStoreState$ = this.store.select(state => state.authenticationStoreState);
    this.allActualTournamentPlayers$ =  this.store.select(
      state => state.actualTournamentPlayers.actualTournamentPlayers);

    this.actualTournamentRankings$ =  this.store.select(
      state => state.actualTournamentRankings.actualTournamentRankings);

    this.actualTournamentGames$ =  this.store.select(
      state => state.actualTournamentGames.actualTournamentGames);

    this.store.select(state => state)
      .subscribe(state => {
        this.actualTournament = state.actualTournament.actualTournament;
        if (state.actualTournament.actualTournament) {
          this.selectedIndex = state.actualTournament.actualTournament.actualRound;
        }
      });

  }

  ngOnDestroy() {
    this.store.dispatch(new TournamentUnsubscribeAction());
  }

  getArrayForNumber(round: number) {
    return [Array(round)].map((e, i) => i + 1);
  };

  getRankingsForRound(round: number): Observable<TournamentRanking[]> {
     return this.actualTournamentRankings$.map(rankings => rankings.filter(rank => {
       return (rank.tournamentRound === round);
     }));
  }

  getGamesForRound(round: number): Observable<TournamentGame[]> {
    return this.actualTournamentGames$.map(games => games.filter(game => {
      return (game.tournamentRound === round);
    }));
  }

  handleStartTournament(config: PairingConfiguration ) {
    this.store.dispatch(new TournamentStartAction(config));
    setTimeout(() =>  this.selectedIndex = (this.selectedIndex + 1), 500);

  }

  handleAddTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.store.dispatch(new TournamentPlayerPushAction(tournamentPlayer));
  }

  handleAddTournamentRegistration(registration: Registration) {
    this.store.dispatch(new RegistrationPushAction(registration));
  }

  handleAddArmyList(armyList: ArmyList) {
    this.store.dispatch(new ArmyListPushAction(armyList));
  }

  handleDeleteArmyList(armyList: ArmyList) {
    this.store.dispatch(new ArmyListEraseAction(armyList));
  }

  handleAcceptRegistration(acceptedRegistration: Registration) {
    this.store.dispatch(new RegistrationAcceptAction(acceptedRegistration));
  }

  handleDeleteTournamentPlayer(tournamentPlayer: TournamentPlayer) {
    this.store.dispatch(new TournamentPlayerEraseAction(tournamentPlayer));
  }

  handleDeleteRegistration(registration: Registration) {
    this.store.dispatch(new RegistrationEraseAction(registration));
  }

  handlePairAgain(config: PairingConfiguration ) {
    this.store.dispatch(new TournamentPairAgainAction(config));

  }

  handleGameResult(game: TournamentGame) {
    // this.store.dispatch(new TournamentPairAgainAction(config));

  }
}
