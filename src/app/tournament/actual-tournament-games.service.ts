import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import * as _ from 'lodash';
import {TournamentGame} from '../../../shared/model/tournament-game';

import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {SwapGames} from '../../../shared/dto/swap-player';
import {GameResult} from '../../../shared/dto/game-result';
import {AppState} from '../store/reducers/index';

import {
  ADD_ACTUAL_TOURNAMENT_GAME_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION,
} from 'app/tournament/store/tournament-actions';
import {
  ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION,
  LOAD_TOURNAMENT_GAMES_FINISHED_ACTION
} from './store/tournament-actions';
import {ActualTournamentRankingService} from './actual-tournament-ranking.service';


@Injectable()
export class ActualTournamentGamesService {

  tournamentGamesRef: firebase.database.Reference;

  // allRankings: TournamentRanking[];
  // allTeamRankings: TournamentRanking[];
  // allPlayers: TournamentPlayer[];
  // allTeams: TournamentTeam[];
  // allGames: TournamentGame[];
  // allTeamGames: TournamentGame[];
  // actualTournament: Tournament;
  // allRegistrations: Registration[];

  private newGames: TournamentGame[];
  private newTeamGames: TournamentGame[];

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private rankingService: ActualTournamentRankingService) {

    // this.store.select(state => state).subscribe(state => {
    //
    //   this.actualTournament = state.actualTournament.actualTournament;
    //   this.allRankings = state.actualTournament.rankings;
    //   this.allTeamRankings = state.actualTournament.actualTournamentTeamRankings;
    //   this.allTeamGames = state.actualTournament.actualTournamentTeamGames;
    //   this.allPlayers = state.actualTournament.actualTournamentPlayers;
    //   this.allTeams = state.actualTournament.actualTournamentTeams;
    //   this.allGames = state.actualTournament.games;
    //   this.allRegistrations = state.actualTournament.actualTournamentRegisteredPlayers;
    //
    // });
  }

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION});
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }
  }


  public subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allGames: TournamentGame[] = [];
    let newItems = false;

    this.tournamentGamesRef = firebase.database().ref('tournament-games/' + tournamentId);

    this.tournamentGamesRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_GAME_ACTION, payload: tournamentGame});

    });

    this.tournamentGamesRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION, payload: tournamentGame});

    });

    this.tournamentGamesRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION, payload: snapshot.key});
    });

    this.tournamentGamesRef.once('value', function (snapshot) {


      snapshot.forEach(function (gameSnapshot) {

        const tournamentGame: TournamentGame = TournamentGame.fromJson(gameSnapshot.val());
        tournamentGame.id = gameSnapshot.key;
        allGames.push(tournamentGame);
        return false;
      });

    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENT_GAMES_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION, payload: allGames});
      newItems = true;
    });
  }


  createGamesForRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {

    const that = this;

    this.eraseGamesForRound(config);

    const shuffledRankings = _.shuffle(newRankings);
    const sortedRankings = _.orderBy(shuffledRankings, ['score'], ['desc']);

    const playerToMatchGamesFor = this.addByeIfPlayersUneven(sortedRankings);

    this.newGames = [];

    const megaSuccess = this.matchGame(config, playerToMatchGamesFor);

    if (!megaSuccess) {
      return false;
    }

    _.reverse(this.newGames);

    const tournamentGamesRef = this.afoDatabase
      .list('tournament-games/' + config.tournamentId);

    const listOfTables = _.range(1, (this.newGames.length + 1));

    _.forEach(this.newGames, function (newGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newGame.playingField = tableNumber;

      if (newGame.playerOneTournamentPlayerId === 'bye') {
        newGame.playerTwoScore = 1;
        newGame.playerTwoControlPoints = 3;
        newGame.playerTwoVictoryPoints = 38;
        newGame.finished = true;

        // that.rankingService.updateRankingAfterGameResultEntered(
        //   {
        //     gameBefore: newGame,
        //     gameAfter: newGame
        //   },
        //   newGame.tournamentRound,
        //   false
        // );

      }

      if (newGame.playerTwoTournamentPlayerId === 'bye') {
        newGame.playerOneScore = 1;
        newGame.playerOneControlPoints = 3;
        newGame.playerOneVictoryPoints = 38;
        newGame.finished = true;

        // that.rankingService.updateRankingAfterGameResultEntered(
        //   {
        //     gameBefore: newGame,
        //     gameAfter: newGame
        //   },
        //   newGame.tournamentRound,
        //   false
        // );
      }

      tournamentGamesRef.push(newGame);
    });

    return true;

  }


  createTeamGamesForRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {

    // const that = this;
    //
    // this.eraseGamesForRound(config);
    // this.eraseTeamGamesForRound(config);
    //
    // const shuffledRankings = _.shuffle(newRankings);
    // const sortedRankings = _.orderBy(shuffledRankings, ['score'], ['desc']);
    //
    // const playerToMatchGamesFor = this.addByeIfPlayersUneven(sortedRankings);
    //
    // this.newTeamGames = [];
    //
    // const megaSuccess = this.matchTeamGames(config, playerToMatchGamesFor);
    //
    // if (!megaSuccess) {
    //   return false;
    // }
    // _.reverse(this.newTeamGames);
    //
    // const tournamentTeamGamesRef = this.afoDatabase
    //   .list('tournament-team-games/' + config.tournamentId);
    //
    // const listOfTables = _.range(1, (this.newTeamGames.length + 1));
    //
    // _.forEach(this.newTeamGames, function (newTeamGame: TournamentGame) {
    //
    //   const randomIndex = Math.floor(Math.random() * listOfTables.length);
    //   const tableNumber: number = listOfTables[randomIndex];
    //   listOfTables.splice(randomIndex, 1);
    //   newTeamGame.playingField = tableNumber;
    //
    //   if (newTeamGame.playerOneTournamentPlayerId === 'bye') {
    //     newTeamGame.playerTwoScore = 1;
    //     newTeamGame.playerTwoIntermediateResult = that.actualTournament.teamSize;
    //     newTeamGame.playerTwoControlPoints = that.actualTournament.teamSize * 3;
    //     newTeamGame.playerTwoVictoryPoints = that.actualTournament.teamSize * 38;
    //     newTeamGame.finished = true;
    //   }
    //
    //   if (newTeamGame.playerTwoTournamentPlayerId === 'bye') {
    //     newTeamGame.playerOneScore = 1;
    //     newTeamGame.playerOneIntermediateResult = that.actualTournament.teamSize;
    //     newTeamGame.playerOneControlPoints = that.actualTournament.teamSize * 3;
    //     newTeamGame.playerOneVictoryPoints = that.actualTournament.teamSize * 38;
    //     newTeamGame.finished = true;
    //   }
    //
    //   tournamentTeamGamesRef.push(newTeamGame);
    //
    //   that.createPlayerGamesForTeamMatch(newTeamGame);

    // });

    return true;

  }

  private matchGame(config: TournamentManagementConfiguration, allRankingsToMatch: TournamentRanking[]): boolean {

    const gamesToCalculate = allRankingsToMatch.length;
    if (gamesToCalculate === 0) {
      return true;
    }

    let i: number;
    let j: number;
    for (i = 0; i < (allRankingsToMatch.length - 1); i++) {

      const ranking1: TournamentRanking = allRankingsToMatch[i];

      for (j = i + 1; j < (allRankingsToMatch.length); j++) {

        const ranking2: TournamentRanking = allRankingsToMatch[j];

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          }) || _.find(ranking2.opponentTournamentPlayerIds,
          function (player2OpponentTournamentPlayerId: string) {
            return player2OpponentTournamentPlayerId === ranking1.tournamentPlayerId;
          });

        let inSameTeam = false;
        if (config.teamRestriction) {
          if (ranking1.teamName && ranking2.teamName) {
            inSameTeam = ranking1.teamName.trim().toLowerCase() === ranking2.teamName.trim().toLowerCase();
          }
        }

        let sameMeta = false;
        if (config.metaRestriction) {
          if (ranking1.meta && ranking2.meta) {
            sameMeta = ranking1.meta.trim().toLowerCase() === ranking2.meta.trim().toLowerCase();
          }
        }

        let sameOrigin = false;
        if (config.originRestriction) {
          if (ranking1.origin && ranking2.origin) {
            sameOrigin = ranking1.origin.trim().toLowerCase() === ranking2.origin.trim().toLowerCase();
          }
        }

        let sameCountry = false;
        if (config.countryRestriction) {
          if (ranking1.country && ranking2.country) {
            sameCountry = ranking1.country === ranking2.country;
          }
        }

        if (alreadyPlayingAgainstEachOther || inSameTeam || sameMeta || sameOrigin || sameCountry) {
          continue;
        }

        if (ranking1.score - 1 > ranking2.score) {
          continue;
        }
        const newCopiedRankings: TournamentRanking[] = _.cloneDeep(allRankingsToMatch);

        _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
            player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchGame(config, newCopiedRankings);

        if (success) {
          const newGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.teamName, ranking1.elo, ranking1.faction,
            0, 0, 0, '', 0, 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.teamName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0, 0,
            config.round, (gamesToCalculate / 2), false, '');
          this.newGames.push(newGame);

          return true;
        }
      }
    }

    this.newGames = [];

    for (i = 0; i < (allRankingsToMatch.length - 1); i++) {

      const ranking1: TournamentRanking = allRankingsToMatch[i];

      for (j = i + 1; j < (allRankingsToMatch.length); j++) {

        const ranking2: TournamentRanking = allRankingsToMatch[j];

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          }) || _.find(ranking2.opponentTournamentPlayerIds,
          function (player2OpponentTournamentPlayerId: string) {
            return player2OpponentTournamentPlayerId === ranking1.tournamentPlayerId;
          });


        if (alreadyPlayingAgainstEachOther) {
          continue;
        }

        if (ranking1.score - 1 > ranking2.score) {
          continue;
        }
        const newCopiedRankings: TournamentRanking[] = _.cloneDeep(allRankingsToMatch);

        _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
            player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchGame(config, newCopiedRankings);

        if (success) {
          const newGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.teamName, ranking1.elo, ranking1.faction,
            0, 0, 0, '', 0, 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.teamName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0, 0,
            config.round, (gamesToCalculate / 2), false, '');
          this.newGames.push(newGame);

          return true;
        }
      }
    }

    this.newGames = [];

    for (i = 0; i < (allRankingsToMatch.length - 1); i++) {

      const ranking1: TournamentRanking = allRankingsToMatch[i];

      for (j = i + 1; j < (allRankingsToMatch.length); j++) {

        const ranking2: TournamentRanking = allRankingsToMatch[j];

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          }) || _.find(ranking2.opponentTournamentPlayerIds,
          function (player2OpponentTournamentPlayerId: string) {
            return player2OpponentTournamentPlayerId === ranking1.tournamentPlayerId;
          });


        if (alreadyPlayingAgainstEachOther) {
          continue;
        }


        const newCopiedRankings: TournamentRanking[] = _.cloneDeep(allRankingsToMatch);

        _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
            player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchGame(config, newCopiedRankings);

        if (success) {
          const newGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.teamName, ranking1.elo, ranking1.faction,
            0, 0, 0, '', 0, 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.teamName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0, 0,
            config.round, (gamesToCalculate / 2), false, '');
          this.newGames.push(newGame);

          return true;
        }
      }
    }

    return false;
  }

  private matchTeamGames(config: TournamentManagementConfiguration, copiedRankings: TournamentRanking[]): boolean {

    const gamesToCalculate = copiedRankings.length;
    if (gamesToCalculate === 0) {
      return true;
    }

    let i: number;
    let j: number;
    for (i = 0; i < (gamesToCalculate - 1); i++) {

      const ranking1: TournamentRanking = copiedRankings[i];

      for (j = i + 1; j < (gamesToCalculate); j++) {

        const ranking2: TournamentRanking = copiedRankings[j];
        if (!ranking2) {
          console.log('failed');
          continue;
        }

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {

            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          });


        let sameMeta = false;
        if (config.metaRestriction) {
          if (ranking1.meta && ranking2.meta) {
            sameMeta = ranking1.meta.trim().toLowerCase() === ranking2.meta.trim().toLowerCase();
          }
        }

        let sameCountry = false;
        if (config.countryRestriction) {
          if (ranking1.country && ranking2.country) {
            sameCountry = ranking1.country === ranking2.country;
          }
        }

        if (alreadyPlayingAgainstEachOther || sameMeta || sameCountry) {
          continue;
        }

        if (ranking1.score - 1 > ranking2.score) {
          continue;
        }
        const newCopiedRankings: TournamentRanking[] = copiedRankings;

        _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
            player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchTeamGames(config, newCopiedRankings);

        if (success) {
          const newTeamGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.teamName, ranking1.elo, ranking1.faction,
            0, 0, 0, '', 0, 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.teamName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0, 0,
            config.round, (gamesToCalculate / 2), false, '');

          this.newTeamGames.push(newTeamGame);

          return true;
        }
      }
    }

    this.newTeamGames = [];

    for (i = 0; i < (gamesToCalculate - 1); i++) {

      const ranking1: TournamentRanking = copiedRankings[i];

      for (j = i + 1; j < (gamesToCalculate); j++) {

        const ranking2: TournamentRanking = copiedRankings[j];
        if (!ranking2) {
          console.log('failed');
          continue;
        }

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {

            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          });


        if (alreadyPlayingAgainstEachOther) {
          continue;
        }

        if (ranking1.score - 1 > ranking2.score) {
          continue;
        }
        const newCopiedRankings: TournamentRanking[] = copiedRankings;

        _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
            player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchTeamGames(config, newCopiedRankings);

        if (success) {
          const newTeamGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.teamName, ranking1.elo, ranking1.faction,
            0, 0, 0, '', 0, 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.teamName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0, 0,
            config.round, (gamesToCalculate / 2), false, '');

          this.newTeamGames.push(newTeamGame);

          return true;
        }
      }
    }

    this.newTeamGames = [];

    for (i = 0; i < (gamesToCalculate - 1); i++) {

      const ranking1: TournamentRanking = copiedRankings[i];

      for (j = i + 1; j < (gamesToCalculate); j++) {

        const ranking2: TournamentRanking = copiedRankings[j];
        if (!ranking2) {
          console.log('failed');
          continue;
        }

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {

            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          });

        if (alreadyPlayingAgainstEachOther) {
          continue;
        }

        const newCopiedRankings: TournamentRanking[] = copiedRankings;

        _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
            player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchTeamGames(config, newCopiedRankings);

        if (success) {
          const newTeamGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.teamName, ranking1.elo, ranking1.faction,
            0, 0, 0, '', 0, 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.teamName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0, 0,
            config.round, (gamesToCalculate / 2), false, '');

          this.newTeamGames.push(newTeamGame);

          return true;
        }
      }
    }

    return false;
  }

  eraseGamesForRound(config: TournamentManagementConfiguration) {

    const query = this.afoDatabase.list('tournament-games/' + config.tournamentId).take(1);
    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-games/' + config.tournamentId + '/' + game.$key).remove();
        }
      });
    });
  }

  eraseTeamGamesForRound(config: TournamentManagementConfiguration) {

    const teamQueryRef = this.afoDatabase.list('tournament-team-games/' + config.tournamentId).take(1);
    teamQueryRef.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-team-games/' + config.tournamentId + '/' + game.$key).remove();
        }
      });
    });
  }

  calculateEloForTournament() {

    // const that = this;
    //
    // _.each(this.allRegistrations, function (reg: Registration) {
    //
    //   const playersRegRef = that.afoDatabase.object('players-registrations/' + reg.playerId + '/' + reg.id);
    //   playersRegRef.remove();
    // });
    //
    // const tournamentRegRef = that.afoDatabase.list('tournament-registrations/' + that.actualTournament.id);
    // tournamentRegRef.remove();
    //
    // const playersEloChanges: EloChange[] = [];
    // const gamesRef = this.afoDatabase.list('games');
    //
    // _.each(this.allGames, function (game: TournamentGame) {
    //   gamesRef.push(game);
    //   if (game.playerOnePlayerId) {
    //     const playersGamesTournamentRef = that.afoDatabase.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
    //     playersGamesTournamentRef.set(game);
    //   }
    //   if (game.playerTwoPlayerId) {
    //     const playersGamesTournamentRef = that.afoDatabase.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
    //     playersGamesTournamentRef.set(game);
    //   }
    //
    //   if (game.playerOnePlayerId && game.playerTwoPlayerId) {
    //     const eloDifferenceForPlayerOne = game.playerTwoElo - game.playerOneElo;
    //     const percentagePlayerOne = 1 / (1 + Math.pow(10, (eloDifferenceForPlayerOne / 400)));
    //
    //     const eloDifferenceForPlayerTwo = game.playerOneElo - game.playerTwoElo;
    //     const percentagePlayerTwo = 1 / ( 1 + Math.pow(10, (eloDifferenceForPlayerTwo / 400)));
    //
    //     let newEloPlayerOne;
    //     let newEloPlayerTwo;
    //
    //     let eloFactor: number = getEloFactorForPlayer(game.playerOneElo);
    //
    //     if (game.playerOneScore > game.playerTwoScore) {
    //       newEloPlayerOne = game.playerOneElo + (Math.round(eloFactor * (1 - percentagePlayerOne)));
    //     } else if (game.playerOneScore === game.playerTwoScore) {
    //       newEloPlayerOne = game.playerOneElo + (Math.round(eloFactor * (0.5 - percentagePlayerOne)));
    //     } else {
    //       newEloPlayerOne = game.playerOneElo + (Math.round(eloFactor * (0 - percentagePlayerOne)));
    //     }
    //
    //     eloFactor = getEloFactorForPlayer(game.playerTwoElo);
    //
    //     if (game.playerOneScore < game.playerTwoScore) {
    //       newEloPlayerTwo = game.playerTwoElo + ( Math.round(eloFactor * (1 - percentagePlayerTwo)));
    //     } else if (game.playerOneScore === game.playerTwoElo) {
    //       newEloPlayerTwo = game.playerTwoElo + (Math.round(eloFactor * (0.5 - percentagePlayerTwo)));
    //     } else {
    //       newEloPlayerTwo = game.playerTwoElo + (Math.round(eloFactor * (0 - percentagePlayerTwo)));
    //     }
    //     const playerOneGameTournamentRef = that.afoDatabase.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
    //     playerOneGameTournamentRef.update({
    //       'playerOneEloChanging': (newEloPlayerOne - game.playerOneElo),
    //       'playerTwoEloChanging': (newEloPlayerTwo - game.playerTwoElo)
    //     });
    //
    //     const playerTwoGameTournamentRef = that.afoDatabase.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
    //     playerTwoGameTournamentRef.update({
    //       'playerOneEloChanging': (newEloPlayerOne - game.playerOneElo),
    //       'playerTwoEloChanging': (newEloPlayerTwo - game.playerTwoElo)
    //     });
    //     playersEloChanges.push({playerId: game.playerOnePlayerId, eloChange: (newEloPlayerOne - game.playerOneElo)});
    //     playersEloChanges.push({playerId: game.playerTwoPlayerId, eloChange: (newEloPlayerTwo - game.playerTwoElo)});
    //   }
    // });
    //
    // _.each(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {
    //
    //   if (tournamentPlayer.playerId) {
    //     const playersTournamentRef = that.afoDatabase.list('players-tournaments/' + tournamentPlayer.playerId);
    //     playersTournamentRef.push(that.actualTournament);
    //
    //     let eloChangeForPlayer = 0;
    //     _.each(playersEloChanges, function (eloChange: EloChange) {
    //
    //       if (tournamentPlayer.playerId === eloChange.playerId) {
    //         eloChangeForPlayer = eloChangeForPlayer + eloChange.eloChange;
    //       }
    //     });
    //     const finalNewElo = tournamentPlayer.elo + eloChangeForPlayer;
    //
    //     const playerOneRef = that.afoDatabase.object('players/' + tournamentPlayer.playerId);
    //     playerOneRef.update({'elo': finalNewElo});
    //   }
    // });
  }


  newPlayerGamesForTeamMatch(swapTeam: SwapGames) {

    // const that = this;
    //
    // _.each(this.allGames, function (game: TournamentGame) {
    //   if (game.tournamentRound === swapTeam.gameOne.tournamentRound) {
    //     if (game.playerOneTeamName === swapTeam.gameOne.playerOnePlayerName ||
    //       game.playerTwoTeamName === swapTeam.gameOne.playerOnePlayerName ||
    //       game.playerOneTeamName === swapTeam.gameOne.playerTwoPlayerName ||
    //       game.playerTwoTeamName === swapTeam.gameOne.playerTwoPlayerName ||
    //       game.playerOneTeamName === swapTeam.gameTwo.playerOnePlayerName ||
    //       game.playerTwoTeamName === swapTeam.gameTwo.playerOnePlayerName ||
    //       game.playerOneTeamName === swapTeam.gameTwo.playerTwoPlayerName ||
    //       game.playerTwoTeamName === swapTeam.gameTwo.playerTwoPlayerName) {
    //
    //       const playerGame = that.afoDatabase.object('tournament-games/' + swapTeam.gameOne.tournamentId + '/' + game.id);
    //       playerGame.remove();
    //     }
    //   }
    // });
    //
    // this.createPlayerGamesForTeamMatch(swapTeam.gameOne);
    // this.createPlayerGamesForTeamMatch(swapTeam.gameTwo);
  }


  createPlayerGamesForTeamMatch(teamMatch: TournamentGame) {

    // const that = this;
    //
    // const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);
    //
    // const teamOnePlayers = _.filter(this.allPlayers, function (player: TournamentPlayer) {
    //   return teamMatch.playerOnePlayerName === player.teamName;
    // });
    // const teamTwoPlayers = _.filter(this.allPlayers, function (player: TournamentPlayer) {
    //   return teamMatch.playerTwoPlayerName === player.teamName;
    // });
    //
    // if (teamMatch.playerOneTournamentPlayerId === 'bye') {
    //   _.each(teamTwoPlayers, function (playerTwo: TournamentPlayer, index: number) {
    //     const newTeamGame = new TournamentGame(
    //       teamMatch.tournamentId,
    //       '',
    //       'bye',
    //       'Bye',
    //       'Bye',
    //       0,
    //       '',
    //       0, 0, 0, '', 0, 0,
    //       playerTwo.playerId ? playerTwo.playerId : '', playerTwo.id,
    //       playerTwo.playerName, playerTwo.teamName,
    //       playerTwo.elo ? playerTwo.elo : 0, playerTwo.faction,
    //       0, 0, 0, '', 0, 0,
    //       teamMatch.tournamentRound, index + 1, true, '');
    //
    //     teamGamesRef.push(newTeamGame);
    //
    //     const emptyGameBefore = _.cloneDeep(newTeamGame);
    //
    //     emptyGameBefore.playerTwoScore = 0;
    //     emptyGameBefore.playerTwoControlPoints = 0;
    //     emptyGameBefore.playerTwoVictoryPoints = 0;
    //     emptyGameBefore.finished = false;
    //
    //     that.rankingService.updateTeamRankingAfterGameResultEntered(
    //       {
    //         gameBefore: emptyGameBefore,
    //         gameAfter: newTeamGame
    //       },
    //       newTeamGame.tournamentRound,
    //       false
    //     );
    //     that.rankingService.updateRankingAfterGameResultEntered(
    //       {
    //         gameBefore: emptyGameBefore,
    //         gameAfter: newTeamGame
    //       },
    //       newTeamGame.tournamentRound,
    //       false
    //     );
    //   });
    // }
    //
    // if (teamMatch.playerTwoTournamentPlayerId === 'bye') {
    //   _.each(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {
    //     const newTeamGame = new TournamentGame(
    //       teamMatch.tournamentId,
    //       playerOne.playerId ? playerOne.playerId : '', playerOne.id,
    //       playerOne.playerName, playerOne.teamName,
    //       playerOne.elo ? playerOne.elo : 0, playerOne.faction,
    //       1, 3, 38, '', 0, 0,
    //       '',
    //       'bye',
    //       'Bye',
    //       'Bye',
    //       0,
    //       '',
    //       0, 0, 0, '', 0, 0,
    //       teamMatch.tournamentRound, index + 1, true, '');
    //
    //     teamGamesRef.push(newTeamGame);
    //
    //     const emptyGameBefore = _.cloneDeep(newTeamGame);
    //
    //     emptyGameBefore.playerOneScore = 0;
    //     emptyGameBefore.playerOneControlPoints = 0;
    //     emptyGameBefore.playerOneVictoryPoints = 0;
    //     emptyGameBefore.finished = false;
    //
    //     that.rankingService.updateTeamRankingAfterGameResultEntered(
    //       {
    //         gameBefore: emptyGameBefore,
    //         gameAfter: newTeamGame
    //       },
    //       newTeamGame.tournamentRound,
    //       false
    //     );
    //
    //     that.rankingService.updateRankingAfterGameResultEntered(
    //       {
    //         gameBefore: emptyGameBefore,
    //         gameAfter: newTeamGame
    //       },
    //       newTeamGame.tournamentRound,
    //       false
    //     );
    //   });
    // }
    // if (teamMatch.playerOneTournamentPlayerId !== 'bye' && teamMatch.playerTwoTournamentPlayerId !== 'bye') {
    //   _.each(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {
    //
    //     const newTeamGame = new TournamentGame(
    //       teamMatch.tournamentId,
    //       playerOne.playerId ? playerOne.playerId : '', playerOne.id,
    //       playerOne.playerName, playerOne.teamName,
    //       playerOne.elo ? playerOne.elo : 0, playerOne.faction,
    //       0, 0, 0, '', 0, 0,
    //       teamTwoPlayers[index].playerId ? teamTwoPlayers[index].playerId : '',
    //       teamTwoPlayers[index].id,
    //       teamTwoPlayers[index].playerName,
    //       teamTwoPlayers[index].teamName,
    //       teamTwoPlayers[index].elo ? teamTwoPlayers[index].elo : 0,
    //       teamTwoPlayers[index].faction,
    //       0, 0, 0, '', 0, 0,
    //       teamMatch.tournamentRound, index + 1, false, '');
    //
    //     teamGamesRef.push(newTeamGame);
    //   });
    // }
  }

  clearGameForTeamMatch(teamMatch: TournamentGame) {

    // const that = this;
    //
    // const tournamentTeamGamesRef = this.afoDatabase
    //   .object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);
    //
    // tournamentTeamGamesRef.update({
    //   'playerOneScore': 0,
    //   'playerOneIntermediateResult': 0,
    //   'playerOneControlPoints': 0,
    //   'playerOneVictoryPoints': 0,
    //   'playerTwoScore': 0,
    //   'playerTwoIntermediateResult': 0,
    //   'playerTwoControlPoints': 0,
    //   'playerTwoVictoryPoints': 0,
    //   'finished': false
    // });
    //
    // const teamOneGames = _.filter(this.allGames, function (game: TournamentGame) {
    //   return teamMatch.playerOnePlayerName === game.playerOneTeamName &&
    //          teamMatch.tournamentRound === game.tournamentRound;
    // });
    //
    // _.each(teamOneGames, function (game: TournamentGame) {
    //
    //   const playerGameRef = that.afoDatabase.object('tournament-games/' + game.tournamentId  + '/' + game.id);
    //
    //   const gameBefore = _.cloneDeep(game);
    //
    //   game.playerOneScore = 0;
    //   game.playerOneControlPoints = 0;
    //   game.playerOneVictoryPoints = 0;
    //   game.playerOneArmyList = '';
    //   game.playerTwoScore = 0;
    //   game.playerTwoControlPoints = 0;
    //   game.playerTwoVictoryPoints = 0;
    //   game.playerTwoArmyList = '';
    //   game.finished = false;
    //
    //   playerGameRef.update(game);
    //
    //   that.rankingService.updateTeamRankingAfterGameResultEntered(
    //     {
    //       gameBefore: gameBefore,
    //       gameAfter: game
    //     },
    //     game.tournamentRound,
    //     true
    //   );
    //
    // });

  }

  updateTeamMatchAfterGameResultEntered(gameResult: GameResult) {

    // const that = this;
    //
    // let teamMatchFinished = true;
    //
    // _.each(this.allGames, function (playerGame: TournamentGame) {
    //
    //   if (playerGame.tournamentRound === gameResult.gameAfter.tournamentRound &&
    //     playerGame.playerOneTeamName === gameResult.gameAfter.playerOneTeamName) {
    //
    //     if (!playerGame.finished) {
    //       teamMatchFinished = false;
    //     }
    //   }
    // });
    //
    // let teamOneWon = 0;
    // let teamTwoWon = 0;
    //
    // _.each(this.allTeamGames, function (teamMatch: TournamentGame) {
    //
    //   if (teamMatch.tournamentRound === gameResult.gameAfter.tournamentRound &&
    //     (teamMatch.playerOnePlayerName === gameResult.gameAfter.playerOneTeamName ||
    //     teamMatch.playerOnePlayerName === gameResult.gameAfter.playerTwoTeamName)) {
    //
    //     if (!gameResult.gameBefore.finished) {
    //
    //       if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore) >
    //         (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore))) {
    //
    //         teamOneWon = 1;
    //       }
    //       if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore) <
    //         (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore))) {
    //
    //         teamTwoWon = 1;
    //       }
    //
    //       const teamMatchRef = that.afoDatabase.object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);
    //       teamMatchRef.update({
    //         'playerOneIntermediateResult': teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore,
    //         'playerOneControlPoints': teamMatch.playerOneControlPoints + gameResult.gameAfter.playerOneControlPoints,
    //         'playerOneVictoryPoints': teamMatch.playerOneVictoryPoints + gameResult.gameAfter.playerOneVictoryPoints,
    //         'playerOneScore': teamMatchFinished ? teamOneWon : '0',
    //         'playerTwoIntermediateResult': teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore,
    //         'playerTwoControlPoints': teamMatch.playerTwoControlPoints + gameResult.gameAfter.playerTwoControlPoints,
    //         'playerTwoVictoryPoints': teamMatch.playerTwoVictoryPoints + gameResult.gameAfter.playerTwoVictoryPoints,
    //         'playerTwoScore': teamMatchFinished ? teamTwoWon : '0',
    //         'finished': teamMatchFinished
    //       });
    //     } else {
    //
    //       if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore) >
    //         (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore))) {
    //
    //         teamOneWon = 1;
    //       }
    //       if (teamMatchFinished && ((teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore) <
    //         (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore))) {
    //
    //         teamTwoWon = 1;
    //       }
    //
    //       const teamMatchRef = that.afoDatabase.object('tournament-team-games/' + teamMatch.tournamentId + '/' + teamMatch.id);
    //       teamMatchRef.update({
    //         'playerOneIntermediateResult': (teamMatch.playerOneIntermediateResult + gameResult.gameAfter.playerOneScore - gameResult.gameBefore.playerOneScore),
    //         'playerOneControlPoints': (teamMatch.playerOneControlPoints + gameResult.gameAfter.playerOneControlPoints - gameResult.gameBefore.playerOneControlPoints),
    //         'playerOneVictoryPoints': (teamMatch.playerOneVictoryPoints + gameResult.gameAfter.playerOneVictoryPoints - gameResult.gameBefore.playerOneVictoryPoints),
    //         'playerOneScore': teamMatchFinished ? teamOneWon : '0',
    //         'playerTwoIntermediateResult': (teamMatch.playerTwoIntermediateResult + gameResult.gameAfter.playerTwoScore - gameResult.gameBefore.playerTwoScore),
    //         'playerTwoControlPoints': (teamMatch.playerTwoControlPoints + gameResult.gameAfter.playerTwoControlPoints - gameResult.gameBefore.playerTwoControlPoints),
    //         'playerTwoVictoryPoints': (teamMatch.playerTwoVictoryPoints + gameResult.gameAfter.playerTwoVictoryPoints - gameResult.gameBefore.playerTwoVictoryPoints),
    //         'playerTwoScore': teamMatchFinished ? teamTwoWon : '0',
    //         'finished': teamMatchFinished
    //       });
    //     }
    //   }
    // });
  }

  private addByeIfPlayersUneven(sortedRankings: TournamentRanking[]): TournamentRanking[] {

    const notDroppedPlayers = _.filter(sortedRankings, function (rank: TournamentRanking) {
      return (rank.droppedInRound === 0);
    });

    if (notDroppedPlayers.length % 2) {
      const bye = new TournamentRanking(
        sortedRankings[0].tournamentId,
        'bye',
        '',
        'BYE',
        '',
        '',
        '',
        '',
        '',
        0,
        0, 0, 0, 0, 0, 1, [], 0);

      notDroppedPlayers.push(bye);
    }

    return notDroppedPlayers;
  }

  updatePlayerMatch(game: TournamentGame) {

    const playerGameRef = this.afoDatabase
      .object('tournament-games/' + game.tournamentId + '/' + game.id);
    playerGameRef.update(game);

  }

  pushGamesForFirstRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {
    const that = this;

    const shuffledRankings = _.shuffle(newRankings);
    const sortedRankings = _.orderBy(shuffledRankings, ['score'], ['desc']);

    const playerToMatchGamesFor = this.addByeIfPlayersUneven(sortedRankings);

    this.newGames = [];

    const megaSuccess = this.matchGame(config, playerToMatchGamesFor);

    if (!megaSuccess) {
      return false;
    }

    _.reverse(this.newGames);

    const tournamentGamesRef = this.afoDatabase
      .list('tournament-games/' + config.tournamentId);

    const listOfTables = _.range(1, (this.newGames.length + 1));

    _.forEach(this.newGames, function (newGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newGame.playingField = tableNumber;

      if (newGame.playerOneTournamentPlayerId === 'bye') {
        newGame.playerTwoScore = 1;
        newGame.playerTwoControlPoints = 3;
        newGame.playerTwoVictoryPoints = 38;
        newGame.finished = true;

        // that.rankingService.updateRankingAfterGameResultEntered(
        //   {
        //     gameBefore: newGame,
        //     gameAfter: newGame
        //   },
        //   newGame.tournamentRound,
        //   false
        // );

      }

      if (newGame.playerTwoTournamentPlayerId === 'bye') {
        newGame.playerOneScore = 1;
        newGame.playerOneControlPoints = 3;
        newGame.playerOneVictoryPoints = 38;
        newGame.finished = true;

        // that.rankingService.updateRankingAfterGameResultEntered(
        //   {
        //     gameBefore: newGame,
        //     gameAfter: newGame
        //   },
        //   newGame.tournamentRound,
        //   false
        // );
      }

      tournamentGamesRef.push(newGame);
    });

    return true;
  }

  killGamesForRound(config: TournamentManagementConfiguration) {

    const query = this.afoDatabase.list('tournament-games/' + config.tournamentId).take(1);
    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-games/' + config.tournamentId + '/' + game.$key).remove();
        }
      });
    });
  }

}


