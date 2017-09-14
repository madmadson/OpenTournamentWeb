import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {GameMatchingService} from './game-matching.service';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {PublishRound} from '../../../shared/dto/publish-round';
import {Observable} from 'rxjs/Observable';
import {TournamentService} from './actual-tournament.service';
import {Router} from '@angular/router';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {Tournament} from '../../../shared/model/tournament';

@Injectable()
export class PairingService {


  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private tournamentService: TournamentService,
              private gameMatchingService: GameMatchingService,
              private router: Router) {
  }


  pushRankingForRound(config: TournamentManagementConfiguration,
                      allPlayers: TournamentPlayer[],
                      allRankings: TournamentRanking[]): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    const lastRoundRankings: TournamentRanking[] = _.filter(allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(allPlayers, function (tournamentPlayer: TournamentPlayer) {

      if (tournamentPlayer.playerName !== 'bye') {
        const newTournamentRanking = new TournamentRanking(
          tournamentPlayer.tournamentId,
          tournamentPlayer.id,
          tournamentPlayer.playerId ? tournamentPlayer.playerId : '',
          tournamentPlayer.playerName,
          tournamentPlayer.faction ? tournamentPlayer.faction : '',
          tournamentPlayer.teamName ? tournamentPlayer.teamName : '',
          tournamentPlayer.origin ? tournamentPlayer.origin : '',
          tournamentPlayer.meta ? tournamentPlayer.meta : '',
          tournamentPlayer.country ? tournamentPlayer.country : '',
          tournamentPlayer.elo ? tournamentPlayer.elo : 0,
          0, 0, 0, 0, 0, 1, [],
          tournamentPlayer.droppedInRound ? tournamentPlayer.droppedInRound : 0);


        _.forEach(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {

          if (lastRoundRanking.tournamentPlayerId === tournamentPlayer.id) {

            newTournamentRanking.score = lastRoundRanking.score;
            newTournamentRanking.sos = lastRoundRanking.sos;
            newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
            newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
            newTournamentRanking.tournamentRound = config.round;
            newTournamentRanking.opponentTournamentPlayerIds =
              lastRoundRanking.opponentTournamentPlayerIds ? lastRoundRanking.opponentTournamentPlayerIds : [];
          }
        });

        const tournamentRankingsRef = that.afoDatabase
          .list('tournament-rankings/' + newTournamentRanking.tournamentId);
        newTournamentRanking.id = tournamentRankingsRef.push(newTournamentRanking).getKey();

        newRankings.push(newTournamentRanking);
      }
    });

    return newRankings;
  }

  pushTeamRankingForRound(config: TournamentManagementConfiguration,
                          allTeams: TournamentTeam[],
                          allTeamRankings: TournamentRanking[]): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];


    const lastRoundTeamRankings: TournamentRanking[] = _.filter(allTeamRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(allTeams, function (team: TournamentTeam) {
      const newTournamentRanking = new TournamentRanking(
        team.tournamentId,
        team.id,
        '',
        team.teamName,
        '',
        '',
        '',
        team.meta ? team.meta : '',
        team.country ? team.country : '',
        0, 0, 0, 0, 0, 0, 1, [],
        team.droppedInRound ? team.droppedInRound : 0);

      _.forEach(lastRoundTeamRankings, function (lastRoundRanking: TournamentRanking) {

        if (lastRoundRanking.tournamentPlayerId === team.id) {

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.secondScore = lastRoundRanking.secondScore;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = config.round;
          newTournamentRanking.opponentTournamentPlayerIds = lastRoundRanking.opponentTournamentPlayerIds;
        }
      });
      const tournamentRankingsRef = that.afoDatabase
        .list('tournament-team-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }


  pushGamesForRound(config: TournamentManagementConfiguration,
                    allRankings: TournamentRanking[],
                    newRankings: TournamentRanking[]): boolean {

    const that = this;

    const shuffledRankings = _.shuffle(newRankings);
    const rankingsWithByeIfUneven = this.addByeIfPlayersUneven(shuffledRankings);

    const sortedRankings = _.orderBy(rankingsWithByeIfUneven, ['score'], ['desc']);

    const newGames: TournamentGame[] = [];

    const megaSuccess = this.gameMatchingService.matchGame(config, sortedRankings, newGames, false);

    if (!megaSuccess) {
      return false;
    }

    _.reverse(newGames);

    const tournamentGamesRef = this.afoDatabase
      .list('tournament-games/' + config.tournamentId);

    const listOfTables = _.range(1, (newGames.length + 1));

    _.forEach(newGames, function (newGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newGame.playingField = tableNumber;

      if (newGame.playerOneTournamentPlayerId === 'bye') {
        newGame.playerTwoScore = 1;
        newGame.playerTwoControlPoints = 3;
        newGame.playerTwoVictoryPoints = 38;
        newGame.finished = true;

        _.forEach(newRankings, function (ranking: TournamentRanking) {

          if (ranking.tournamentPlayerId === newGame.playerTwoTournamentPlayerId) {

            const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
              return (rank.tournamentRound === (config.round - 1) &&
              rank.tournamentPlayerId === ranking.tournamentPlayerId);
            });

            const playerTwoRankingRef = that.afoDatabase
              .object('tournament-rankings/' + newGame.tournamentId + '/' + ranking.id);
            playerTwoRankingRef.update(
              {
                score: lastRoundRanking.score + 1,
                controlPoints: lastRoundRanking.controlPoints + 3,
                victoryPoints: lastRoundRanking.victoryPoints + 38,
              });
          }
        });
      }

      if (newGame.playerTwoTournamentPlayerId === 'bye') {
        newGame.playerOneScore = 1;
        newGame.playerOneControlPoints = 3;
        newGame.playerOneVictoryPoints = 38;
        newGame.finished = true;

        _.forEach(newRankings, function (ranking: TournamentRanking) {

          if (ranking.tournamentPlayerId === newGame.playerOneTournamentPlayerId) {

            const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
              return (rank.tournamentRound === (config.round - 1) &&
                rank.tournamentPlayerId === ranking.tournamentPlayerId);
            });

            const playerOneRankingRef = that.afoDatabase
              .object('tournament-rankings/' + newGame.tournamentId + '/' + ranking.id);
            playerOneRankingRef.update(
              {
                score: lastRoundRanking.score + 1,
                controlPoints: lastRoundRanking.controlPoints + 3,
                victoryPoints: lastRoundRanking.victoryPoints + 38,
              });
          }
        });
      }

      tournamentGamesRef.push(newGame);
    });

    return true;
  }

  createTeamGamesForRound(actualTournament: Tournament,
                          allPlayers: TournamentPlayer[],
                          allRankings: TournamentRanking[],
                          config: TournamentManagementConfiguration,
                          newRankings: TournamentRanking[],
                          newPlayerRankings: TournamentRanking[]): boolean {
    const that = this;

    const shuffledRankings = _.shuffle(newRankings);
    const rankingsWithByeIfUneven = this.addByeIfPlayersUneven(shuffledRankings);

    const sortedRankings = _.orderBy(rankingsWithByeIfUneven, ['score'], ['desc']);

    const newTeamGames = [];

    const megaSuccess = this.gameMatchingService.matchGame(config, sortedRankings, newTeamGames, true);

    if (!megaSuccess) {
      return false;
    }
    _.reverse(newTeamGames);

    const tournamentTeamGamesRef = this.afoDatabase
      .list('tournament-team-games/' + config.tournamentId);

    const listOfTables = _.range(1, (newTeamGames.length + 1));

    _.forEach(newTeamGames, function (newTeamGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newTeamGame.playingField = tableNumber;

      if (newTeamGame.playerOneTournamentPlayerId === 'bye') {
        newTeamGame.playerTwoScore = 1;
        newTeamGame.playerTwoIntermediateResult = actualTournament.teamSize;
        newTeamGame.playerTwoControlPoints = (3 * actualTournament.teamSize);
        newTeamGame.playerTwoVictoryPoints = (38 * actualTournament.teamSize);
        newTeamGame.finished = true;

        _.forEach(newRankings, function (ranking: TournamentRanking) {

          if (ranking.tournamentPlayerId === newTeamGame.playerTwoTournamentPlayerId) {

            const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
              return (rank.tournamentRound === (config.round - 1) &&
                rank.tournamentPlayerId === ranking.tournamentPlayerId);
            });

            const playerTwoRankingRef = that.afoDatabase
              .object('tournament-team-rankings/' + newTeamGame.tournamentId + '/' + ranking.id);
            playerTwoRankingRef.update(
              {
                score: lastRoundRanking.score + 1,
                secondScore: lastRoundRanking.secondScore + actualTournament.teamSize,
                controlPoints: lastRoundRanking.controlPoints + (actualTournament.teamSize * 3),
                victoryPoints: lastRoundRanking.victoryPoints + (actualTournament.teamSize * 38)
              });
          }
        });
      }

      if (newTeamGame.playerTwoTournamentPlayerId === 'bye') {
        newTeamGame.playerOneScore = 1;
        newTeamGame.playerOneIntermediateResult = actualTournament.teamSize;
        newTeamGame.playerOneControlPoints = (3 * actualTournament.teamSize);
        newTeamGame.playerOneVictoryPoints = (38 + actualTournament.teamSize);
        newTeamGame.finished = true;

        _.forEach(newRankings, function (ranking: TournamentRanking) {

          if (ranking.tournamentPlayerId === newTeamGame.playerOneTournamentPlayerId) {

            const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
              return (rank.tournamentRound === (config.round - 1) &&
                rank.tournamentPlayerId === ranking.tournamentPlayerId);
            });

            const playerOneRankingRef = that.afoDatabase
              .object('tournament-team-rankings/' + newTeamGame.tournamentId + '/' + ranking.id);
            playerOneRankingRef.update(
              {
                score: lastRoundRanking.score + 1,
                secondScore: lastRoundRanking.secondScore + actualTournament.teamSize,
                controlPoints: lastRoundRanking.controlPoints + (actualTournament.teamSize * 3),
                victoryPoints: lastRoundRanking.victoryPoints + (actualTournament.teamSize * 38)
              });
          }
        });
      }

      tournamentTeamGamesRef.push(newTeamGame);

      that.createPlayerGamesForTeamMatch(newTeamGame, allRankings, newPlayerRankings, allPlayers, true);
    });

    return true;

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

  killGamesForRound(config: TournamentManagementConfiguration): Observable<any[]> {

    const query = this.afoDatabase.list('tournament-games/' + config.tournamentId).take(1);
    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-games/' + config.tournamentId + '/' + game.$key).remove();
        }
      });
      console.log('all games for round ' + config.round + ' killed');
    });
    return query;
  }

  killTeamGamesForRound(config: TournamentManagementConfiguration): Observable<any[]> {

    const query = this.afoDatabase.list('tournament-team-games/' + config.tournamentId).take(1);
    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {
        if (game.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-team-games/' + config.tournamentId + '/' + game.$key).remove();
        }
      });
      console.log('all team games for round ' + config.round + ' killed');
    });
    return query;
  }

  killRankingsForRound(config: TournamentManagementConfiguration): Observable<any[]> {

    const query = this.afoDatabase.list('tournament-rankings/' + config.tournamentId).take(1);
    query.subscribe((rankingRef: any) => {
      rankingRef.forEach((ranking) => {
        if (ranking.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-rankings/' + config.tournamentId + '/' + ranking.$key).remove();
        }
      });
      console.log('all rankings for round ' + config.round + ' killed');
    });

    return query;
  }

  killTeamRankingsForRound(config: TournamentManagementConfiguration): Observable<any[]> {

    const query = this.afoDatabase.list('tournament-team-rankings/' + config.tournamentId).take(1);
    query.subscribe((rankingRef: any) => {
      rankingRef.forEach((ranking) => {
        if (ranking.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-team-rankings/' + config.tournamentId + '/' + ranking.$key).remove();
        }
      });
      console.log('all team rankings for round ' + config.round + ' killed');
    });

    return query;
  }

  killRound(config: TournamentManagementConfiguration) {
    this.killRankingsForRound(config);
    this.killGamesForRound(config);

    const tournament = this.afoDatabase.object('tournaments/' + config.tournamentId);
    tournament.update({actualRound: (config.round - 1), visibleRound: (config.round - 1)});

  }

  publishRound(publish: PublishRound) {

    const gameRef = this.afoDatabase.object('tournaments/' + publish.tournamentId);
    gameRef.update({visibleRound: publish.roundToPublish});


  }

  pairRoundAgain(config: TournamentManagementConfiguration,
                 allPlayers: TournamentPlayer[],
                 allRankings: TournamentRanking[]) {

    console.log('pairRoundAgain');

    Observable
      .zip(this.killRankingsForRound(config), this.killGamesForRound(config), (a: any, b: any) => {
        return {a: a, b: b};
      })
      .subscribe((r) => {
        const newRankings: TournamentRanking[] = this.pushRankingForRound(config, allPlayers, allRankings);
        const success: boolean = this.pushGamesForRound(config, allRankings, newRankings);

        if (!success) {
          this.killRankingsForRound(config);
        }
      });
  }

  pairNewRound(config: TournamentManagementConfiguration,
               allPlayers: TournamentPlayer[],
               allRankings: TournamentRanking[]) {

    console.log('pairNewRound');

    Observable
      .zip(this.killRankingsForRound(config), this.killGamesForRound(config), (a: any, b: any) => {
        return {a: a, b: b};
      })
      .subscribe(() => {
        const newRankings: TournamentRanking[] = this.pushRankingForRound(config, allPlayers, allRankings);
        const success: boolean = this.pushGamesForRound(config, allRankings, newRankings);

        if (success) {
          console.log('pairNewRound successfull');

          this.tournamentService.newRound(config);
          this.router.navigate(['/tournament', config.tournamentId, 'round', config.round]);
        } else {
          this.killRankingsForRound(config);
        }
      });
  }

  createPlayerGamesForTeamMatch(teamMatch: TournamentGame,
                                allRankings: TournamentRanking[],
                                newPlayerRankings: TournamentRanking[],
                                allPlayers: TournamentPlayer[],
                                debug: boolean) {

    const that = this;

    const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);

    const teamOnePlayers = _.filter(allPlayers, function (player: TournamentPlayer) {
      return teamMatch.playerOnePlayerName === player.teamName;
    });
    const teamTwoPlayers = _.filter(allPlayers, function (player: TournamentPlayer) {
      return teamMatch.playerTwoPlayerName === player.teamName;
    });

    if (teamMatch.playerOneTournamentPlayerId === 'bye') {
      _.forEach(teamTwoPlayers, function (playerTwo: TournamentPlayer, index: number) {
        const newTeamGame = new TournamentGame(
          teamMatch.tournamentId,
          '',
          'bye',
          'Bye',
          'Bye',
          0,
          '',
          0, 0, 0, '', 0, 0,
          playerTwo.playerId ? playerTwo.playerId : '', playerTwo.id,
          playerTwo.playerName, playerTwo.teamName,
          playerTwo.elo ? playerTwo.elo : 0, playerTwo.faction,
          1, 3, 38, '', 0, 0,
          teamMatch.tournamentRound, index + 1, true, '');

        teamGamesRef.push(newTeamGame);

        _.forEach(newPlayerRankings, function (ranking: TournamentRanking) {

          if (ranking.tournamentPlayerId === newTeamGame.playerTwoTournamentPlayerId) {

            const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
              return (rank.tournamentRound === (teamMatch.tournamentRound - 1) &&
                rank.tournamentPlayerId === ranking.tournamentPlayerId);
            });

            const playerOneRankingRef = that.afoDatabase
              .object('tournament-rankings/' + newTeamGame.tournamentId + '/' + ranking.id);
            playerOneRankingRef.update(
              {
                score: lastRoundRanking.score + 1,
                controlPoints: lastRoundRanking.controlPoints + 3,
                victoryPoints: lastRoundRanking.victoryPoints + 38
              });
          }
        });
      });
    }

    if (teamMatch.playerTwoTournamentPlayerId === 'bye') {
      _.forEach(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {
        const newTeamGame = new TournamentGame(
          teamMatch.tournamentId,
          playerOne.playerId ? playerOne.playerId : '', playerOne.id,
          playerOne.playerName, playerOne.teamName,
          playerOne.elo ? playerOne.elo : 0, playerOne.faction,
          1, 3, 38, '', 0, 0,
          '',
          'bye',
          'Bye',
          'Bye',
          0,
          '',
          0, 0, 0, '', 0, 0,
          teamMatch.tournamentRound, index + 1, true, '');

        teamGamesRef.push(newTeamGame);

        _.forEach(newPlayerRankings, function (ranking: TournamentRanking) {

          if (ranking.tournamentPlayerId === newTeamGame.playerOneTournamentPlayerId) {

            const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
              return (rank.tournamentRound === (teamMatch.tournamentRound - 1) &&
                rank.tournamentPlayerId === ranking.tournamentPlayerId);
            });

            const playerOneRankingRef = that.afoDatabase
              .object('tournament-rankings/' + newTeamGame.tournamentId + '/' + ranking.id);
            playerOneRankingRef.update(
              {
                score: lastRoundRanking.score + 1,
                controlPoints: lastRoundRanking.controlPoints + 3,
                victoryPoints: lastRoundRanking.victoryPoints + 38
              });
          }
        });
      });
    }

    if (teamMatch.playerOneTournamentPlayerId !== 'bye' && teamMatch.playerTwoTournamentPlayerId !== 'bye') {
      _.forEach(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {

        const newPlayerTeamGame = new TournamentGame(
          teamMatch.tournamentId,
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
          teamMatch.tournamentRound, index + 1, false, '');

        if (debug) {
          console.log('found game : ' + newPlayerTeamGame.playerOnePlayerName + ' VS ' + newPlayerTeamGame.playerTwoPlayerName);
        }

        teamGamesRef.push(newPlayerTeamGame);
      });
    }
  }
}
