import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {AppState} from '../store/reducers/index';
import {
  ADD_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  ADD_ALL_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION,
  LOAD_TOURNAMENT_TEAM_GAMES_FINISHED_ACTION,
  REMOVE_ACTUAL_TOURNAMENT_TEAM_GAME_ACTION
} from './store/tournament-actions';
import {Subscription} from 'rxjs/Subscription';
import {AngularFireOfflineDatabase} from 'angularfire2-offline';
import * as _ from 'lodash';


@Injectable()
export class ActualTournamentTeamGamesService {

  tournamentTeamGamesRef: firebase.database.Reference;
  private offlineSub: Subscription;

  constructor(protected store: Store<AppState>,
              private afoDatabase: AngularFireOfflineDatabase) {
  }

  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION});
    if (this.tournamentTeamGamesRef) {
      this.tournamentTeamGamesRef.off();
    }

    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  public subscribeOnOfflineFirebase(tournamentId: string) {



    this.offlineSub = this.afoDatabase.list('tournament-team-games/' + tournamentId)
      .subscribe((tournamentGames) => {

        const allTeamGames: TournamentGame[] = [];

        _.forEach(tournamentGames, function (gameSnapshot) {
          const tournamentGame: TournamentGame = TournamentGame.fromJson(gameSnapshot);
          tournamentGame.id = gameSnapshot.$key;

          allTeamGames.push(tournamentGame);
        });
        this.store.dispatch({type: LOAD_TOURNAMENT_TEAM_GAMES_FINISHED_ACTION});
        this.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_TEAM_GAMES_ACTION, payload: allTeamGames});
      });
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


