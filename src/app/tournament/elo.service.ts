import {Injectable} from '@angular/core';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import * as _ from 'lodash';

import {TournamentGame} from '../../../shared/model/tournament-game';
import {Registration} from '../../../shared/model/registration';
import {Tournament} from '../../../shared/model/tournament';
import {getEloFactorForPlayer} from '../../../shared/model/player';


@Injectable()
export class EloService {

  constructor(private afoDatabase: AngularFireOfflineDatabase) {
  }


  calculateEloForTournament(actualTournament: Tournament,
                            allRegistrations: Registration[],
                            allGames: TournamentGame[]) {

    const that = this;

    const playersEloChanges: EloChange[] = [];
    const gamesRef = this.afoDatabase.list('games');

    _.forEach(allGames, function (game: TournamentGame) {


      if (game.playerOnePlayerId && game.playerTwoPlayerId) {
        const eloDifferenceForPlayerOne = game.playerTwoElo - game.playerOneElo;
        const percentagePlayerOne = 1 / (1 + Math.pow(10, (eloDifferenceForPlayerOne / 400)));

        const eloDifferenceForPlayerTwo = game.playerOneElo - game.playerTwoElo;
        const percentagePlayerTwo = 1 / ( 1 + Math.pow(10, (eloDifferenceForPlayerTwo / 400)));

        let newEloPlayerOne;
        let newEloPlayerTwo;

        let eloFactor: number = getEloFactorForPlayer(game.playerOneElo);

        if (game.playerOneScore > game.playerTwoScore) {
          newEloPlayerOne = game.playerOneElo + (Math.round(eloFactor * (1 - percentagePlayerOne)));
        } else if (game.playerOneScore === game.playerTwoScore) {
          newEloPlayerOne = game.playerOneElo + (Math.round(eloFactor * (0.5 - percentagePlayerOne)));
        } else {
          newEloPlayerOne = game.playerOneElo + (Math.round(eloFactor * (0 - percentagePlayerOne)));
        }

        eloFactor = getEloFactorForPlayer(game.playerTwoElo);

        if (game.playerOneScore < game.playerTwoScore) {
          newEloPlayerTwo = game.playerTwoElo + ( Math.round(eloFactor * (1 - percentagePlayerTwo)));
        } else if (game.playerOneScore === game.playerTwoElo) {
          newEloPlayerTwo = game.playerTwoElo + (Math.round(eloFactor * (0.5 - percentagePlayerTwo)));
        } else {
          newEloPlayerTwo = game.playerTwoElo + (Math.round(eloFactor * (0 - percentagePlayerTwo)));
        }

        game.playerOneEloChanging = (newEloPlayerOne - game.playerOneElo);
        game.playerTwoEloChanging = (newEloPlayerTwo - game.playerTwoElo);

        const playerOneGameTournamentRef = that.afoDatabase.object('players-games/' + game.playerOnePlayerId + '/' + game.id);
        playerOneGameTournamentRef.set(game);

        const playerTwoGameTournamentRef = that.afoDatabase.object('players-games/' + game.playerTwoPlayerId + '/' + game.id);
        playerTwoGameTournamentRef.set(game);

        playersEloChanges.push({playerId: game.playerOnePlayerId, eloChange: (newEloPlayerOne - game.playerOneElo)});
        playersEloChanges.push({playerId: game.playerTwoPlayerId, eloChange: (newEloPlayerTwo - game.playerTwoElo)});
      }

      gamesRef.push(game);

    });

    _.forEach(allRegistrations, function (registration: Registration) {

      const playersRegRef = that.afoDatabase.object('players-registrations/' + registration.playerId + '/' + registration.id);
      playersRegRef.remove();

      if (registration.playerId) {
        const playersTournamentRef = that.afoDatabase.list('players-tournaments/' + registration.playerId);
        playersTournamentRef.push(actualTournament);

        let eloChangeForPlayer = 0;
        _.each(playersEloChanges, function (eloChange: EloChange) {

          if (registration.playerId === eloChange.playerId) {
            eloChangeForPlayer = eloChangeForPlayer + eloChange.eloChange;
          }
        });
        const finalNewElo = registration.elo + eloChangeForPlayer;

        const playerOneRef = that.afoDatabase.object('players/' + registration.playerId);
        playerOneRef.update({'elo': finalNewElo});
      }
    });
  }

}


class EloChange {

  playerId: string;
  eloChange: number;

}
