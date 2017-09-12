import {Store} from '@ngrx/store';
import {AppState} from '../store/reducers/index';
import {Injectable} from '@angular/core';

import {AngularFireOfflineDatabase} from 'angularfire2-offline';

import {MdSnackBar} from '@angular/material';

import * as _ from 'lodash';
import * as firebase from 'firebase';

import {TournamentTeam} from '../../../shared/model/tournament-team';
import {
  ADD_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, ADD_ALL_ACTUAL_TOURNAMENT_TEAMS_ACTION,
  CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION,
  CLEAR_ACTUAL_TOURNAMENT_TEAMS_ACTION, LOAD_TEAMS_FINISHED_ACTION, REMOVE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION
} from './store/tournament-actions';
import {TournamentTeamEraseModel} from '../../../shared/dto/tournament-team-erase';
import {TournamentPlayer} from '../../../shared/model/tournament-player';



@Injectable()
export class ActualTournamentTeamsService {

  private tournamentTeamsRef: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              private store: Store<AppState>,
              private snackBar: MdSnackBar) {

  }


  unsubscribeOnFirebase() {

    this.store.dispatch({type: CLEAR_ACTUAL_TOURNAMENT_TEAMS_ACTION});
    if (this.tournamentTeamsRef) {
      this.tournamentTeamsRef.off();
    }
  }

  subscribeOnFirebase(tournamentId: string) {

    const that = this;
    const allTournamentTeams: TournamentTeam[] = [];
    let newItems = false;

    this.tournamentTeamsRef = firebase.database().ref('tournament-teams/' + tournamentId);

    this.tournamentTeamsRef.on('child_added', function (snapshot) {

      if (!newItems) {
        return;
      }

      const team: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      team.id = snapshot.key;

      that.store.dispatch({type: ADD_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: team});

    });

    this.tournamentTeamsRef.on('child_changed', function (snapshot) {

      if (!newItems) {
        return;
      }

      const team: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      team.id = snapshot.key;

      that.store.dispatch({type: CHANGE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: team});
    });

    this.tournamentTeamsRef.on('child_removed', function (snapshot) {

      if (!newItems) {
        return;
      }

      that.store.dispatch({type: REMOVE_ACTUAL_TOURNAMENT_TEAM_REGISTRATION_ACTION, payload: snapshot.key});
    });

    this.tournamentTeamsRef.once('value', function (snapshot) {

      snapshot.forEach(function (regSnapshot) {

        const reg: TournamentTeam = TournamentTeam.fromJson(regSnapshot.val());
        reg.id = regSnapshot.key;
        allTournamentTeams.push(reg);
        return false;

      });
    }).then(function () {
      that.store.dispatch({type: LOAD_TEAMS_FINISHED_ACTION});
      that.store.dispatch({type: ADD_ALL_ACTUAL_TOURNAMENT_TEAMS_ACTION, payload: allTournamentTeams});
      newItems = true;
    });
  }

  pushTournamentTeam(team: TournamentTeam) {
    const tournamentTeamsRef = this.afoDatabase.list('tournament-teams/' + team.tournamentId);
    tournamentTeamsRef.push(team);

    this.snackBar.open('Team saved successfully', '', {
      duration: 5000
    });
  }

  eraseTournamentTeam(tournamentTeamErase: TournamentTeamEraseModel) {

    const that = this;

    const tournamentTeamsRef = this.afoDatabase.
    object('tournament-teams/' + tournamentTeamErase.tournament.id + '/' + tournamentTeamErase.team.id);
    tournamentTeamsRef.remove();

    if (tournamentTeamErase.team.isRegisteredTeam) {
      const tournamentTeamsRegRef = that.afoDatabase.
      object('tournament-team-registrations/' + tournamentTeamErase.tournament.id + '/' + tournamentTeamErase.team.id);
      tournamentTeamsRegRef.update({isAcceptedTournamentTeam: false});
    }

    _.forEach(tournamentTeamErase.players, function (player: TournamentPlayer) {
      const playerRef = that.afoDatabase.list('tournament-players/' + player.tournamentId + '/' + player.id);
      playerRef.remove();
    });

    this.snackBar.open('Tournament Team deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }
}
