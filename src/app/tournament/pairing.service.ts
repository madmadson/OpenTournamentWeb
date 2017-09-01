



import {Injectable} from '@angular/core';
import {AfoObjectObservable, AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {GameMatchingService} from './game-matching.service';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {Tournament} from "../../../shared/model/tournament";
import {PublishRound} from "../../../shared/dto/publish-round";

@Injectable()
export class PairingService {


  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private gameMatchingService: GameMatchingService,
              private gameResultService: GameMatchingService) {

  }


  pushRankingForFirstRound(allPlayers: TournamentPlayer[]): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    _.forEach(allPlayers, function (tournamentPlayer: TournamentPlayer) {
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

      const tournamentRankingsRef = that.afoDatabase
        .list('tournament-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }



  pushGamesForFirstRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {

    const that = this;

    const shuffledRankings = _.shuffle(newRankings);
    const sortedRankings = _.orderBy(shuffledRankings, ['score'], ['desc']);

    const playerToMatchGamesFor = this.addByeIfPlayersUneven(sortedRankings);

    const newGames: TournamentGame[] = [];

    const megaSuccess = this.gameMatchingService.matchGame(config, playerToMatchGamesFor, newGames);

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

          if (ranking.playerId === newGame.playerTwoPlayerId) {
            const playerTwoRankingRef = that.afoDatabase
              .object('tournament-rankings/' + newGame.tournamentId + '/' + ranking.id);
            playerTwoRankingRef.update(
              {
                score: 1,
                controlPoints: 3,
                victoryPoints: 38,
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

          if (ranking.playerId === newGame.playerOnePlayerId) {
            const playerTwoRankingRef = that.afoDatabase
              .object('tournament-rankings/' + newGame.tournamentId + '/' + ranking.id);
            playerTwoRankingRef.update(
              {
                score: 1,
                controlPoints: 3,
                victoryPoints: 38,
              });
          }
        });
      }

      tournamentGamesRef.push(newGame);
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

  killRankingsForRound(config: TournamentManagementConfiguration) {

    const query = this.afoDatabase.list('tournament-rankings/' + config.tournamentId).take(1);
    query.subscribe((rankingRef: any) => {
      rankingRef.forEach((ranking) => {
        if (ranking.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-rankings/' + config.tournamentId + '/' + ranking.$key).remove();
        }
      });
    });
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
}
