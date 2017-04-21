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
import {PairingConfiguration} from '../../../shared/dto/pairing-configuration';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {GameResult} from '../../../shared/dto/game-result';


@Injectable()
export class TournamentRankingService implements OnDestroy {

  tournamentRankingsRef: firebase.database.Reference;

  allPlayers: TournamentPlayer[];
  allRankings: TournamentRanking[];
  allGames: TournamentGame[];
  actualTournament: Tournament;

  constructor(protected fireDB: AngularFireDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;
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

  pushRankingForRound(config: PairingConfiguration): TournamentRanking[] {

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

  eraseRankingsForRound(config: PairingConfiguration) {

    const query = this.fb.database().ref('tournament-rankings/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }

  updateRanking(gameResult: GameResult) {

    const that = this;
    const roundOfGameResult = gameResult.gameAfter.tournamentRound;

    for (let i = roundOfGameResult; i <= this.actualTournament.actualRound; i++) {

      const allRankingsFromSameRound: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
        return (ranking.tournamentRound === i);
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

      let newScorePlayerOne = 0;
      let newCPPlayerOne = 0;
      let newVPPlayerOne = 0;
      let newListOfOpponentsIdsPlayerOne = [];

      if (i === gameResult.gameAfter.tournamentRound) {

        newScorePlayerOne = newScorePlayerOne + gameResult.gameAfter.playerOneScore;
        newCPPlayerOne = newCPPlayerOne + gameResult.gameAfter.playerOneControlPoints;
        newVPPlayerOne = newVPPlayerOne + gameResult.gameAfter.playerOneVictoryPoints;

        newListOfOpponentsIdsPlayerOne.push(gameResult.gameAfter.playerTwoTournamentPlayerId);
      }

      if (lastRoundRankingPlayerOne) {
        newScorePlayerOne = newScorePlayerOne + lastRoundRankingPlayerOne.score;
        newCPPlayerOne = newCPPlayerOne + lastRoundRankingPlayerOne.controlPoints;
        newVPPlayerOne = newVPPlayerOne + lastRoundRankingPlayerOne.victoryPoints;

        newListOfOpponentsIdsPlayerOne =
          _.union(newListOfOpponentsIdsPlayerOne, lastRoundRankingPlayerOne.opponentTournamentPlayerIds);
      }

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
        let newSosPlayerOne = rankingPlayerTwo.score + gameResult.gameAfter.playerTwoScore;
        if (lastRoundRankingPlayerOne) {
          newSosPlayerOne = newSosPlayerOne + lastRoundRankingPlayerOne.sos;
        }
        playerOneRankingRef.update(
          {
            sos: newSosPlayerOne,
          });
      }

      _.each(rankingPlayerOne.opponentTournamentPlayerIds, function (opponentTournamentPlayerId: string) {
        _.each(allRankingsFromSameRound, function (rank: TournamentRanking) {
          if (opponentTournamentPlayerId === rank.tournamentPlayerId) {
            const opponentRankRef = that.fireDB.object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rank.id);

            if (!gameResult.gameBefore.finished) {
              opponentRankRef.update({'sos': (rank.sos + gameResult.gameAfter.playerOneScore)});
            } else if (gameResult.gameBefore.playerOneScore < gameResult.gameAfter.playerOneScore) {
              opponentRankRef.update({'sos': (rank.sos + 1)});
            } else if (gameResult.gameBefore.playerOneScore > gameResult.gameAfter.playerOneScore) {
              opponentRankRef.update({'sos': (rank.sos - 1)});
            }
          }
        });
      });

      let newScorePlayerTwo = 0;
      let newCPPlayerTwo = 0;
      let newVPPlayerTwo = 0;
      let newListOfOpponentsIdsPlayerTwo = [];

      if (i === gameResult.gameAfter.tournamentRound) {

        newScorePlayerTwo = newScorePlayerTwo + gameResult.gameAfter.playerTwoScore;
        newCPPlayerTwo = newCPPlayerTwo + gameResult.gameAfter.playerTwoControlPoints;
        newVPPlayerTwo = newVPPlayerTwo + gameResult.gameAfter.playerTwoVictoryPoints;

        newListOfOpponentsIdsPlayerTwo.push(gameResult.gameAfter.playerOneTournamentPlayerId);
      }

      if (lastRoundRankingPlayerTwo) {
        newScorePlayerTwo = newScorePlayerTwo + lastRoundRankingPlayerTwo.score;
        newCPPlayerTwo = newCPPlayerTwo + lastRoundRankingPlayerTwo.controlPoints;
        newVPPlayerTwo = newVPPlayerTwo + lastRoundRankingPlayerTwo.victoryPoints;

        newListOfOpponentsIdsPlayerTwo =
          _.union(newListOfOpponentsIdsPlayerTwo, lastRoundRankingPlayerTwo.opponentTournamentPlayerIds);
      }

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
        let newSosPlayerTwo = rankingPlayerOne.score + gameResult.gameAfter.playerOneScore;
        if (lastRoundRankingPlayerTwo) {
          newSosPlayerTwo = newSosPlayerTwo + lastRoundRankingPlayerTwo.sos;
        }
        playerTwoRankingRef.update(
          {
            sos: newSosPlayerTwo,
          });
      }


      _.each(rankingPlayerTwo.opponentTournamentPlayerIds, function (opponentTournamentPlayerId: string) {
        _.each(allRankingsFromSameRound, function (rank: TournamentRanking) {
          if (opponentTournamentPlayerId === rank.tournamentPlayerId) {
            const opponentRankRef = that.fireDB.object('tournament-rankings/' + gameResult.gameAfter.tournamentId + '/' + rank.id);

            if (!gameResult.gameBefore.finished) {
              opponentRankRef.update({'sos': (rank.sos + gameResult.gameAfter.playerTwoScore)});
            } else if (gameResult.gameBefore.playerTwoScore < gameResult.gameAfter.playerTwoScore) {
              opponentRankRef.update({'sos': (rank.sos + 1)});
            } else if (gameResult.gameBefore.playerTwoScore > gameResult.gameAfter.playerTwoScore) {
              opponentRankRef.update({'sos': (rank.sos - 1)});
            }
          }
        });
      });
    }
  }

}
