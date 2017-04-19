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
import {PairingConfiguration} from '../../../shared/model/pairing-configuration';
import {TournamentGame} from '../../../shared/model/tournament-game';


@Injectable()
export class TournamentRankingService implements OnDestroy {

  tournamentRankingsRef: firebase.database.Reference;

  allPlayers: TournamentPlayer[];
  allRankings: TournamentRanking[];
  actualTournament: Tournament;

  constructor(protected fireDB: AngularFireDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;
      this.allRankings = state.actualTournamentRankings.actualTournamentRankings;
      this.actualTournament = state.actualTournament.actualTournament;
    });

  }

  ngOnDestroy(): void {

  }

  public subscribeOnTournamentRankings(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearRankingAction());

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

    console.log('push ranking for round: ' + config.round);

    const lastRoundRankings: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (config.round - 1));
    });
    console.log('lastRoundRankings: ' + JSON.stringify(lastRoundRankings));

    _.forEach(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {

      console.log('add ranking for: ' + JSON.stringify(tournamentPlayer));

      const newTournamentRanking = new TournamentRanking(
        tournamentPlayer.tournamentId,
        tournamentPlayer.playerId,
        tournamentPlayer.playerName,
        tournamentPlayer.faction ? tournamentPlayer.faction : '',
        tournamentPlayer.teamName ? tournamentPlayer.teamName : '',
        tournamentPlayer.origin ? tournamentPlayer.origin : '',
        tournamentPlayer.meta ? tournamentPlayer.meta : '',
        tournamentPlayer.elo ? tournamentPlayer.elo : 0,
        0, 0, 0, 0, 1, []);

      _.each(lastRoundRankings, function (lastRoundRanking: TournamentRanking) {

        if (lastRoundRanking.playerId === tournamentPlayer.playerId) {
          console.log('lastRoundRanking: ' + JSON.stringify(lastRoundRanking));

          newTournamentRanking.score = lastRoundRanking.score;
          newTournamentRanking.sos = lastRoundRanking.sos;
          newTournamentRanking.controlPoints = lastRoundRanking.controlPoints;
          newTournamentRanking.victoryPoints = lastRoundRanking.victoryPoints;
          newTournamentRanking.tournamentRound = config.round;
          newTournamentRanking.opponentPlayerIds = lastRoundRanking.opponentPlayerIds;
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

    console.log('erase ranking for round: ' + config.round);

    const query = this.fb.database().ref('tournament-rankings/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }

  updateRanking(game: TournamentGame) {

    console.log('update ranking: ' + game.tournamentRound);

    this.updatePlayerOneRanking(game);
    this.updatePlayerTwoRanking(game);


    this.updateSos(game);

  }


  private updatePlayerOneRanking(game: TournamentGame) {



    const lastRoundRankingPlayerOne: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (game.tournamentRound - 1) && ranking.playerId === game.playerOnePlayerId);
    })[0];

    const rankingPlayerOne: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (game.tournamentRound) && ranking.playerId === game.playerOnePlayerId);
    })[0];

    let newScorePlayerOne = game.playerOneScore;
    let newCPPlayerOne = game.playerOneControlPoints;
    let newVPPlayerOne = game.playerOneVictoryPoints;
    let newListOfOpponentPlayerIds = [game.playerTwoPlayerId];

    if (lastRoundRankingPlayerOne) {
      newScorePlayerOne = newScorePlayerOne + lastRoundRankingPlayerOne.score;
      newCPPlayerOne = newCPPlayerOne + lastRoundRankingPlayerOne.controlPoints;
      newVPPlayerOne = newVPPlayerOne + lastRoundRankingPlayerOne.victoryPoints;
      newListOfOpponentPlayerIds = _.union(newListOfOpponentPlayerIds, lastRoundRankingPlayerOne.opponentPlayerIds);
    }

    const rankingRef = this.fireDB.object('tournament-rankings/' + game.tournamentId + '/' + rankingPlayerOne.id);
    rankingRef.update(
      {
        score: newScorePlayerOne,
        controlPoints: newCPPlayerOne,
        victoryPoints: newVPPlayerOne,
        opponentPlayerIds: newListOfOpponentPlayerIds
      });

  }

  private updatePlayerTwoRanking(game: TournamentGame) {



    const lastRoundRankingPlayerTwo: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (game.tournamentRound - 1) && ranking.playerId === game.playerTwoPlayerId);
    })[0];

    const rankingPlayerTwo: TournamentRanking = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (game.tournamentRound) && ranking.playerId === game.playerTwoPlayerId);
    })[0];

    let newScorePlayerTwo = game.playerTwoScore;
    let newCPPlayerTwo = game.playerTwoControlPoints;
    let newVPPlayerTwo = game.playerTwoVictoryPoints;
    let newListOfOpponentPlayerIds = [game.playerOnePlayerId];

    if (lastRoundRankingPlayerTwo) {
      newScorePlayerTwo = newScorePlayerTwo + lastRoundRankingPlayerTwo.score;
      newCPPlayerTwo = newCPPlayerTwo + lastRoundRankingPlayerTwo.controlPoints;
      newVPPlayerTwo = newVPPlayerTwo + lastRoundRankingPlayerTwo.victoryPoints;
      newListOfOpponentPlayerIds = _.union(newListOfOpponentPlayerIds, lastRoundRankingPlayerTwo.opponentPlayerIds);
    }

    const rankingRef = this.fireDB.object('tournament-rankings/' + game.tournamentId + '/' + rankingPlayerTwo.id);
    rankingRef.update(
      {
        score: newScorePlayerTwo,
        controlPoints: newCPPlayerTwo,
        victoryPoints: newVPPlayerTwo,
        opponentPlayerIds: newListOfOpponentPlayerIds
      });
  }

  private updateSos(game: TournamentGame) {

    const that = this;

    const allActualRankings: TournamentRanking[] = _.filter(this.allRankings, function (ranking: TournamentRanking) {
      return (ranking.tournamentRound === (game.tournamentRound));
    });

    _.each(allActualRankings, function (myRanking: TournamentRanking) {
      let newSosForOpponent = 0;

      _.each(allActualRankings, function (innerRanking: TournamentRanking) {
        const isOpponent = _.find(myRanking.opponentPlayerIds, function (enemyPlayerId) {
          return enemyPlayerId === innerRanking.playerId;
        });
        if (isOpponent) {
          newSosForOpponent  = newSosForOpponent + innerRanking.score;
        }
      });
      const opponentRankRef = that.fireDB.object('tournament-rankings/' + game.tournamentId + '/' + myRanking.id);
      opponentRankRef.update({sos: newSosForOpponent});
    });
  }

}
