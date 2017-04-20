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
  DeleteTournamentGameAction,
  ClearTournamentGamesAction,
} from '../store/actions/tournament-games-actions';
import {PairingConfiguration} from '../../../shared/model/pairing-configuration';


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
    this.tournamentGamesRef.off();
  }

  public subscribeOnTournamentGames(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearTournamentGamesAction());

    this.tournamentGamesRef = this.fb.database().ref('tournament-games/' + tournamentId);

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


  createGamesForRound(config: PairingConfiguration, newRankings: TournamentRanking[]): boolean {

    this.eraseGamesForRound(config);

    const shuffledRankings = _.shuffle(newRankings);
    const sortedRankings = _.sortBy(shuffledRankings, ['score']);

    this.newGames = [];

    const megaSuccess = this.matchGame(config, sortedRankings);

    if (!megaSuccess) {
      return false;
    }

    const tournamentGamesRef = this.fireDB
      .list('tournament-games/' + config.tournamentId);

    _.forEach(this.newGames, function (newGame: TournamentGame) {
      tournamentGamesRef.push(newGame);
    });

    return true;

  }

  private matchGame(config: PairingConfiguration, copiedRankings: TournamentRanking[]): boolean {

    const gamesToCalculate = copiedRankings.length;
    if (gamesToCalculate === 0) {
      return true;
    }

    let i: number;
    let j: number;
    for (i = 0; i < (gamesToCalculate - 1); i++) {

      const ranking1: TournamentRanking = copiedRankings[i];

      for (j = i + 1; j < (gamesToCalculate); j++) {

        const ranking2: TournamentRanking = copiedRankings[j];

        const alreadyPlayingAgainstEachOther = _.find(ranking1.opponentTournamentPlayerIds,
          function (player1OpponentTournamentPlayerId: string) {
            return player1OpponentTournamentPlayerId === ranking2.tournamentPlayerId;
          });

        if (alreadyPlayingAgainstEachOther) {
          continue;
        }

        if (ranking1.score - 1 > ranking2.score) {
          continue;
        }
        const newCopiedRankings: TournamentRanking[] = copiedRankings;

         _.remove(newCopiedRankings, function (player: TournamentRanking) {
          return player.tournamentPlayerId === ranking1.tournamentPlayerId ||
                 player.tournamentPlayerId === ranking2.tournamentPlayerId;
        });

        const success = this.matchGame(config, newCopiedRankings);

        if (success) {
          const newGame = new TournamentGame(
            config.tournamentId,
            ranking1.playerId, ranking1.tournamentPlayerId,
            ranking1.playerName, ranking1.elo, ranking1.faction,
            0, 0, 0, '',
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.elo, ranking2.faction,
            0, 0, 0, '',
            ranking1.tournamentRound, config.round, false, '');

          this.newGames.push(newGame);

          return true;
        }
      }
    }

    return false;
  }

  eraseGamesForRound(config: PairingConfiguration) {

    const query = this.fb.database().ref('tournament-games/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }
}
