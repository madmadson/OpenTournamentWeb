import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import * as _ from 'lodash';
import {TournamentGame} from '../../../shared/model/tournament-game';

import {TournamentManagementConfiguration} from '../../../shared/dto/tournament-management-configuration';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {SwapGames} from '../../../shared/dto/swap-player';
import {GameResult} from '../../../shared/dto/game-result';
import {AppState} from '../store/reducers/index';

import {
  ADD_ACTUAL_TOURNAMENT_GAME_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_GAME_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_GAMES_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_GAME_ACTION,
} from 'app/tournament/store/tournament-actions';
import {
  ADD_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_GAMES_ACTION, ADD_ALL_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION,
  LOAD_TOURNAMENT_GAMES_FINISHED_ACTION, LOAD_TOURNAMENT_TEAM_GAMES_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION
} from './store/tournament-actions';
import {ActualTournamentRankingService} from './actual-tournament-ranking.service';


@Injectable()
export class ActualTournamentTeamGamesService {

  tournamentTeamGamesRef: firebase.database.Reference;


  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>) {

  }

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION});
    if (this.tournamentTeamGamesRef) {
      this.tournamentTeamGamesRef.off();
    }
  }


  public subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allTeamGames: TournamentGame[] = [];
    let newItems = false;

    this.tournamentTeamGamesRef = firebase.database().ref('tournament-team-games/' + tournamentId);

    this.tournamentTeamGamesRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION, payload: tournamentGame});

    });

    this.tournamentTeamGamesRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION, payload: tournamentGame});

    });

    this.tournamentTeamGamesRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }
      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION, payload: snapshot.key});
    });

    this.tournamentTeamGamesRef.once('value', function (snapshot) {


      snapshot.forEach(function (gameSnapshot) {

        const tournamentGame: TournamentGame = TournamentGame.fromJson(gameSnapshot.val());
        tournamentGame.id = gameSnapshot.key;
        allTeamGames.push(tournamentGame);
        return false;
      });

    }).then(function () {
      that.store.dispatch({type: LOAD_TOURNAMENT_TEAM_GAMES_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION, payload: allTeamGames});
      newItems = true;
    });
  }



}

