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


  pushGamesForRound(config: TournamentManagementConfiguration,
                    allRankings: TournamentRanking[],
                    newRankings: TournamentRanking[]): boolean {


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

        this.pushRankingForByeMatch(newGame.playerTwoTournamentPlayerId,
          newRankings, allRankings, (config.round - 1));

          newGame.playerTwoScore = 1;
          newGame.playerTwoControlPoints = 3;
          newGame.playerTwoVictoryPoints = 38;
      }

      if (newGame.playerTwoTournamentPlayerId === 'bye') {

        this.pushRankingForByeMatch(newGame.playerOneTournamentPlayerId,
          newGame, newRankings, allRankings, (config.round - 1));

        newGame.playerOneScore = 1;
        newGame.playerOneControlPoints = 3;
        newGame.playerOneVictoryPoints = 38;
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

  pushRankingForByeMatch(tournamentPlayerIdToUpdate: string,
                         newRankings: TournamentRanking[],
                         allRankings: TournamentRanking[],
                         round: number) {

    const that = this;

    _.forEach(newRankings, function (ranking: TournamentRanking) {

      if (ranking.tournamentPlayerId === tournamentPlayerIdToUpdate) {

        const lastRoundRanking: TournamentRanking = _.find(allRankings, function (rank: TournamentRanking) {
          return (rank.tournamentRound === (round - 1) &&
            rank.tournamentPlayerId === ranking.tournamentPlayerId);
        });

        const playerOneRankingRef = that.afoDatabase
          .object('tournament-rankings/' + ranking.tournamentId + '/' + ranking.id);
        playerOneRankingRef.update(
          {
            score: lastRoundRanking ? lastRoundRanking.score + 1 : 1,
            controlPoints: lastRoundRanking ? lastRoundRanking.controlPoints + 3 : 3,
            victoryPoints: lastRoundRanking ? lastRoundRanking.victoryPoints + 38 : 38
          });
      }
    });
  }
}
