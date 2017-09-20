import {Injectable} from '@angular/core';
import {getGameVsBye, TournamentGame} from '../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import {TournamentPlayer} from '../../../shared/model/tournament-player';

import * as _ from 'lodash';
import {Tournament} from "../../../shared/model/tournament";

@Injectable()
export class ByeService {

  constructor(private afoDatabase: AngularFireOfflineDatabase) {
  }

  handlePlayerOneIsBye(game: TournamentGame, rankingsForRound: TournamentRanking[]) {

    const that = this;

    if (game.playerOneTournamentPlayerId === 'bye') {
      game.playerTwoScore = 1;
      game.playerTwoControlPoints = 3;
      game.playerTwoVictoryPoints = 38;
      game.finished = true;

      _.forEach(rankingsForRound, function (ranking: TournamentRanking) {

        if (ranking.tournamentPlayerId === game.playerTwoTournamentPlayerId) {
          const playerTwoRankingRef = that.afoDatabase
            .object('tournament-rankings/' + game.tournamentId + '/' + ranking.id);

          let newListOfOpponentIds = ['bye'];
          let newListOfOpponentNames = ['Bye'];

          if (ranking.opponentTournamentPlayerIds) {
            newListOfOpponentIds =
              _.union(newListOfOpponentIds, ranking.opponentTournamentPlayerIds);
          }
          if (ranking.opponentNames) {
            newListOfOpponentNames =
              _.union(newListOfOpponentNames, ranking.opponentNames);
          }
          playerTwoRankingRef.update(
            {
              score: (ranking.score + 1),
              controlPoints: (ranking.controlPoints + 3),
              victoryPoints: (ranking.controlPoints + 38),
              opponentNames: newListOfOpponentNames,
              opponentTournamentPlayerIds: newListOfOpponentIds
            });

          console.log('newByeRanking: ' + ranking.playerName);
        }
      });
    }
  }

  handlePlayerTwoIsBye(game: TournamentGame, rankingsForRound: TournamentRanking[]) {

    const that = this;

    if (game.playerTwoTournamentPlayerId === 'bye') {
      game.playerOneScore = 1;
      game.playerOneControlPoints = 3;
      game.playerOneVictoryPoints = 38;
      game.finished = true;

      _.forEach(rankingsForRound, function (ranking: TournamentRanking) {

        if (ranking.tournamentPlayerId === game.playerOneTournamentPlayerId) {
          const playerTwoRankingRef = that.afoDatabase
            .object('tournament-rankings/' + game.tournamentId + '/' + ranking.id);

          let newListOfOpponentIds = ['bye'];
          let newListOfOpponentNames = ['Bye'];

          if (ranking.opponentTournamentPlayerIds) {
            newListOfOpponentIds =
              _.union(newListOfOpponentIds, ranking.opponentTournamentPlayerIds);
          }

          if (ranking.opponentNames) {
            newListOfOpponentNames =
              _.union(newListOfOpponentNames, ranking.opponentNames);
          }

          playerTwoRankingRef.update(
            {
              score: (ranking.score + 1),
              controlPoints: (ranking.controlPoints + 3),
              victoryPoints: (ranking.controlPoints + 38),
              opponentNames: newListOfOpponentNames,
              opponentTournamentPlayerIds: newListOfOpponentIds
            });

          console.log('newByeRanking: ' + ranking.playerName);
        }
      });
    }
  }

  handlePlayerMatchTeamOneIsBye(teamMatch: TournamentGame,
                                teamTwoPlayers: TournamentPlayer[],
                                rankingsForRound: TournamentRanking[]) {

    const that = this;

    const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);

    _.forEach(teamTwoPlayers, function (playerTeamTwo: TournamentPlayer, index: number) {
      const newPlayerGame = getGameVsBye(playerTeamTwo, true, teamMatch.tournamentRound, index);

      console.log('newByeGame: ' + JSON.stringify(newPlayerGame));

      teamGamesRef.push(newPlayerGame);
      that.handlePlayerOneIsBye(newPlayerGame, rankingsForRound);
    });

  }

  handlePlayerMatchTeamTwoIsBye(teamMatch: TournamentGame,
                                teamOnePlayers: TournamentPlayer[],
                                rankingsForRound: TournamentRanking[]) {

    const that = this;

    const teamGamesRef = this.afoDatabase.list('tournament-games/' + teamMatch.tournamentId);


    _.forEach(teamOnePlayers, function (playerTeamTwo: TournamentPlayer, index: number) {
      const newPlayerGame = getGameVsBye(playerTeamTwo, false, teamMatch.tournamentRound, index);

      console.log('newByeGame: ' + JSON.stringify(newPlayerGame));

      teamGamesRef.push(newPlayerGame);
      that.handlePlayerTwoIsBye(newPlayerGame, rankingsForRound);
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
          return (rank.tournamentRound === round &&
            rank.tournamentPlayerId === ranking.tournamentPlayerId);
        });

        let newListOfOpponentIds = ['bye'];
        let newListOfOpponentNames = ['Bye'];

        if (lastRoundRanking) {
          newListOfOpponentIds =
            _.union(newListOfOpponentIds, lastRoundRanking.opponentTournamentPlayerIds);
          newListOfOpponentNames =
            _.union(newListOfOpponentNames, lastRoundRanking.opponentNames);
        }

        const playerOneRankingRef = that.afoDatabase
          .object('tournament-rankings/' + ranking.tournamentId + '/' + ranking.id);
        playerOneRankingRef.update(
          {
            score: lastRoundRanking ? lastRoundRanking.score + 1 : 1,
            controlPoints: lastRoundRanking ? lastRoundRanking.controlPoints + 3 : 3,
            victoryPoints: lastRoundRanking ? lastRoundRanking.victoryPoints + 38 : 38,
            opponentTournamentPlayerIds: newListOfOpponentIds,
            opponentNames: newListOfOpponentNames
          });

        console.log('newByeRanking: ' + ranking.playerName);
      }
    });
  }

  pushTeamRankingForByeMatch(actualTournament: Tournament,
                             tournamentPlayerIdToUpdate: string,
                             teamRankingsForRound: TournamentRanking[],
                             allTeamRankings: TournamentRanking[],
                             round: number) {

    const that = this;

    _.forEach(teamRankingsForRound, function (ranking: TournamentRanking) {

      if (ranking.tournamentPlayerId === tournamentPlayerIdToUpdate) {

        const lastRoundRanking: TournamentRanking = _.find(allTeamRankings, function (rank: TournamentRanking) {
          return (rank.tournamentRound === (round - 1) &&
            rank.tournamentPlayerId === ranking.tournamentPlayerId);
        });

        let newListOfOpponentIds = ['bye'];
        let newListOfOpponentNames = ['Bye'];

        if (lastRoundRanking) {
          newListOfOpponentIds =
            _.union(newListOfOpponentIds, lastRoundRanking.opponentTournamentPlayerIds);
          newListOfOpponentNames =
            _.union(newListOfOpponentNames, lastRoundRanking.opponentNames);
        }

        const playerTwoRankingRef = that.afoDatabase
          .object('tournament-team-rankings/' + ranking.tournamentId + '/' + ranking.id);
        playerTwoRankingRef.update(
          {
            score: lastRoundRanking ? lastRoundRanking.score + 1 : 1,
            secondScore: lastRoundRanking ? lastRoundRanking.secondScore + actualTournament.teamSize : actualTournament.teamSize,
            controlPoints: lastRoundRanking ? lastRoundRanking.controlPoints + (actualTournament.teamSize * 3) : (actualTournament.teamSize * 3),
            victoryPoints: lastRoundRanking ? lastRoundRanking.victoryPoints + (actualTournament.teamSize * 38) : (actualTournament.teamSize * 38),
            opponentTournamentPlayerIds: newListOfOpponentIds,
            opponentNames: newListOfOpponentNames
          });

        console.log('newByeRanking: ' + ranking.playerName);
      }
    });
  }
}
