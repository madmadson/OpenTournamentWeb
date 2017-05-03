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
import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {Tournament} from '../../../shared/model/tournament';
import {Registration} from '../../../shared/model/registration';


@Injectable()
export class TournamentGameService implements OnDestroy {

  tournamentGamesRef: firebase.database.Reference;
  allRankings: TournamentRanking[];
  allPlayers: TournamentPlayer[];
  allGames: TournamentGame[];
  actualTournament: Tournament;
  allRegistrations: Registration[];

  private newGames: TournamentGame[];

  constructor(protected fireDB: AngularFireDatabase,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

    this.store.select(state => state).subscribe(state => {

      this.actualTournament = state.actualTournament.actualTournament;
      this.allRankings = state.actualTournamentRankings.actualTournamentRankings;
      this.allPlayers = state.actualTournamentPlayers.actualTournamentPlayers;
      this.allGames = state.actualTournamentGames.actualTournamentGames;
      this.allRegistrations = state.actualTournamentRegistrations.actualTournamentRegisteredPlayers;

    });
  }

  ngOnDestroy(): void {
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }
  }

  public subscribeOnTournamentGames(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearTournamentGamesAction());
    if (this.tournamentGamesRef) {
      this.tournamentGamesRef.off();
    }

    console.log('subscribeOnTournamentGames');

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


  createGamesForRound(config: TournamentManagementConfiguration, newRankings: TournamentRanking[]): boolean {

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

  private matchGame(config: TournamentManagementConfiguration, copiedRankings: TournamentRanking[]): boolean {

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

        let inSameTeam = false;
        if (config.teamRestriction) {
           inSameTeam = ranking1.teamName === ranking2.teamName;
        }

        let sameMeta = false;
        if (config.metaRestriction) {
          sameMeta = ranking1.meta === ranking2.meta;
        }

        let sameOrigin = false;
        if (config.originRestriction) {
          sameOrigin = ranking1.origin === ranking2.origin;
        }

        let sameCountry = false;
        if (config.countryRestriction) {
          sameCountry = ranking1.country === ranking2.country;
        }

        if (alreadyPlayingAgainstEachOther || inSameTeam || sameMeta || sameOrigin || sameCountry) {
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
            0, 0, 0, '', 0,
            ranking2.playerId, ranking2.tournamentPlayerId,
            ranking2.playerName, ranking2.elo, ranking2.faction,
            0, 0, 0, '', 0,
            config.round, (gamesToCalculate / 2),  false, '');

          this.newGames.push(newGame);

          return true;
        }
      }
    }

    return false;
  }

  eraseGamesForRound(config: TournamentManagementConfiguration) {

    const query = this.fb.database().ref('tournament-games/' + config.tournamentId).orderByChild('tournamentRound')
      .equalTo(config.round);

    query.once('value', function (snapshot) {

      snapshot.forEach(function (child) {
        child.ref.remove();
      });
    });
  }

  calculateEloForTournament() {

    const that = this;



    _.each(this.allRegistrations, function (reg: Registration) {

      const playersRegRef = that.fireDB.object('players-registrations/' + reg.playerId + '/' + reg.id);
      playersRegRef.remove();
    });

    const tournamentRegRef = that.fireDB.list('tournament-registrations/' + that.actualTournament.id);
    tournamentRegRef.remove();

    const playersEloChanges: EloChange[] = [];
    const gamesRef = this.fireDB.list('games');

    _.each(this.allGames, function (game: TournamentGame) {
      gamesRef.push(game);
      if (game.playerOnePlayerId) {
        const playersGamesTournamentRef = that.fireDB.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
        playersGamesTournamentRef.set(game);
      }
      if (game.playerTwoPlayerId) {
        const playersGamesTournamentRef = that.fireDB.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
        playersGamesTournamentRef.set(game);
      }

      if (game.playerOnePlayerId && game.playerTwoPlayerId) {
        const valueOnePlayerOne = ((game.playerOneElo - game.playerTwoElo) / 400);
        const valueTwoPlayerOne = 1 + Math.pow(10, valueOnePlayerOne);
        const expectancyValuePlayerOne = 1 / valueTwoPlayerOne;

        const valueOnePlayerTwo = ((game.playerTwoElo - game.playerOneElo) / 400);
        const valueTwoPlayerTwo = 1 + Math.pow(10, valueOnePlayerTwo);
        const expectancyValuePlayerTwo = 1 / valueTwoPlayerTwo;

        let newEloPlayerOne;
        let newEloPlayerTwo;

        if (game.playerOneScore > game.playerTwoScore) {
          newEloPlayerOne = Math.round(game.playerOneElo + 40 * (1 - expectancyValuePlayerOne));
        } else if (game.playerOneScore === game.playerTwoScore) {
          newEloPlayerOne = Math.round(game.playerOneElo + 40 * (0.5 - expectancyValuePlayerOne));
        } else {
          newEloPlayerOne = Math.round(game.playerOneElo + 40 * (0 - expectancyValuePlayerOne));
        }

        if (game.playerOneScore < game.playerTwoScore) {
          newEloPlayerTwo = Math.round(game.playerTwoElo + 40 * (1 - expectancyValuePlayerTwo));
        } else if (game.playerOneScore === game.playerTwoElo) {
          newEloPlayerTwo = Math.round(game.playerTwoElo + 40 * (0.5 - expectancyValuePlayerTwo));
        } else {
          newEloPlayerTwo = Math.round(game.playerTwoElo + 40 * (0 - expectancyValuePlayerTwo));
        }
        const playerOneGameTournamentRef = that.fireDB.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
        playerOneGameTournamentRef.update({
            'playerOneEloChanging': (newEloPlayerOne - game.playerOneElo),
            'playerTwoEloChanging': (newEloPlayerTwo - game.playerTwoElo)
          });

        const playerTwoGameTournamentRef = that.fireDB.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
        playerTwoGameTournamentRef.update({
          'playerOneEloChanging': (newEloPlayerOne - game.playerOneElo),
          'playerTwoEloChanging': (newEloPlayerTwo - game.playerTwoElo)
        });
        playersEloChanges.push({playerId: game.playerOnePlayerId, eloChange: (newEloPlayerOne - game.playerOneElo)});
        playersEloChanges.push({playerId: game.playerTwoPlayerId, eloChange: (newEloPlayerTwo - game.playerTwoElo)});
      }
    });

    _.each(this.allPlayers, function (tournamentPlayer: TournamentPlayer) {

      if (tournamentPlayer.playerId) {
        const playersTournamentRef = that.fireDB.list('players-tournaments/' + tournamentPlayer.playerId);
        playersTournamentRef.push(that.actualTournament);

        let eloChangeForPlayer = 0;
        _.each(playersEloChanges, function (eloChange: EloChange) {

          if (tournamentPlayer.playerId === eloChange.playerId) {
            eloChangeForPlayer = eloChangeForPlayer + eloChange.eloChange;
          }
        });
        const finalNewElo = tournamentPlayer.elo + eloChangeForPlayer;

        const playerOneRef = that.fireDB.object('players/' + tournamentPlayer.playerId);
        playerOneRef.update({'elo': finalNewElo});
      }
    });
  }
}

class EloChange {

  playerId: string;
  eloChange: number;

}
