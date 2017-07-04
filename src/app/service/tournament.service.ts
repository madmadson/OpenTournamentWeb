import { Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import * as firebase from 'firebase';

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
import {SwapGames} from '../../../shared/dto/swap-player';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {
  SubscribeTournamentTeamRegistrationsAction,
  SubscribeTournamentTeamsAction
} from '../store/actions/tournament-teams-actions';
import {SubscribeTournamentTeamGamesAction} from '../store/actions/tournament-team-games-actions';
import {SubscribeTournamentTeamRankingsAction} from '../store/actions/tournament-team-rankings-actions';
import {ScenarioSelectedModel} from '../../../shared/dto/scenario-selected-model';

import * as _ from 'lodash';
import {AfoObjectObservable, AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Tournament} from '../../../shared/model/tournament';
import {PlayerRegistrationChange} from '../../../shared/dto/playerRegistration-change';
import {ArmyListRegistrationPush} from '../../../shared/dto/armyList-registration-push';
import {ArmyListTournamentPlayerPush} from '../../../shared/dto/armyList-tournamentPlayer-push';


@Injectable()
export class TournamentService  {

  private tournamentRegistrationsRef: firebase.database.Reference;
  private tournamentPlayerRef: firebase.database.Reference;
  private armyListsRef: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected rankingService: TournamentRankingService,
              protected tournamentGameService: TournamentGameService,
              protected store: Store<ApplicationState>,
              private snackBar: MdSnackBar) {}


  subscribeOnTournament(tournamentId: string) {

    console.log('subscribeOnTournament');

    this.afoDatabase.object('tournaments/' + tournamentId).subscribe(
      tournament => {
        tournament.id = tournamentId;
        this.store.dispatch(new SetActualTournamentAction(tournament));

      }
    );

    this.subscribeOnTournamentRegistrations(tournamentId);
    this.subscribeOnTournamentPlayers(tournamentId);
    this.subscribeOnArmyLists(tournamentId);
    this.store.dispatch(new SubscribeTournamentTeamsAction(tournamentId));
    this.store.dispatch(new SubscribeTournamentTeamRegistrationsAction(tournamentId));
    this.store.dispatch(new SubscribeTournamentRankingsAction(tournamentId));
    this.store.dispatch(new SubscribeTournamentTeamRankingsAction(tournamentId));
    this.store.dispatch(new SubscribeTournamentGamesAction(tournamentId));
    this.store.dispatch(new SubscribeTournamentTeamGamesAction(tournamentId));
  }

  private subscribeOnTournamentRegistrations(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearRegistrationAction());

    if (this.tournamentRegistrationsRef) {
      this.tournamentRegistrationsRef.off();
    }

    this.tournamentRegistrationsRef = firebase.database().ref('tournament-registrations/' + tournamentId);

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

    this.tournamentPlayerRef = firebase.database().ref('tournament-players/' + tournamentId);

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

    this.armyListsRef = firebase.database().ref('tournament-armyLists/' + tournamentId);

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

    const tournamentRegRef = this.afoDatabase.list('tournament-registrations/' + registrationPush.tournament.id);
    const newRegistrationRef: firebase.database.Reference = tournamentRegRef.push(registrationPush.registration);

    const playerRegRef = this.afoDatabase.object('players-registrations/' + registrationPush.registration.playerId + '/' + newRegistrationRef.key);
    playerRegRef.set(registrationPush.registration);

    const tournamentRef = this.afoDatabase.object('tournaments/' + registrationPush.tournament.id);
    tournamentRef.update({actualParticipants: (registrationPush.tournament.actualParticipants + 1 )});

    if ( registrationPush.tournament.teamSize > 0) {

      let newListOfRegisteredTeamMembers = [];

      if (registrationPush.tournamentTeam.registeredPlayerIds) {
        newListOfRegisteredTeamMembers = _.cloneDeep(registrationPush.tournamentTeam.registeredPlayerIds);
      }

      newListOfRegisteredTeamMembers.push(registrationPush.registration.playerId);

      const tournamentTeamRef = this.afoDatabase.object(
        'tournament-team-registrations/' +
        registrationPush.tournament.id + '/' +
        registrationPush.tournamentTeam.id);
      tournamentTeamRef.update({registeredPlayerIds: newListOfRegisteredTeamMembers});

      this.snackBar.open('Registered for Team: ' + registrationPush.registration.teamName, '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });
    } else {

      this.snackBar.open('Registration saved successfully', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });
    }
  }

  pushTournamentPlayer(registration: Registration) {

    const tournamentPlayer = TournamentPlayer.fromRegistration(registration);

    const tournamentPlayers = this.afoDatabase.list('tournament-players/' + registration.tournamentId);
    tournamentPlayers.push(tournamentPlayer);

    const registrationRef = this.afoDatabase.object('tournament-registrations/' + registration.tournamentId + '/' + registration.id);
    registrationRef.update({isTournamentPlayer: true});

    this.snackBar.open('Tournament Player saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  eraseRegistration(regPush: RegistrationPush) {

    const regRef = this.afoDatabase.list('tournament-registrations/' + regPush.tournament.id + '/' + regPush.registration.id);
    regRef.remove();

    const playerRegRef = this.afoDatabase
      .list('players-registrations/' + regPush.registration.playerId + '/' + regPush.registration.id);
    playerRegRef.remove();

    const tournamentRef = this.afoDatabase.object('tournaments/' + regPush.tournament.id);
    tournamentRef.update({actualParticipants: (regPush.tournament.actualParticipants - 1 )});

    if ( regPush.tournament.teamSize > 0) {

      const newListOfRegisteredTeamMembers = _.cloneDeep(regPush.tournamentTeam.registeredPlayerIds);

      const index = newListOfRegisteredTeamMembers.indexOf(regPush.registration.playerId);
      newListOfRegisteredTeamMembers.splice(index, 1);

      const tournamentTeamRef = this.afoDatabase.object(
        'tournament-team-registrations/' +
        regPush.tournament.id + '/' +
        regPush.tournamentTeam.id);
      tournamentTeamRef.update({registeredPlayerIds: newListOfRegisteredTeamMembers});
    }

    this.snackBar.open('Registration deleted successfully', '', {
      duration: 5000
    });
  }

  eraseTournamentPlayer(player: TournamentPlayer) {
    const playerRef = this.afoDatabase.list('tournament-players/' + player.tournamentId + '/' + player.id);
    playerRef.remove();

    if (player.registrationId) {
      const registrationRef = this.afoDatabase
        .object('tournament-registrations/' + player.tournamentId + '/' + player.registrationId);
      registrationRef.update({isTournamentPlayer: false});
    }
    this.snackBar.open('Tournament Player deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  pushArmyListForRegistration(armyListRegistrationPush: ArmyListRegistrationPush) {

    const tournamentArmyListRef = this.afoDatabase.list('tournament-armyLists/' + armyListRegistrationPush.armyList.tournamentId);
    tournamentArmyListRef.push(armyListRegistrationPush.armyList);

    const registrationRef = this.afoDatabase.object('tournament-registrations/' +
      armyListRegistrationPush.registration.tournamentId + '/' + armyListRegistrationPush.registration.id);
    registrationRef.update({
      playerUploadedArmyLists: true,
      armyListsChecked: false
    });

    this.snackBar.open('ArmyList for Registration saved  successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  pushArmyListForTournamentPlayer(armyListTournamentPlayerPush: ArmyListTournamentPlayerPush) {

    const tournamentArmyListRef = this.afoDatabase.list('tournament-armyLists/' + armyListTournamentPlayerPush.armyList.tournamentId);
    tournamentArmyListRef.push(armyListTournamentPlayerPush.armyList);

    this.snackBar.open('Army List for TournamentPlayer saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  eraseArmyList(armyList: ArmyList) {
    const armyListRef = this.afoDatabase
      .list('tournament-armyLists/' + armyList.tournamentId + '/' + armyList.id);
    armyListRef.remove();

    this.snackBar.open('ArmyList deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  addDummyPlayer(tournamentId: string) {
    const dummy = new TournamentPlayer(tournamentId, '', '', '', 'DUMMY', '', '', '', '', 0, '');

    const tournamentPlayers = this.afoDatabase.list('tournament-players/' + tournamentId);
    tournamentPlayers.push(dummy);

    this.snackBar.open('Dummy Player successfully inserted', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  pushNewTournamentPlayer(player: TournamentPlayer) {

    const tournamentPlayers = this.afoDatabase.list('tournament-players/' + player.tournamentId);
    tournamentPlayers.push(player);

    this.snackBar.open('Tournament Player saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  pairAgainTournament(config: TournamentManagementConfiguration) {
    const newRankings: TournamentRanking[] = this.rankingService.pushRankingForRound(config);
    const successFullyPaired: boolean = this.tournamentGameService.createGamesForRound(config, newRankings);
    if (successFullyPaired) {
      this.snackBar.open('Round ' + config.round + ' paired again successfully ', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });

    } else {
      this.snackBar.open('Failed to pair Round ' + config.round + ' again. Check Pairing Options.', '', {
        extraClasses: ['snackBar-fail'],
        duration: 5000
      });
    }
  }

  pairAgainTeamTournament(config: TournamentManagementConfiguration) {

    // first delete all pairings.
    this.rankingService.eraseRankingsForRound(config);
    this.rankingService.pushRankingForRound(config);

    const newTeamRankings: TournamentRanking[] = this.rankingService.pushTeamRankingForRound(config);
    const successFullyPaired: boolean = this.tournamentGameService.createTeamGamesForRound(config, newTeamRankings);

    if (successFullyPaired) {
      this.snackBar.open('Round ' + config.round + ' paired again successfully ', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });

    } else {
      this.snackBar.open('Failed to pair Round ' + config.round + ' again. Check Pairing Options.', '', {
        extraClasses: ['snackBar-fail'],
        duration: 5000
      });
    }
  }

  pairNewRound(config: TournamentManagementConfiguration) {

    const newRankings: TournamentRanking[] = this.rankingService.pushRankingForRound(config);

    this.tournamentGameService.eraseGamesForRound(config);

    const successFullyPaired: boolean = this.tournamentGameService.createGamesForRound(config, newRankings);

    if (successFullyPaired) {
      const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
      registrationRef.update({actualRound: config.round, visibleRound: (config.round - 1 )});
      this.snackBar.open('new Round Paired', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });

    } else {
      this.snackBar.open('Failed to create Parings. Check Pairing Options.', '', {
        extraClasses: ['snackBar-fail'],
        duration: 5000
      });
    }
  }

  pairNewTeamTournamentRound(config: TournamentManagementConfiguration) {

    this.rankingService.pushRankingForRound(config);

    const newTeamRankings: TournamentRanking[] = this.rankingService.pushTeamRankingForRound(config);
    const successFullyPaired: boolean = this.tournamentGameService.createTeamGamesForRound(config, newTeamRankings);

    if (successFullyPaired) {
      const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
      registrationRef.update({actualRound: config.round, visibleRound: (config.round - 1 )});
      this.snackBar.open('new Round Paired', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });

    } else {
      this.snackBar.open('Failed to create Parings. Check Pairing Options.', '', {
        extraClasses: ['snackBar-fail'],
        duration: 5000
      });
    }
  }


  gameResultEntered(gameResult: GameResult) {

    const afoGames = this.afoDatabase.object('/tournament-games/' +  gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGames.update(gameResult.gameAfter);

    this.rankingService.updateRankingAfterGameResultEntered(gameResult);

    this.snackBar.open('Game Result Entered Successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  publishRound(publish: PublishRound) {

    const gameRef = this.afoDatabase.object('tournaments/' + publish.tournamentId);
    gameRef.update({visibleRound: publish.roundToPublish});

    this.snackBar.open('Round ' + publish.roundToPublish + ' successfully published', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }


  killRound(config: TournamentManagementConfiguration) {
    this.rankingService.eraseRankingsForRound(config);
    this.tournamentGameService.eraseGamesForRound(config);

    const tournament: AfoObjectObservable<Tournament> = this.afoDatabase.object('tournaments/' + config.tournamentId);
    tournament.update({actualRound: (config.round - 1), visibleRound: (config.round - 1)});

    this.snackBar.open('Round ' + config.round + ' successfully killed with fire!', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  killTeamRound(config: TournamentManagementConfiguration) {
    this.rankingService.eraseRankingsForRound(config);
    this.rankingService.eraseTeamRankingsForRound(config);
    this.tournamentGameService.eraseGamesForRound(config);
    this.tournamentGameService.eraseTeamGamesForRound(config);

    const tournament = this.afoDatabase.object('tournaments/' + config.tournamentId);
    tournament.update(
      {actualRound: (config.round - 1), visibleRound: (config.round - 1)});

    this.snackBar.open('Round ' + config.round + ' successfully killed with fire!', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  endTournament(config: TournamentManagementConfiguration) {
    this.rankingService.pushRankingForRound(config);

    const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      {finished: true, visibleRound: (config.round - 1)}
    );
    this.snackBar.open('Successfully end Tournament', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  endTeamTournament(config: TournamentManagementConfiguration) {
    this.rankingService.pushRankingForRound(config);
    this.rankingService.pushTeamRankingForRound(config);

    const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      {finished: true, visibleRound: (config.round - 1)}
    );
    this.snackBar.open('Successfully end TeamTournament', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  undoTournamentEnd(config: TournamentManagementConfiguration) {
    this.rankingService.eraseRankingsForRound(config);

    const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      {finished: false}
    );
    this.snackBar.open('Successfully undo end Tournament', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  swapPlayer(swapPlayer: SwapGames) {

    const game1: TournamentGame = swapPlayer.gameOne;

    const gameOneRef = this.afoDatabase.object('tournament-games/' + game1.tournamentId + '/' + game1.id);
    gameOneRef.update(game1);

    const game2: TournamentGame = swapPlayer.gameTwo;

    const gameTwoRef = this.afoDatabase.object('tournament-games/' + game1.tournamentId + '/' + game2.id);
    gameTwoRef.update(game2);

    this.snackBar.open('Successfully swap player', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  uploadTournament(tournamentId: string) {

    this.tournamentGameService.calculateEloForTournament();

    const registrationRef = this.afoDatabase.object('tournaments/' + tournamentId);
    registrationRef.update(
      {uploaded: true}
    );
    this.snackBar.open('Successfully upload Tournament', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  scenarioSelectedAction(scenarioSelected: ScenarioSelectedModel) {
    const query = this.afoDatabase.list('tournament-games/' + scenarioSelected.tournamentId).take(1);
    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-games/' + scenarioSelected.tournamentId + '/' + game.$key).
            update({'scenario': scenarioSelected.scenario});
        }
      });
    });
  }

  swapTeam(swapTeam: SwapGames) {

    this.tournamentGameService.newPlayerGamesForTeamMatch(swapTeam);

    const game1: TournamentGame = swapTeam.gameOne;

    const gameOneRef = this.afoDatabase.object('tournament-team-games/' + game1.tournamentId + '/' + game1.id);
    gameOneRef.update(game1);

    const game2: TournamentGame = swapTeam.gameTwo;

    const gameTwoRef = this.afoDatabase.object('tournament-team-games/' + game1.tournamentId + '/' + game2.id);
    gameTwoRef.update(game2);

    this.snackBar.open('Successfully swap teams', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  teamGameResultEntered(gameResult: GameResult) {

    const afoGames = this.afoDatabase.object('/tournament-games/' +  gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGames.update(gameResult.gameAfter);

    this.tournamentGameService.updateTeamMatchAfterGameResultEntered(gameResult);

    this.rankingService.updateRankingAfterGameResultEntered(gameResult);

    this.rankingService.updateTeamRankingAfterGameResultEntered(gameResult);

    this.snackBar.open('Game Result Entered Successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  scenarioSelectedTeamTournamentAction(scenarioSelected: ScenarioSelectedModel) {
    const playerGamesRef = this.afoDatabase.list('tournament-games/' + scenarioSelected.tournamentId).take(1);
    playerGamesRef.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-games/' + scenarioSelected.tournamentId + '/' + game.$key).
          update({'scenario': scenarioSelected.scenario});
        }
      });
    });

    const teamGamesRef = this.afoDatabase.list('tournament-team-games/' + scenarioSelected.tournamentId).take(1);
    teamGamesRef.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-team-games/' + scenarioSelected.tournamentId + '/' + game.$key).
          update({'scenario': scenarioSelected.scenario});
        }
      });
    });
  }

  undoTeamTournamentEnd(config: TournamentManagementConfiguration) {
    this.rankingService.eraseRankingsForRound(config);
    this.rankingService.eraseTeamRankingsForRound(config);

    const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
    registrationRef.update(
      {finished: false}
    );
    this.snackBar.open('Successfully undo end TeamTournament', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  uploadTeamTournament(tournamentId: string) {

    this.tournamentGameService.calculateEloForTournament();

    const registrationRef = this.afoDatabase.object('tournaments/' + tournamentId);
    registrationRef.update(
      {uploaded: true}
    );
    this.snackBar.open('Successfully upload Tournament', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  playerRegistrationChangeAction(regChange: PlayerRegistrationChange) {
    const registrationRef = this.afoDatabase.object('tournament-registrations/' +
      regChange.registration.tournamentId + '/' + regChange.registration.id);

     registrationRef.update({
      armyListsChecked: regChange.armyListsChecked,
      paymentChecked:  regChange.paymentChecked,
      playerMarkedPayment: regChange.playerMarkedPayment,
      playerUploadedArmyLists: regChange.playerUploadedArmyLists
    });

    this.snackBar.open('Successfully update Player Registration', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}
