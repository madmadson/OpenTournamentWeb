import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFireDatabase, FirebaseRef} from 'angularfire2';


import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Tournament} from '../../../shared/model/tournament';

import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {
  AddTournamentRankingAction, ChangeTournamentRankingAction, ClearRankingAction,
  DeleteTournamentRankingAction
} from '../store/actions/tournament-rankings-actions';

import * as _ from 'lodash';
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {GameResult} from '../../../shared/dto/game-result';
import {TournamentTeam} from '../../../shared/model/tournament-team';


@Injectable()
export class TournamentRankingService implements OnDestroy {

  tournamentRankingsRef: firebase.database.Reference;

  allPlayers: TournamentPlayer[];
  allTeams: TournamentTeam[];
  allRankings: TournamentRanking[];
  allGames: TournamentGame[];
  actualTournament: Tournament;

  constructor(protected fireDB: AngularFireDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;
      this.allTeams = state.actualTournamentTeams.teams;
      this.allRankings = state.actualTournamentRankings.actualTournamentRankings;
      this.allGames = state.actualTournamentGames.actualTournamentGames;
      this.actualTournament = state.actualTournament.actualTournament;
    });

  }

  ngOnDestroy(): void {

    if (this.tournamentRankingsRef) {
      this.tournamentRankingsRef.off();
    }

  }

  public subscribeOnTournamentRankings(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearRankingAction());
    if (this.tournamentRankingsRef) {
      this.tournamentRankingsRef.off();
    }

    console.log('subscribeOnTournamentRankings');

    this.tournamentRankingsRef = this.fb.database().ref('tournament-rankings/' + tournamentId);

    this.tournamentRankingsRef.on('child_added', function (snapshot) {

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch(new AddTournamentRankingAction(ranking));

    });

    this.tournamentRankingsRef.on('child_changed', function (snapshot) {

      const ranking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      ranking.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentRankingAction(ranking));

    });

    this.tournamentRankingsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentRankingAction(snapshot.key));

    });
  }

  pushRankingForRound(config: TournamentManagementConfiguration): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    this.eraseRankingsForRound(config);

    const lastRoundRankings: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {
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
        0, 0, 0, 0, 1, []);


      _.each(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {

        if (lastRoundRanking.tournamentPlayerId === tournamentPlayer.id) {

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = config.round;
          newTournamentRanking.opponentTournamentPlayerIds = lastRoundRanking.opponentTournamentPlayerIds;
        }
      });

      const tournamentRankingsRef = that.fireDB
        .list('tournament-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }

  pushTeamRankingForRound(config: TournamentManagementConfiguration): TournamentRanking[] {

    const that = this;
    const newRankings: TournamentRanking[] = [];

    this.eraseRankingsForRound(config);

    const lastRoundRankings: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });

    _.forEach(this.allTeams, function (team: TournamentTeam) {
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
        0,
        0, 0, 0, 0, 1, []);

      _.each(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {

        if (lastRoundRanking.tournamentPlayerId === team.id) {

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = config.round;
          newTournamentRanking.opponentTournamentPlayerIds = lastRoundRanking.opponentTournamentPlayerIds;
        }
      });
      const tournamentRankingsRef = that.fireDB
        .list('tournament-team-rankings/' + newTournamentRanking.tournamentId);
      tournamentRankingsRef.push(newTournamentRanking);

      newRankings.push(newTournamentRanking);
    });

    return newRankings;
  }

  eraseRankingsForRound(config: TournamentManagementConfiguration) {

    const query = this.fb.database().ref('tournament-rankings/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }

  eraseTeamRankingsForRound(config: TournamentManagementConfiguration) {

    const query = this.fb.database().ref('tournament-team-rankings/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }

  updateRankingAfterGameResultEntered(gameResult: GameResult) {

    const that = this;
    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    for (let i = roundOfGameResult; i <= this.actualTournament.actualRound; i++) {

      const allRankingsFromSameRound: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === i);
      });

      const scoreTournamentPlayerMap = {};
      const opponentIdsTournamentPlayerMap = {};
      _.each(allRankingsFromSameRound, function (ranking: TournamentRanking) {
        scoreTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.score;
        opponentIdsTournamentPlayerMap[ranking.tournamentPlayerId] = ranking.opponentTournamentPlayerIds;
      });

      const lastRoundRankingPlayerOne: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i - 1) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId);
      })[0];

      const lastRoundRankingPlayerTwo: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i - 1) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId);
      })[0];

      const rankingPlayerOne: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId);
      })[0];

      const rankingPlayerTwo: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === (i) &&
        ranking.tournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId);
      })[0];

      const actualRoundGamePlayerOne: TournamentGame = _.filter(this.allGames, function (game: TournamentGame) {
        return (game.tournamentRound === (i) &&
        (game.playerOneTournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId ||
        game.playerTwoTournamentPlayerId === gameResult.gameAfter.playerOneTournamentPlayerId));
      })[0];

      const actualRoundGamePlayerTwo: TournamentGame = _.filter(this.allGames, function (game: TournamentGame) {
        return (game.tournamentRound === (i) &&
        (game.playerOneTournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId ||
        game.playerTwoTournamentPlayerId === gameResult.gameAfter.playerTwoTournamentPlayerId));
      })[0];

      let newScorePlayerOne = 0;
      let newCPPlayerOne = 0;
      let newVPPlayerOne = 0;
      let newListOfOpponentsIdsPlayerOne = [];

      // if there is a round before add them
      if (lastRoundRankingPlayerOne) {
        newScorePlayerOne = newScorePlayerOne + lastRoundRankingPlayerOne.score;
        newCPPlayerOne = newCPPlayerOne + lastRoundRankingPlayerOne.controlPoints;
        newVPPlayerOne = newVPPlayerOne + lastRoundRankingPlayerOne.victoryPoints;

        newListOfOpponentsIdsPlayerOne =
          _.union(newListOfOpponentsIdsPlayerOne, lastRoundRankingPlayerOne.opponentTournamentPlayerIds);
      }

      if (i === gameResult.gameAfter.tournamentRound) {

        newScorePlayerOne = newScorePlayerOne + gameResult.gameAfter.playerOneScore;
        newCPPlayerOne = newCPPlayerOne + gameResult.gameAfter.playerOneControlPoints;
        newVPPlayerOne = newVPPlayerOne + gameResult.gameAfter.playerOneVictoryPoints;

        newListOfOpponentsIdsPlayerOne.push(gameResult.gameAfter.playerTwoTournamentPlayerId);
        opponentIdsTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] = newListOfOpponentsIdsPlayerOne;

        const playerOneRankingRef = this.fireDB
          .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerOne.id);
        playerOneRankingRef.update(
          {
            score: newScorePlayerOne,
            controlPoints: newCPPlayerOne,
            victoryPoints: newVPPlayerOne,
            opponentTournamentPlayerIds: newListOfOpponentsIdsPlayerOne
          });

        if (!gameResult.gameBefore.finished) {
          scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] = newScorePlayerOne;

        } else if (gameResult.gameBefore.playerOneScore < gameResult.gameAfter.playerOneScore) {
          scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] =
            scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] + 1;
        } else if (gameResult.gameBefore.playerOneScore > gameResult.gameAfter.playerOneScore) {
          scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] =
            scoreTournamentPlayerMap[rankingPlayerOne.tournamentPlayerId] - 1;
        }
      }

      // there is a round after
      if (i > gameResult.gameAfter.tournamentRound && actualRoundGamePlayerOne) {
        if (gameResult.gameAfter.playerOneTournamentPlayerId === actualRoundGamePlayerOne.playerOneTournamentPlayerId) {
          newScorePlayerOne = lastRoundRankingPlayerOne.score + actualRoundGamePlayerOne.playerOneScore;
          newCPPlayerOne = lastRoundRankingPlayerOne.controlPoints + actualRoundGamePlayerOne.playerOneControlPoints;
          newVPPlayerOne = lastRoundRankingPlayerOne.victoryPoints + actualRoundGamePlayerOne.playerOneVictoryPoints;
        } else {
          newScorePlayerOne = lastRoundRankingPlayerOne.score + actualRoundGamePlayerOne.playerTwoScore;
          newCPPlayerOne = lastRoundRankingPlayerOne.controlPoints + actualRoundGamePlayerOne.playerTwoControlPoints;
          newVPPlayerOne = lastRoundRankingPlayerOne.victoryPoints + actualRoundGamePlayerOne.playerTwoVictoryPoints;
        }

        const playerOneRankingRef = this.fireDB
          .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerOne.id);
        playerOneRankingRef.update(
          {
            score: newScorePlayerOne,
            controlPoints: newCPPlayerOne,
            victoryPoints: newVPPlayerOne,
          });
      }


      let newScorePlayerTwo = 0;
      let newCPPlayerTwo = 0;
      let newVPPlayerTwo = 0;
      let newListOfOpponentsIdsPlayerTwo = [];

      // if there is a round before add it
      if (lastRoundRankingPlayerTwo) {
        newScorePlayerTwo = newScorePlayerTwo + lastRoundRankingPlayerTwo.score;
        newCPPlayerTwo = newCPPlayerTwo + lastRoundRankingPlayerTwo.controlPoints;
        newVPPlayerTwo = newVPPlayerTwo + lastRoundRankingPlayerTwo.victoryPoints;

        newListOfOpponentsIdsPlayerTwo =
          _.union(newListOfOpponentsIdsPlayerTwo, lastRoundRankingPlayerTwo.opponentTournamentPlayerIds);
      }

      // the actual round where the result is entered
      if (i === gameResult.gameAfter.tournamentRound) {

        newScorePlayerTwo = newScorePlayerTwo + gameResult.gameAfter.playerTwoScore;
        newCPPlayerTwo = newCPPlayerTwo + gameResult.gameAfter.playerTwoControlPoints;
        newVPPlayerTwo = newVPPlayerTwo + gameResult.gameAfter.playerTwoVictoryPoints;

        newListOfOpponentsIdsPlayerTwo.push(gameResult.gameAfter.playerOneTournamentPlayerId);
        opponentIdsTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] = newListOfOpponentsIdsPlayerTwo;

        const playerTwoRankingRef = this.fireDB
          .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerTwo.id);
        playerTwoRankingRef.update(
          {
            score: newScorePlayerTwo,
            controlPoints: newCPPlayerTwo,
            victoryPoints: newVPPlayerTwo,
            opponentTournamentPlayerIds: newListOfOpponentsIdsPlayerTwo
          });

        if (!gameResult.gameBefore.finished) {
          scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] = newScorePlayerTwo;
        } else if (gameResult.gameBefore.playerTwoScore < gameResult.gameAfter.playerTwoScore) {
          scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] =
            scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] + 1;
        } else if (gameResult.gameBefore.playerTwoScore > gameResult.gameAfter.playerTwoScore) {
          scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] =
            scoreTournamentPlayerMap[rankingPlayerTwo.tournamentPlayerId] - 1;
        }
      }


      if (i > gameResult.gameAfter.tournamentRound && actualRoundGamePlayerTwo) {
        if (gameResult.gameAfter.playerTwoTournamentPlayerId === actualRoundGamePlayerTwo.playerOneTournamentPlayerId) {
          newScorePlayerTwo = lastRoundRankingPlayerTwo.score + actualRoundGamePlayerTwo.playerOneScore;
          newCPPlayerTwo = lastRoundRankingPlayerTwo.controlPoints + actualRoundGamePlayerTwo.playerOneControlPoints;
          newVPPlayerTwo = lastRoundRankingPlayerTwo.victoryPoints + actualRoundGamePlayerTwo.playerOneVictoryPoints;
        } else {
          newScorePlayerTwo = lastRoundRankingPlayerTwo.score + actualRoundGamePlayerTwo.playerTwoScore;
          newCPPlayerTwo = lastRoundRankingPlayerTwo.controlPoints + actualRoundGamePlayerTwo.playerTwoControlPoints;
          newVPPlayerTwo = lastRoundRankingPlayerTwo.victoryPoints + actualRoundGamePlayerTwo.playerTwoVictoryPoints;
        }

        const playerTwoRankingRef = this.fireDB
          .object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankingPlayerTwo.id);
        playerTwoRankingRef.update(
          {
            score: newScorePlayerTwo,
            controlPoints: newCPPlayerTwo,
            victoryPoints: newVPPlayerTwo,
          });
      }

      // SOS calculation for round
      _.each(allRankingsFromSameRound, function (rankToUpdate: TournamentRanking) {

        let newSos = 0;
        _.each(opponentIdsTournamentPlayerMap[rankToUpdate.tournamentPlayerId], function (opponentTournamentPlayerId: string) {
          const opponentScore: number = scoreTournamentPlayerMap[opponentTournamentPlayerId];
          newSos = newSos + opponentScore;

        });

        const rankRef = that.fireDB.object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rankToUpdate.id);
        rankRef.update({'sos': newSos});

      });
    } // loop over game result round till actual rounds


  }

}

