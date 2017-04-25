import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';

import {
  AddArmyListAction, ArmyListDeletedAction, ClearArmyListsAction,
  ClearRegistrationAction, ClearTournamentPlayerAction,
  SetActualTournamentAction, TournamentPlayerAdded, TournamentPlayerChanged, TournamentPlayerDeleted,
  TournamentRegistrationAdded,
  TournamentRegistrationChanged,
  TournamentRegistrationDeleted
} from '../store/actions/tournament-actions';
import {Registration} from '../../../shared/model/registration';
import {MdSnackBar} from '@angular/material';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyList} from '../../../shared/model/armyList';
import {TournamentRankingService} from './tournament-ranking.service';
import {TournamentGameService} from './tournament-game.service';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {SubscribeTournamentRankingsAction} from '../store/actions/tournament-rankings-actions';
import {SubscribeTournamentGamesAction} from '../store/actions/tournament-games-actions';
import {GameResult} from '../../../shared/dto/game-result';
import {PublishRound} from '../../../shared/dto/publish-round';
import {RegistrationPush} from '../../../shared/dto/registration-push';
import {SwapPlayer} from '../../../shared/dto/swap-player';
import {TournamentGame} from '../../../shared/model/tournament-game';


@Injectable()
export class TournamentService implements OnDestroy {

  private tournamentRegistrationsRef: firebase.database.Reference;
  private tournamentPlayerRef: firebase.database.Reference;
  private armyListsRef: firebase.database.Reference;

  constructor(protected rankingService: TournamentRankingService,
              protected tournamentGameService: TournamentGameService,
              protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) protected fb,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {

    console.log('destroyed!');

    if (this.tournamentRegistrationsRef) {
      this.tournamentRegistrationsRef.off();
    }
    if (this.tournamentPlayerRef) {
      this.tournamentPlayerRef.off();
    }
    if (this.armyListsRef) {
      this.armyListsRef.off();
    }
  }


  subscribeOnTournament(tournamentId: string) {

    console.log('subscribeOnTournament');

    this.afService.database.object('tournaments/' + tournamentId).subscribe(
      tournament => {
        tournament.id = tournamentId;
        this.store.dispatch(new SetActualTournamentAction(tournament));

      }
    );


    this.subscribeOnRegistrations(tournamentId);
    this.subscribeOnTournamentPlayers(tournamentId);
    this.subscribeOnArmyLists(tournamentId);
    this.store.dispatch(new SubscribeTournamentRankingsAction(tournamentId));
    this.store.dispatch(new SubscribeTournamentGamesAction(tournamentId));
  }

  private subscribeOnRegistrations(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearRegistrationAction());
    if (this.tournamentRegistrationsRef) {
      this.tournamentRegistrationsRef.off();
    }


    this.tournamentRegistrationsRef = this.fb.database().ref('tournament-registration/' + tournamentId);

    this.tournamentRegistrationsRef.on('child_added', function (snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new TournamentRegistrationAdded(registration));

    });

    this.tournamentRegistrationsRef.on('child_changed', function (snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new TournamentRegistrationChanged(registration));

    });

    this.tournamentRegistrationsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new TournamentRegistrationDeleted(snapshot.key));

    });
  }

  private subscribeOnTournamentPlayers(tournamentId: string) {
    const that = this;

    this.store.dispatch(new ClearTournamentPlayerAction());
    if (this.tournamentPlayerRef) {
      this.tournamentPlayerRef.off();
    }

    console.log('subscribeOnTournamentPlayers');

    this.tournamentPlayerRef = this.fb.database().ref('tournament-player/' + tournamentId);

    this.tournamentPlayerRef.on('child_added', function (snapshot) {

      const tournamentPlayer: TournamentPlayer = TournamentPlayer.fromJson(snapshot.val());
      tournamentPlayer.id = snapshot.key;

      that.store.dispatch(new TournamentPlayerAdded(tournamentPlayer));

    });

    this.tournamentPlayerRef.on('child_changed', function (snapshot) {

      const tournamentPlayer: TournamentPlayer = TournamentPlayer.fromJson(snapshot.val());
      tournamentPlayer.id = snapshot.key;

      that.store.dispatch(new TournamentPlayerChanged(tournamentPlayer));

    });

    this.tournamentPlayerRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new TournamentPlayerDeleted(snapshot.key));

    });
  }

  private subscribeOnArmyLists(tournamentId: string) {
    const that = this;

    this.store.dispatch(new ClearArmyListsAction());
    if (this.armyListsRef) {
      this.armyListsRef.off();
    }

    this.armyListsRef = this.fb.database().ref('tournament-armyLists/' + tournamentId);

    this.armyListsRef.on('child_added', function (snapshot) {

      const armyList: ArmyList = ArmyList.fromJson(snapshot.val());
      armyList.id = snapshot.key;

      that.store.dispatch(new AddArmyListAction(armyList));

    });

    this.armyListsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new ArmyListDeletedAction(snapshot.key));

    });
  }

  pushRegistration(registrationPush: RegistrationPush) {

    const registrations = this.afService.database.list('tournament-registration/' + registrationPush.tournament.id);
    registrations.push(registrationPush.registration);

    const tournamentRef = this.afService.database.object('tournaments/' + registrationPush.tournament.id);
    tournamentRef.update({actualParticipants: (registrationPush.tournament.actualParticipants + 1 )});

    this.snackBar.open('Registration saved successfully', '', {
      duration: 5000
    });
  }

  pushTournamentPlayer(registration: Registration) {

    const tournamentPlayer = TournamentPlayer.fromRegistration(registration);

    const tournamentPlayers = this.afService.database.list('tournament-player/' + registration.tournamentId );
    tournamentPlayers.push(tournamentPlayer);


    const registrationRef = this.afService.database.object('tournament-registration/' + registration.tournamentId + '/' + registration.id);
    registrationRef.update({isTournamentPlayer: true});

    this.snackBar.open('Tournament Player saved successfully', '', {
      duration: 5000
    });
  }

  eraseRegistration(regPush: RegistrationPush) {

    const regRef = this.afService.database.list('tournament-registration/' + regPush.tournament.id + '/' + regPush.registration.id);
    regRef.remove();

    const tournamentRef = this.afService.database.object('tournaments/' + regPush.tournament.id);
    tournamentRef.update({actualParticipants: (regPush.tournament.actualParticipants - 1 )});

    this.snackBar.open('Registration deleted successfully', '', {
      duration: 5000
    });
  }

  eraseTournamentPlayer(player: TournamentPlayer) {
    const playerRef = this.afService.database.list('tournament-player/' + player.tournamentId + '/' + player.id);
    playerRef.remove();

    if (player.registrationId) {
      const registrationRef = this.afService.database
        .object('tournament-registration/' + player.tournamentId + '/' + player.registrationId);
      registrationRef.update({isTournamentPlayer: false});
    }
    this.snackBar.open('Tournament Player deleted successfully', '', {
      duration: 5000
    });
  }

  pushArmyList(armyList: ArmyList) {

    const tournamentPlayers = this.afService.database.list('tournament-armyLists/' + armyList.tournamentId );
    tournamentPlayers.push(armyList);

    this.snackBar.open('Army List saved successfully', '', {
      duration: 5000
    });
  }

  eraseArmyList(armyList: ArmyList) {
    const armyListRef = this.afService.database
      .list('tournament-armyLists/' + armyList.tournamentId + '/' + armyList.id);
    armyListRef.remove();

    this.snackBar.open('ArmyList deleted successfully', '', {
      duration: 5000
    });
  }

  addDummyPlayer(tournamentId: string) {
    const dummy = new TournamentPlayer(tournamentId, '', '', '', 'DUMMY', '', '', '', '', 0, '');

    const tournamentPlayers = this.afService.database.list('tournament-player/' + tournamentId );
    tournamentPlayers.push(dummy);

    this.snackBar.open('Dummy Player successfully inserted', '', {
      duration: 5000
    });
  }

  pushNewTournamentPlayer(player: TournamentPlayer) {

    const tournamentPlayers = this.afService.database.list('tournament-player/' + player.tournamentId );
    tournamentPlayers.push(player);

    this.snackBar.open('Tournament Player saved successfully', '', {
      duration: 5000
    });
  }

  pairAgainTournament(config: TournamentManagementConfiguration) {
    const newRankings: TournamentRanking[] = this.rankingService.pushRankingForRound(config);
    const successFullyPaired: boolean = this.tournamentGameService.createGamesForRound(config, newRankings);
    if (successFullyPaired) {
       this.snackBar.open('Round ' + config.round + ' paired again successfully ', '', {
        duration: 5000
      });

    } else {
      this.snackBar.open('Failed to pair Round ' + config.round + ' again', '', {
        duration: 5000
      });
    }
  }

  pairNewRound(config: TournamentManagementConfiguration) {

    const newRankings: TournamentRanking[] = this.rankingService.pushRankingForRound(config);
    const successFullyPaired: boolean = this.tournamentGameService.createGamesForRound(config, newRankings);

    if (successFullyPaired) {
      const registrationRef = this.afService.database.object('tournaments/' + config.tournamentId);
      registrationRef.update({actualRound: config.round, visibleRound: (config.round - 1 )});
      this.snackBar.open('new Round Paired', '', {
        duration: 5000
      });

    } else {
      this.snackBar.open('Failed to create Parings', '', {
        duration: 5000
      });
    }
  }


  gameResultEntered(gameResult: GameResult) {

    this.rankingService.updateRanking(gameResult);

    const gameRef = this.afService.database.object('tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    gameRef.update(gameResult.gameAfter);

    this.snackBar.open('Game Result Entered Successfully', '', {
      duration: 5000
    });
  }

  publishRound(publish: PublishRound) {

    const gameRef = this.afService.database.object('tournaments/' + publish.tournamentId);
    gameRef.update({visibleRound: publish.roundToPublish});

    this.snackBar.open('Round ' + publish.roundToPublish + ' successfully published', '', {
      duration: 5000
    });
  }


  killRound(config: TournamentManagementConfiguration) {
    this.rankingService.eraseRankingsForRound(config);
    this.tournamentGameService.eraseGamesForRound(config);

    const registrationRef = this.afService.database.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      {actualRound: (config.round - 1), visibleRound: (config.round - 1)});

    this.snackBar.open('Round ' + config.round + ' successfully killed with fire!', '', {
      duration: 5000
    });
  }

  endTournament(config: TournamentManagementConfiguration) {
    this.rankingService.pushRankingForRound(config);

    const registrationRef = this.afService.database.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      { finished: true, visibleRound: (config.round - 1)}
      );
    this.snackBar.open('Successfully end Tournament', '', {
      duration: 5000
    });

  }

  undoTournamentEnd(config: TournamentManagementConfiguration) {
    this.rankingService.eraseRankingsForRound(config);

    const registrationRef = this.afService.database.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      { finished: false }
    );
    this.snackBar.open('Successfully undo end Tournament', '', {
      duration: 5000
    });
  }

  swapPlayer(swapPlayer: SwapPlayer) {

    const game1: TournamentGame = swapPlayer.gameOne;

    console.log('game1: ' + JSON.stringify(game1));

    const gameOneRef = this.fb.database().ref('tournament-games/' + game1.tournamentId + '/' + game1.id);
    gameOneRef.update(game1);

    const game2: TournamentGame = swapPlayer.gameTwo;

    console.log('game2: ' + JSON.stringify(game2));

    const gameTwoRef = this.fb.database().ref('tournament-games/' + game1.tournamentId + '/' + game2.id);
    gameTwoRef.update(game2);

    this.snackBar.open('Successfully swap player', '', {
      duration: 5000
    });

  }
}
