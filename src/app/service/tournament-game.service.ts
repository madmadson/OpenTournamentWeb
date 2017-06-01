import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFireDatabase, FirebaseRef} from 'angularfire2';

import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import * as _ from 'lodash';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {
  AddTournamentGameAction, ChangeTournamentGameAction,
  DeleteTournamentGameAction,
  ClearTournamentGamesAction,
} from '../store/actions/tournament-games-actions';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {Tournament} from '../../../shared/model/tournament';
import {Registration} from '../../../shared/model/registration';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {TournamentTeamGamesConfiguration} from '../../../shared/dto/tournament-team-games-config';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {SwapGames} from '../../../shared/dto/swap-player';


@Injectable()
export class TournamentGameService implements OnDestroy {

  tournamentGamesRef: firebase.database.Reference;
  allRankings: TournamentRanking[];
  allPlayers: TournamentPlayer[];
  allTeams: TournamentTeam[];
  allGames: TournamentGame[];
  actualTournament: Tournament;
  allRegistrations: Registration[];

  private newGames: TournamentGame[];
  private newTeamGames: TournamentGame[];

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {

      this.actualTournament = state.actualTournament.actualTournament;
      this.allRankings = state.actualTournamentRankings.actualTournamentRankings;
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;
      this.allTeams = state.actualTournamentTeams.teams;
      this.allGames = state.actualTournamentGames.actualTournamentGames;
      this.allRegistrations = state.actualTournamentRegistrations.actualTournamentRegisteredPlayers;

    });
  }

  ngOnDestroy(): void {
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }
  }

  public subscribeOnTournamentGames(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearTournamentGamesAction());
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }

    console.log('subscribeOnTournamentGames');

    this.tournamentGamesRef = this.fb.database().ref('tournament-games/' + tournamentId);

    this.tournamentGamesRef.on('child_added', function (snapshot) {

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch(new AddTournamentGameAction(tournamentGame));

    });

    this.tournamentGamesRef.on('child_changed', function (snapshot) {

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentGameAction(tournamentGame));

    });

    this.tournamentGamesRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentGameAction(snapshot.key));

    });
  }


  createGamesForRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {

    this.eraseGamesForRound(config);

    const shuffledRankings = _.shuffle(newRankings);
    const sortedRankings = _.sortBy(shuffledRankings, ['score']);

    this.newGames = [];

    const megaSuccess = this.matchGame(config, sortedRankings);

    if (!megaSuccess) {
      return false;
    }


    const tournamentGamesRef = this.afoDatabase
      .list('tournament-games/' + config.tournamentId);

    const listOfTables = _.range(1, (this.newGames.length + 1));

    _.forEach(this.newGames, function (newGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newGame.playingField = tableNumber;
      tournamentGamesRef.push(newGame);
    });

    return true;

  }

  createMatchesForTeam(config: TournamentTeamGamesConfiguration) {

    const that = this;
    const allPlayerTeamOne: TournamentPlayer[] = [];
    const allPlayerTeamTwo: TournamentPlayer[] = [];

    this.newGames = [];

    _.each(this.allPlayers, function (player: TournamentPlayer) {
      if (player.teamName === config.teamOneName) {
        allPlayerTeamOne.push(player);
      } else if (player.teamName === config.teamTwoName) {
        allPlayerTeamTwo.push(player);
      }
    });

    _.each(allPlayerTeamOne, function (player: TournamentPlayer, index: number) {
      const newPlayerGame = new TournamentGame(
        config.tournamentId,
        player.playerId ? player.playerId : '', player.id,
        player.playerName, '', player.elo ? player.elo : 0, player.faction,
        0, 0, 0, '', 0, 0,
        allPlayerTeamTwo[index].playerId ? allPlayerTeamTwo[index].playerId : '',
        allPlayerTeamTwo[index].id,
        allPlayerTeamTwo[index].playerName,
        '',
        allPlayerTeamTwo[index].elo ? allPlayerTeamTwo[index].elo : 0,
        allPlayerTeamTwo[index].faction,
        0, 0, 0, '', 0, 0,
        config.round, index, false, '');

      that.newGames.push(newPlayerGame);
    });

    const tournamentGamesRef = this.afoDatabase
      .list('tournament-games/' + config.tournamentId);

    _.forEach(this.newGames, function (newGame: TournamentGame) {

      tournamentGamesRef.push(newGame);
    });

  }

  createTeamGamesForRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {

    const that = this;

    this.eraseGamesForRound(config);
    this.eraseTeamGamesForRound(config);

    const shuffledRankings = _.shuffle(newRankings);
    const sortedRankings = _.sortBy(shuffledRankings, ['score']);

    this.newTeamGames = [];

    const megaSuccess = this.matchTeamGames(config, sortedRankings);

    if (!megaSuccess) {
      return false;
    }

    const tournamentTeamGamesRef = this.afoDatabase
      .list('tournament-team-games/' + config.tournamentId);

    const tournamentPlayerGamesRef = this.afoDatabase
      .list('tournament-games/' + config.tournamentId);

    const listOfTables = _.range(1, (this.newTeamGames.length + 1));

    let teamOnePlayers = [];
    let teamTwoPlayers = [];

    _.forEach(this.newTeamGames, function (newGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newGame.playingField = tableNumber;
      tournamentTeamGamesRef.push(newGame);

      teamOnePlayers = _.filter(that.allPlayers, function (player: TournamentPlayer) {
        return newGame.playerOnePlayerName === player.teamName;
      });
      teamTwoPlayers = _.filter(that.allPlayers, function (player: TournamentPlayer) {
        return newGame.playerTwoPlayerName === player.teamName;
      });

      console.log('teamOnePlayers: ' + JSON.stringify(teamOnePlayers));
      console.log('teamTwoPlayers: ' + JSON.stringify(teamTwoPlayers));

      _.each(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {
        const newTeamGame = new TournamentGame(
          config.tournamentId,
          playerOne.playerId ? playerOne.playerId : '', playerOne.id,
          playerOne.playerName, playerOne.teamName,
          playerOne.elo ? playerOne.elo : 0, playerOne.faction,
          0, 0, 0, '', 0, 0,
          teamTwoPlayers[index].playerId ? teamTwoPlayers[index].playerId : '',
          teamTwoPlayers[index].id,
          teamTwoPlayers[index].playerName,
          teamTwoPlayers[index].teamName,
          teamTwoPlayers[index].elo ? teamTwoPlayers[index].elo : 0,
          teamTwoPlayers[index].faction,
          0, 0, 0, '', 0, 0,
          config.round, index + 1, false, '');

         tournamentPlayerGamesRef.push(newTeamGame);
      });

    });

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

    for (i = 0; i < (allRankingsToMatch.length - 1); i++) {

      const ranking1: TournamentRanking = allRankingsToMatch[i];

      for (j = i + 1; j < (allRankingsToMatch.length); j++) {

        const ranking2: TournamentRanking = allRankingsToMatch[j];

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
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

    const that = this;


    _.each(this.allRegistrations, function (reg: Registration) {

      const playersRegRef = that.afoDatabase.object('players-registrations/' + reg.playerId + '/' + reg.id);
      playersRegRef.remove();
    });

    const tournamentRegRef = that.afoDatabase.list('tournament-registrations/' + that.actualTournament.id);
    tournamentRegRef.remove();

    const playersEloChanges: EloChange[] = [];
    const gamesRef = this.afoDatabase.list('games');

    _.each(this.allGames, function (game: TournamentGame) {
      gamesRef.push(game);
      if (game.playerOnePlayerId) {
        const playersGamesTournamentRef = that.afoDatabase.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
        playersGamesTournamentRef.set(game);
      }
      if (game.playerTwoPlayerId) {
        const playersGamesTournamentRef = that.afoDatabase.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
        playersGamesTournamentRef.set(game);
      }

      if (game.playerOnePlayerId && game.playerTwoPlayerId) {
        const valueOnePlayerOne = ((game.playerOneElo - game.playerTwoElo) / 400);
        const valueTwoPlayerOne = 1 + Math.pow(10, valueOnePlayerOne);
        const expectancyValuePlayerOne = 1 / valueTwoPlayerOne;

        const valueOnePlayerTwo = ((game.playerTwoElo - game.playerOneElo) / 400);
        const valueTwoPlayerTwo = 1 + Math.pow(10, valueOnePlayerTwo);
        const expectancyValuePlayerTwo = 1 / valueTwoPlayerTwo;

        let newEloPlayerOne;
        let newEloPlayerTwo;

        if (game.playerOneScore > game.playerTwoScore) {
          newEloPlayerOne = Math.round(game.playerOneElo + 40 * (1 - expectancyValuePlayerOne));
        } else if (game.playerOneScore === game.playerTwoScore) {
          newEloPlayerOne = Math.round(game.playerOneElo + 40 * (0.5 - expectancyValuePlayerOne));
        } else {
          newEloPlayerOne = Math.round(game.playerOneElo + 40 * (0 - expectancyValuePlayerOne));
        }

        if (game.playerOneScore < game.playerTwoScore) {
          newEloPlayerTwo = Math.round(game.playerTwoElo + 40 * (1 - expectancyValuePlayerTwo));
        } else if (game.playerOneScore === game.playerTwoElo) {
          newEloPlayerTwo = Math.round(game.playerTwoElo + 40 * (0.5 - expectancyValuePlayerTwo));
        } else {
          newEloPlayerTwo = Math.round(game.playerTwoElo + 40 * (0 - expectancyValuePlayerTwo));
        }
        const playerOneGameTournamentRef = that.afoDatabase.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
        playerOneGameTournamentRef.update({
          'playerOneEloChanging': (newEloPlayerOne - game.playerOneElo),
          'playerTwoEloChanging': (newEloPlayerTwo - game.playerTwoElo)
        });

        const playerTwoGameTournamentRef = that.afoDatabase.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
        playerTwoGameTournamentRef.update({
          'playerOneEloChanging': (newEloPlayerOne - game.playerOneElo),
          'playerTwoEloChanging': (newEloPlayerTwo - game.playerTwoElo)
        });
        playersEloChanges.push({playerId: game.playerOnePlayerId, eloChange: (newEloPlayerOne - game.playerOneElo)});
        playersEloChanges.push({playerId: game.playerTwoPlayerId, eloChange: (newEloPlayerTwo - game.playerTwoElo)});
      }
    });

    _.each(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {

      if (tournamentPlayer.playerId) {
        const playersTournamentRef = that.afoDatabase.list('players-tournaments/' + tournamentPlayer.playerId);
        playersTournamentRef.push(that.actualTournament);

        let eloChangeForPlayer = 0;
        _.each(playersEloChanges, function (eloChange: EloChange) {

          if (tournamentPlayer.playerId === eloChange.playerId) {
            eloChangeForPlayer = eloChangeForPlayer + eloChange.eloChange;
          }
        });
        const finalNewElo = tournamentPlayer.elo + eloChangeForPlayer;

        const playerOneRef = that.afoDatabase.object('players/' + tournamentPlayer.playerId);
        playerOneRef.update({'elo': finalNewElo});
      }
    });
  }

  erasePlayerGamesForTeamMatch(swapTeam: SwapGames) {

    // TODO: erase team matches for both teams
  }
}

class EloChange {

  playerId: string;
  eloChange: number;

}
