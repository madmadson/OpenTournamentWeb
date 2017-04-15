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
  DeleteTournamentGameAction
} from '../store/actions/tournament-games-actions';


@Injectable()
export class TournamentGameService implements OnDestroy {

  tournamentGamesRef: firebase.database.Reference;
  allRankings: TournamentRanking[];
  allPlayers: TournamentPlayer[];

  private newGames: TournamentGame[];

  constructor(protected fireDB: AngularFireDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {

      this.allRankings = state.actualTournamentRankings.actualTournamentRankings;
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;

    });
  }

  ngOnDestroy(): void {

  }

  public subscribeOnTournamentGames(tournamentId: string) {

    const that = this;

    this.tournamentGamesRef = this.fb.ref('tournament-games/' + tournamentId);

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


  createGamesForRound(newRankings: TournamentRanking[]): boolean {

    console.log('actual rankings: ' + JSON.stringify(newRankings));

    const sortedRankings = _.sortBy(newRankings, ['score']);


    this.newGames = [];

    const megaSuccess = this.matchGame(sortedRankings);

    if (!megaSuccess) {
      return false;
    }

    const tournamentGamesRef = this.fireDB
      .list('tournament-games/' + newRankings[0].tournamentId);

    _.forEach(this.newGames, function (newGame: TournamentGame) {
      tournamentGamesRef.push(newGame);
    });

    return true;

  }

  private matchGame(copiedRankings: TournamentRanking[]): boolean {

    const gamesToCalculate = copiedRankings.length;

    if (gamesToCalculate === 0) {
      return true;
    }

    let i: number;
    let j: number;
    for (i = 0; i < (gamesToCalculate - 1); i++) {

      const player1: TournamentRanking = copiedRankings[i];

      for (j = i + 1; j < (gamesToCalculate); j++) {

        const player2: TournamentRanking = copiedRankings[j];

        const alreadyPlayingAgainstEachOther = _.find(player1.opponentPlayerIds,
          function (player1OpponentPlayerId: string) {
            return player1OpponentPlayerId === player2.playerId;
          });

        if (alreadyPlayingAgainstEachOther) {
          console.log('player1: ' + JSON.stringify(player1) + ' already played against player2: ' + JSON.stringify(player2));
          continue;
        }

        if (player1.score - 1 > player2.score) {
          continue;
        }
        const newCopiedRankings: TournamentRanking[] = copiedRankings;

         _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.playerId === player1.playerId || player.playerId === player2.playerId;
        });

        const success = this.matchGame(newCopiedRankings);

        if (success) {
          const newGame = new TournamentGame(
            player1.tournamentId,
            player1.playerId, player1.playerName, 0, 0, 0, '',
            player2.playerId, player2.playerName, 0, 0, 0, '',
            player1.tournamentRound, 0, false, '');

          this.newGames.push(newGame);

          return true;
        }
      }
    }

    return false;
  }

}
