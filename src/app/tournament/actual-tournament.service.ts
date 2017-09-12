import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {SET_ACTUAL_TOURNAMENT_ACTION, UNSET_ACTUAL_TOURNAMENT_ACTION} from './store/tournament-actions';
import {Registration} from '../../../shared/model/registration';
import {MdSnackBar} from '@angular/material';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyList} from '../../../shared/model/armyList';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import {GameResult} from '../../../shared/dto/game-result';
import {PublishRound} from '../../../shared/dto/publish-round';
import {RegistrationPush} from '../../../shared/dto/registration-push';
import {SwapGames} from '../../../shared/dto/swap-player';
import {TournamentGame} from '../../../shared/model/tournament-game';

import {ScenarioSelectedModel} from '../../../shared/dto/scenario-selected-model';

import * as _ from 'lodash';
import {AfoObjectObservable, AngularFireOfflineDatabase} from 'angularfire2-offline';
import {Tournament} from '../../../shared/model/tournament';
import {PlayerRegistrationChange} from '../../../shared/dto/playerRegistration-change';
import {ArmyListRegistrationPush} from '../../../shared/dto/armyList-registration-push';
import {ArmyListTournamentPlayerPush} from '../../../shared/dto/armyList-tournamentPlayer-push';
import {DropPlayerPush} from '../../../shared/dto/drop-player-push';
import {AppState} from '../store/reducers/index';
import {CoOrganizatorPush} from '../../../shared/dto/co-organizator-push';
import {ActualTournamentRankingService} from './actual-tournament-ranking.service';
import {ActualTournamentGamesService} from './actual-tournament-games.service';


@Injectable()
export class TournamentService {

  private actualTournamentRef: firebase.database.Reference;

  constructor(protected afoDatabase: AngularFireOfflineDatabase,
              protected rankingService: ActualTournamentRankingService,
              protected tournamentGameService: ActualTournamentGamesService,
              protected store: Store<AppState>,
              private snackBar: MdSnackBar) {
  }


  unsubscribeOnFirebase() {

    this.store.dispatch({type: UNSET_ACTUAL_TOURNAMENT_ACTION});

    if (this.actualTournamentRef) {
      this.actualTournamentRef.off();
    }
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    this.actualTournamentRef = firebase.database().ref('tournaments/' + tournamentId);

    this.actualTournamentRef.on('value', function (snapshot) {

      const tournament: Tournament = Tournament.fromJson(snapshot.val());
      tournament.id = snapshot.key;

      that.store.dispatch({type: SET_ACTUAL_TOURNAMENT_ACTION, payload: tournament});
    });
  }




  pushRegistration(registrationPush: RegistrationPush) {

    const tournamentRegRef = this.afoDatabase.list('tournament-registrations/' + registrationPush.tournament.id);
    const newRegistrationRef: firebase.database.Reference = tournamentRegRef.push(registrationPush.registration);

    const playerRegRef = this.afoDatabase.object('players-registrations/' + registrationPush.registration.playerId + '/' + newRegistrationRef.key);
    playerRegRef.set(registrationPush.registration);

    const tournamentRef = this.afoDatabase.object('tournaments/' + registrationPush.tournament.id);
    tournamentRef.update({actualParticipants: (registrationPush.tournament.actualParticipants + 1 )});

    if (registrationPush.tournament.teamSize > 0) {

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

    if (regPush.tournament.teamSize > 0) {

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


  pushNewTournamentPlayer(player: TournamentPlayer) {

    const tournamentPlayers = this.afoDatabase.list('tournament-players/' + player.tournamentId);
    tournamentPlayers.push(player);

    this.snackBar.open('Tournament Player saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  pairAgainRound(config: TournamentManagementConfiguration) {




    // const newRankings: TournamentRanking[] = this.rankingService.pushRankingForRound(config);
    // const successFullyPaired: boolean = this.tournamentGameService.createGamesForRound(config, newRankings);
    // if (successFullyPaired) {
      this.snackBar.open('Round ' + config.round + ' paired again successfully ', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });
    //
    // } else {
    //   this.snackBar.open('Failed to pair Round ' + config.round + ' again. Check Pairing Options.', '', {
    //     extraClasses: ['snackBar-fail'],
    //     duration: 5000
    //   });
    // }
  }

  pairAgainTeamTournament(config: TournamentManagementConfiguration) {

    // first delete and create new all player rankings.
    this.rankingService.eraseRankingsForRound(config);
    // this.rankingService.pushRankingForRound(config);

    // second delete and create new all team rankings.
    this.rankingService.eraseTeamRankingsForRound(config);
    const newTeamRankings: TournamentRanking[] = this.rankingService.pushTeamRankingForRound(config);

    // then do all pairings
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

    // const newRankings: TournamentRanking[] = this.rankingService.pushRankingForRound(config);

    this.tournamentGameService.eraseGamesForRound(config);

    // const successFullyPaired: boolean = this.tournamentGameService.createGamesForRound(config, newRankings);

    // if (successFullyPaired) {
      const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
      registrationRef.update({actualRound: config.round, visibleRound: (config.round - 1 )});
      this.snackBar.open('new Round Paired', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });

    // } else {
    //   this.snackBar.open('Failed to create Parings. Check Pairing Options.', '', {
    //     extraClasses: ['snackBar-fail'],
    //     duration: 5000
    //   });
    // }
  }

  pairNewTeamTournamentRound(config: TournamentManagementConfiguration) {

    // this.rankingService.pushRankingForRound(config);

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

    const afoGames = this.afoDatabase.object('/tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    afoGames.update(gameResult.gameAfter);

    // this.rankingService.updateRankingAfterGameResultEntered(gameResult, this.actualTournament.actualRound, false);

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

  endTournament(tournament: Tournament) {

    const registrationRef = this.afoDatabase.object('tournaments/' + tournament.id);
    registrationRef.update(
      {finished: true, visibleRound: (tournament.actualRound)}
    );


  }

  endTeamTournament(config: TournamentManagementConfiguration) {
     // this.rankingService.pushRankingForRound(config);
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

  undoTournamentEnd(tournament: Tournament) {


    const registrationRef = this.afoDatabase.object('tournaments/' + tournament.id);
    registrationRef.update(
      {finished: false}
    );

  }

  swapPlayer(swapPlayer: SwapGames) {

    const game1: TournamentGame = swapPlayer.gameOne;

    if (game1.playerOneTournamentPlayerId === 'bye') {
      game1.playerTwoScore = 1;
      game1.playerTwoControlPoints = 3;
      game1.playerTwoVictoryPoints = 38;
      game1.finished = true;
    }

    if (game1.playerTwoTournamentPlayerId === 'bye') {
      game1.playerOneScore = 1;
      game1.playerOneControlPoints = 3;
      game1.playerOneVictoryPoints = 38;
      game1.finished = true;
    }

    const gameOneRef = this.afoDatabase.object('tournament-games/' + game1.tournamentId + '/' + game1.id);
    gameOneRef.update(game1);

    const emptyGameBefore = _.cloneDeep(game1);

    // this.rankingService.updateRankingAfterGameResultEntered(
    //   {
    //     gameBefore: emptyGameBefore,
    //     gameAfter: game1
    //   },
    //   game1.tournamentRound,
    //   false
    // );

    const game2: TournamentGame = swapPlayer.gameTwo;

    if (game2.playerOneTournamentPlayerId === 'bye') {
      game2.playerTwoScore = 1;

      game2.playerTwoControlPoints = 3;
      game2.playerTwoVictoryPoints = 38;
      game2.finished = true;
    }

    if (game2.playerTwoTournamentPlayerId === 'bye') {
      game2.playerOneScore = 1;
      game2.playerOneControlPoints = 3;
      game2.playerOneVictoryPoints = 38;
      game2.finished = true;
    }

    const gameTwoRef = this.afoDatabase.object('tournament-games/' + game1.tournamentId + '/' + game2.id);
    gameTwoRef.update(game2);

    const emptyGame2Before = _.cloneDeep(game2);

    // this.rankingService.updateRankingAfterGameResultEntered(
    //   {
    //     gameBefore: emptyGame2Before,
    //     gameAfter: game2
    //   },
    //   game2.tournamentRound,
    //   false
    // );

    this.snackBar.open('Successfully swap player', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  uploadTournament(tournamentId: string) {


    const registrationRef = this.afoDatabase.object('tournaments/' + tournamentId);
    registrationRef.update(
      {uploaded: true}
    );
  }

  scenarioSelectedAction(scenarioSelected: ScenarioSelectedModel) {
    const query = this.afoDatabase.list('tournament-games/' + scenarioSelected.tournamentId).take(1);

    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-games/' + scenarioSelected.tournamentId + '/' + game.$key).update({'scenario': scenarioSelected.scenario});
        }
      });
    });
  }

  swapTeam(swapTeam: SwapGames) {

    // this.tournamentGameService.newPlayerGamesForTeamMatch(swapTeam);
    //
    // const game1: TournamentGame = swapTeam.gameOne;
    //
    // if (game1.playerOneTournamentPlayerId === 'bye') {
    //   game1.playerTwoScore = 1;
    //   game1.playerTwoIntermediateResult = this.actualTournament.teamSize;
    //   game1.playerTwoControlPoints = this.actualTournament.teamSize * 3;
    //   game1.playerTwoVictoryPoints = this.actualTournament.teamSize * 38;
    //   game1.finished = true;
    // }
    //
    // if (game1.playerTwoTournamentPlayerId === 'bye') {
    //   game1.playerOneScore = 1;
    //   game1.playerOneIntermediateResult = this.actualTournament.teamSize;
    //   game1.playerOneControlPoints = this.actualTournament.teamSize * 3;
    //   game1.playerOneVictoryPoints = this.actualTournament.teamSize * 38;
    //   game1.finished = true;
    // }
    // const gameOneRef = this.afoDatabase.object('tournament-team-games/' + game1.tournamentId + '/' + game1.id);
    // gameOneRef.update(game1);
    //
    // const game2: TournamentGame = swapTeam.gameTwo;
    //
    // if (game2.playerOneTournamentPlayerId === 'bye') {
    //   game2.playerTwoScore = 1;
    //   game2.playerTwoIntermediateResult = this.actualTournament.teamSize;
    //   game2.playerTwoControlPoints = this.actualTournament.teamSize * 3;
    //   game2.playerTwoVictoryPoints = this.actualTournament.teamSize * 38;
    //   game2.finished = true;
    // }
    //
    // if (game2.playerTwoTournamentPlayerId === 'bye') {
    //   game2.playerOneScore = 1;
    //   game2.playerOneIntermediateResult = this.actualTournament.teamSize;
    //   game2.playerOneControlPoints = this.actualTournament.teamSize * 3;
    //   game2.playerOneVictoryPoints = this.actualTournament.teamSize * 38;
    //   game2.finished = true;
    // }
    //
    // const gameTwoRef = this.afoDatabase.object('tournament-team-games/' + game1.tournamentId + '/' + game2.id);
    // gameTwoRef.update(game2);
    //
    // this.snackBar.open('Successfully swap teams', '', {
    //   extraClasses: ['snackBar-success'],
    //   duration: 5000
    // });
  }

  teamGameResultEntered(gameResult: GameResult) {

    // const afoGame = this.afoDatabase.object('/tournament-games/' + gameResult.gameAfter.tournamentId + '/' + gameResult.gameAfter.id);
    // afoGame.update(gameResult.gameAfter);
    //
    // this.tournamentGameService.updateTeamMatchAfterGameResultEntered(gameResult);
    //
    // // this.rankingService.updateRankingAfterGameResultEntered(gameResult, this.actualTournament.actualRound, false);
    //
    // this.rankingService.updateTeamRankingAfterGameResultEntered(gameResult, this.actualTournament.actualRound, false);
    //
    // this.snackBar.open('Game Result Entered Successfully', '', {
    //   extraClasses: ['snackBar-success'],
    //   duration: 5000
    // });
  }

  scenarioSelectedTeamTournamentAction(scenarioSelected: ScenarioSelectedModel) {
    const playerGamesRef = this.afoDatabase.list('tournament-games/' + scenarioSelected.tournamentId).take(1);
    playerGamesRef.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-games/' + scenarioSelected.tournamentId + '/' + game.$key).update({'scenario': scenarioSelected.scenario});
        }
      });
    });

    const teamGamesRef = this.afoDatabase.list('tournament-team-games/' + scenarioSelected.tournamentId).take(1);
    teamGamesRef.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-team-games/' + scenarioSelected.tournamentId + '/' + game.$key).update({'scenario': scenarioSelected.scenario});
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
      paymentChecked: regChange.paymentChecked,
      playerMarkedPayment: regChange.playerMarkedPayment,
      playerUploadedArmyLists: regChange.playerUploadedArmyLists
    });

    this.snackBar.open('Successfully update Player Registration', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  clearTeamGameResult(teamGameToClear: TournamentGame) {

    this.tournamentGameService.clearGameForTeamMatch(teamGameToClear);

    this.snackBar.open('Successfully reset TeamMatch', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  clearPlayerGameResult(playerGameToClear: TournamentGame) {

    // this.tournamentGameService.updatePlayerMatch(playerGameToClear);

    this.snackBar.open('Successfully reset Match', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  dropTeam(dropAction: DropPlayerPush) {
    const rankingRef = this.afoDatabase.object('tournament-team-rankings/' +
      dropAction.ranking.tournamentId + '/' + dropAction.ranking.id);

    rankingRef.update({
      droppedInRound: dropAction.round
    });

    const tournamentPlayerRef = this.afoDatabase.object('tournament-teams/' +
      dropAction.ranking.tournamentId + '/' + dropAction.ranking.tournamentPlayerId);

    tournamentPlayerRef.update({
      droppedInRound: dropAction.round
    });

    this.snackBar.open('Successfully drop Team', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  undoDropTeam(ranking: TournamentRanking) {

    const rankingRef = this.afoDatabase.object('tournament-team-rankings/' +
      ranking.tournamentId + '/' + ranking.id);

    rankingRef.update({
      droppedInRound: 0
    });

    const tournamentPlayerRef = this.afoDatabase.object('tournament-teams/' +
      ranking.tournamentId + '/' + ranking.tournamentPlayerId);

    tournamentPlayerRef.update({
      droppedInRound: 0
    });


    this.snackBar.open('Successfully undo drop Team', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  updateTournament(tournament: Tournament) {
    const tournamentRef = this.afoDatabase.object('tournaments/' + tournament.id);
    tournamentRef.set(tournament);

    this.snackBar.open('Tournament edited successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  addCoOrganizer(coOrganizer: CoOrganizatorPush) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + coOrganizer.tournament.id);

    if (coOrganizer.tournament.coOrganizators) {
      coOrganizer.tournament.coOrganizators.push(coOrganizer.coOrganizatorEmail);
    } else {
      coOrganizer.tournament.coOrganizators = [coOrganizer.coOrganizatorEmail];
    }

    tournamentRef.set(coOrganizer.tournament);

    this.snackBar.open('Co-Organizer added successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  deleteCoOrganizer(coOrganizer: CoOrganizatorPush) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + coOrganizer.tournament.id);

    if (coOrganizer.tournament.coOrganizators) {
      const indexOfSearchedEmail = _.findIndex(coOrganizer.tournament.coOrganizators, function (email) {
        return email === coOrganizer.coOrganizatorEmail;
      });
      coOrganizer.tournament.coOrganizators.splice(indexOfSearchedEmail, 1);
    }

    tournamentRef.set(coOrganizer.tournament);
    this.snackBar.open('Co-Organizer deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  startTournament(config: TournamentManagementConfiguration) {


    const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
    registrationRef.update({actualRound: config.round, visibleRound: (config.round - 1 )});
    this.snackBar.open('Tournament successfully started', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

  }

  newRound(config: TournamentManagementConfiguration) {
    const registrationRef = this.afoDatabase.object('tournaments/' + config.tournamentId);
    registrationRef.update({actualRound: config.round, visibleRound: (config.round - 1 )});
  }

  scenarioSelected(scenarioSelected: ScenarioSelectedModel) {
    const query = this.afoDatabase.list('tournament-games/' + scenarioSelected.tournamentId).take(1);

    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === scenarioSelected.round) {
          this.afoDatabase.object('tournament-games/' + scenarioSelected.tournamentId + '/' + game.$key).update({'scenario': scenarioSelected.scenario});
        }
      });
    });
  }
}
