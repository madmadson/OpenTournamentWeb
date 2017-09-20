import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {GameMatchingService} from './game-matching.service';
import {TournamentGame, getGameVsBye} from '../../../shared/model/tournament-game';

import {Observable} from 'rxjs/Observable';

import {TournamentTeam} from '../../../shared/model/tournament-team';
import {Tournament} from '../../../shared/model/tournament';
import {PairingService} from './pairing.service';
import {Router} from '@angular/router';
import {TournamentService} from './actual-tournament.service';
import {ByeService} from './bye-service';

@Injectable()
export class TeamPairingService {


  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private pairingService: PairingService,
              private tournamentService: TournamentService,
              private router: Router,
              private gameMatchingService: GameMatchingService,
              private byeService: ByeService) {
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
        0, 0, 0, 0, 0, 0, 1, [], [],
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
      newTournamentRanking.id = tournamentRankingsRef.push(newTournamentRanking).getKey();

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }

  createTeamGamesForRound(actualTournament: Tournament,
                          allPlayers: TournamentPlayer[],
                          allTeamRankings: TournamentRanking[],
                          config: TournamentManagementConfiguration,
                          teamRankingsForRound: TournamentRanking[],
                          newPlayerRankings: TournamentRanking[]): boolean {
    const that = this;

    const shuffledRankings = _.shuffle(teamRankingsForRound);
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

        that.byeService.pushTeamRankingForByeMatch(actualTournament,
          newTeamGame.playerTwoTournamentPlayerId, teamRankingsForRound, allTeamRankings, config.round);
      }

      if (newTeamGame.playerTwoTournamentPlayerId === 'bye') {
        newTeamGame.playerOneScore = 1;
        newTeamGame.playerOneIntermediateResult = actualTournament.teamSize;
        newTeamGame.playerOneControlPoints = (3 * actualTournament.teamSize);
        newTeamGame.playerOneVictoryPoints = (38 * actualTournament.teamSize);
        newTeamGame.finished = true;

        that.byeService.pushTeamRankingForByeMatch(actualTournament,
          newTeamGame.playerOneTournamentPlayerId, teamRankingsForRound, allTeamRankings, config.round);
      }

      tournamentTeamGamesRef.push(newTeamGame);

      that.createPlayerGamesForTeamMatch(newTeamGame, allTeamRankings, newPlayerRankings, allPlayers, true);
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


  killTeamGamesForRound(config: TournamentManagementConfiguration): Observable<any[]> {

    const query = this.afoDatabase.list('tournament-team-games/' + config.tournamentId).take(1);
    query.subscribe((gamesRef: any) => {
      gamesRef.forEach((game) => {

        console.log('check game: ' + JSON.stringify(game));

        if (game.tournamentRound === config.round) {
          this.afoDatabase.object('tournament-team-games/' + config.tournamentId + '/' + game.$key).remove();
        }
      });
      console.log('all team games for round ' + config.round + ' killed');
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

        const newTeamGame = getGameVsBye(playerTwo, true, teamMatch.tournamentRound, index + 1);

        that.byeService.pushRankingForByeMatch(newTeamGame.playerOneTournamentPlayerId,
          newPlayerRankings, allRankings, (teamMatch.tournamentRound - 1));

        teamGamesRef.push(newTeamGame);
      });
    }

    if (teamMatch.playerTwoTournamentPlayerId === 'bye') {
      _.forEach(teamOnePlayers, function (playerOne: TournamentPlayer, index: number) {

        const newTeamGame = getGameVsBye(playerOne, false, teamMatch.tournamentRound, index + 1);

        that.byeService.pushRankingForByeMatch(newTeamGame.playerOneTournamentPlayerId,
          newPlayerRankings, allRankings, (teamMatch.tournamentRound - 1));

        teamGamesRef.push(newTeamGame);


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

  killTeamRankingsAndGames(config: TournamentManagementConfiguration) {

    this.killTeamRankingsForRound(config);
    this.killTeamGamesForRound(config);

  }

  pairTeamRound(config: TournamentManagementConfiguration,
                actualTournament: Tournament,
                allTournamentTeams: TournamentTeam[],
                allPlayers: TournamentPlayer[],
                allPlayerRankings: TournamentRanking[],
                allTeamRankings: TournamentRanking[]) {

    console.log('pairTeamRound');

    Observable
      .zip(this.pairingService.killRankingsForRound(config),
        this.pairingService.killGamesForRound(config),
        this.killTeamRankingsForRound(config),
        this.killTeamGamesForRound(config),
        (a: any, b: any, c: any, d: any) => {
          return {a: a, b: b, c: c, d: d};
        })
      .subscribe((r) => {

        const newPlayerRankings: TournamentRanking[] =
          this.pairingService.pushRankingForRound(config, allPlayers, allPlayerRankings);

        const newTeamRankings: TournamentRanking[] =
          this.pushTeamRankingForRound(config, allTournamentTeams, allTeamRankings);
        const success: boolean = this.createTeamGamesForRound(
          actualTournament, allPlayers, allTeamRankings, config,
          newTeamRankings, newPlayerRankings);

        if (success) {
          console.log('pairRound successfull');

          this.tournamentService.newRound(config);
          this.router.navigate(['/tournament', config.tournamentId, 'round', config.round]);
        } else {
          this.pairingService.killRankingsForRound(config);
          this.killTeamRankingsForRound(config);
        }
      });
  }

}
