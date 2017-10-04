import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {GameMatchingService} from './game-matching.service';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {PublishRound} from '../../../shared/dto/publish-round';

import {TournamentService} from './actual-tournament.service';
import {Router} from '@angular/router';
import {ByeService} from './bye-service';

@Injectable()
export class PairingService {


  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private tournamentService: TournamentService,
              private gameMatchingService: GameMatchingService,
              private byeService: ByeService,
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
          0, 0, 0, 0, 0, 1, [], [],
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
            newTournamentRanking.opponentNames =
              lastRoundRanking.opponentNames ? lastRoundRanking.opponentNames : [];
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
      .list('tournament-games/' + config.tournament.id);

    const listOfTables = _.range(1, (newGames.length + 1));

    _.forEach(newGames, function (newGame: TournamentGame) {

      const randomIndex = Math.floor(Math.random() * listOfTables.length);
      const tableNumber: number = listOfTables[randomIndex];
      listOfTables.splice(randomIndex, 1);
      newGame.playingField = tableNumber;

      if (newGame.playerOneTournamentPlayerId === 'bye') {

        that.byeService.pushRankingForByeMatch(newGame.playerTwoTournamentPlayerId,
          newRankings, allRankings, (config.round - 1));

        newGame.playerTwoScore = 1;
        newGame.playerTwoControlPoints = 3;
        newGame.playerTwoVictoryPoints = 38;

        newGame.finished = true;
      }

      if (newGame.playerTwoTournamentPlayerId === 'bye') {

        that.byeService.pushRankingForByeMatch(newGame.playerOneTournamentPlayerId,
          newRankings, allRankings, (config.round - 1));

        newGame.playerOneScore = 1;
        newGame.playerOneControlPoints = 3;
        newGame.playerOneVictoryPoints = 38;

        newGame.finished = true;
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
        0, 0, 0, 0, 0, 1, [], [], 0);

      notDroppedPlayers.push(bye);
    }

    return notDroppedPlayers;
  }

  killPlayerGames(playerGamesForRound: TournamentGame[]) {

    const that = this;

    console.log('playerGamesForRound:' + playerGamesForRound.length);

    _.forEach(playerGamesForRound, function (game: TournamentGame) {
      that.afoDatabase.list('tournament-games/' + game.tournamentId).remove(game.id);
    });
  }


  killPlayerRankings(playerRankingsForRound: TournamentRanking[]) {

    const that = this;

    _.forEach(playerRankingsForRound, function (ranking: TournamentRanking) {
      that.afoDatabase.list('tournament-rankings/' + ranking.tournamentId).remove(ranking.id);
    });
  }


  killRound(config: TournamentManagementConfiguration,
            playerRankingsForRound: TournamentRanking[],
            playerGamesForRound: TournamentGame[]) {
    this.killPlayerRankings(playerRankingsForRound);
    this.killPlayerGames(playerGamesForRound);

    const tournamentRef = this.afoDatabase.object('tournaments/' + config.tournament.id);

    const tournament = config.tournament;
    tournament.visibleRound = (config.round - 1);
    tournament.actualRound = (config.round - 1);

    tournamentRef.set(tournament);
  }

  publishRound(publish: PublishRound) {

    const tournamentRef = this.afoDatabase.object('tournaments/' + publish.tournament.id);

    const tournament = publish.tournament;
    tournament.visibleRound = publish.roundToPublish;

    tournamentRef.set(tournament);
  }

  pairRoundAgain(config: TournamentManagementConfiguration,
                 playerRankingsForRound: TournamentRanking[],
                 playerGamesForRound: TournamentGame[],
                 allPlayers: TournamentPlayer[],
                 allPlayerRankings: TournamentRanking[]) {

    console.log('pairRoundAgain');

    this.killPlayerRankings(playerRankingsForRound);
    this.killPlayerGames(playerGamesForRound);

    const newRankings: TournamentRanking[] = this.pushRankingForRound(config, allPlayers, allPlayerRankings);
    const success: boolean = this.pushGamesForRound(config, allPlayerRankings, newRankings);

    if (!success) {
      this.killPlayerRankings(newRankings);
    }

  }

  pairNewRound(config: TournamentManagementConfiguration,
               allPlayers: TournamentPlayer[],
               allPlayerRankings: TournamentRanking[]) {

    console.log('pairNewRound');

    const newRankings: TournamentRanking[] = this.pushRankingForRound(config, allPlayers, allPlayerRankings);
    const success: boolean = this.pushGamesForRound(config, allPlayerRankings, newRankings);

    if (success) {
      console.log('pairNewRound successfully');

      this.tournamentService.newRound(config);
      this.router.navigate(['/tournament', config.tournament.id, 'round', config.round]);
    } else {
      this.killPlayerRankings(newRankings);
    }
  }

  pushAllPlayerGames(tournamentId: string, allGames: TournamentGame[]) {
    const allGamesRef = this.afoDatabase
      .list('tournament-games/' + tournamentId);

    _.forEach(allGames, function (game: TournamentGame) {
      allGamesRef.push(game);
    });


  }

  pushAllPlayerRankings(tournamentId: string, playerRankings: TournamentRanking[]) {
    const allRankingsRef = this.afoDatabase
      .list('tournament-rankings/' + tournamentId);

    _.forEach(playerRankings, function (ranking: TournamentRanking) {
      allRankingsRef.push(ranking);
    });
  }
}
