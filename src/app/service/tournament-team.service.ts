import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import * as firebase from 'firebase';

import {
  AddTournamentTeamAction, AddTournamentTeamRegistrationAction, ChangeTournamentTeamAction,
  ChangeTournamentTeamRegistrationAction, ClearTournamentTeamRegistrationsAction,
  ClearTournamentTeamsAction, DeleteTournamentTeamAction, DeleteTournamentTeamRegistrationAction
} from '../store/actions/tournament-teams-actions';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {MdSnackBar} from '@angular/material';
import {TeamRegistrationPush} from '../../../shared/dto/team-registration-push';
import {Registration} from '../../../shared/model/registration';

import * as _ from 'lodash';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {TournamentTeamEraseModel} from '../../../shared/dto/tournament-team-erase';
import {
  AddTournamentTeamGameAction, ChangeTournamentTeamGameAction,
  ClearTournamentTeamGamesAction, DeleteTournamentTeamGameAction
} from '../store/actions/tournament-team-games-actions';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {
  AddTournamentTeamRankingAction, ChangeTournamentTeamRankingAction,
  ClearTeamRankingsAction, DeleteTournamentTeamRankingAction
} from '../store/actions/tournament-team-rankings-actions';
import {AngularFireOfflineDatabase} from 'angularfire2-offline/database';
import {TeamRegistrationChange} from '../../../shared/dto/team-registration-change';
import {ArmyListTeamPush} from '../../../shared/dto/team-armyList-push';
import {TeamUpdate} from '../../../shared/dto/team-update';
import {AppState} from '../store/reducers/index';



@Injectable()
export class TournamentTeamService {

  tournamentTeamsRef: firebase.database.Reference;
  tournamentTeamsRegistrationRef: firebase.database.Reference;
  tournamentTeamGamesRef: firebase.database.Reference;
  tournamentTeamRankingsRef: firebase.database.Reference;

  constructor(private afoDatabase: AngularFireOfflineDatabase,
              protected store: Store<AppState>,
              private snackBar: MdSnackBar) {
  }

  public subscribeOnTournamentTeams(tournamentId: string) {

    const that = this;
    this.store.dispatch(new ClearTournamentTeamsAction());

    if (this.tournamentTeamsRef) {
      this.tournamentTeamsRef.off();
    }

    this.tournamentTeamsRef = firebase.database().ref('tournament-teams/' + tournamentId);

    this.tournamentTeamsRef.on('child_added', function (snapshot) {

      const tournamentTeam: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      tournamentTeam.id = snapshot.key;

      that.store.dispatch(new AddTournamentTeamAction(tournamentTeam));

    });

    this.tournamentTeamsRef.on('child_changed', function (snapshot) {

      const tournamentTeam: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      tournamentTeam.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentTeamAction(tournamentTeam));

    });

    this.tournamentTeamsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentTeamAction(snapshot.key));

    });
  }

  public subscribeOnTournamentTeamRankings(tournamentId: string) {

    const that = this;
    this.store.dispatch(new ClearTeamRankingsAction());

    if (this.tournamentTeamRankingsRef) {
      this.tournamentTeamRankingsRef.off();
    }

    this.tournamentTeamRankingsRef = firebase.database().ref('tournament-team-rankings/' + tournamentId);

    this.tournamentTeamRankingsRef.on('child_added', function (snapshot) {

      const tournamentTeamRanking: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      tournamentTeamRanking.id = snapshot.key;

      that.store.dispatch(new AddTournamentTeamRankingAction(tournamentTeamRanking));

    });

    this.tournamentTeamRankingsRef.on('child_changed', function (snapshot) {

      const tournamentTeam: TournamentRanking = TournamentRanking.fromJson(snapshot.val());
      tournamentTeam.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentTeamRankingAction(tournamentTeam));

    });

    this.tournamentTeamRankingsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentTeamRankingAction(snapshot.key));

    });
  }

  public subscribeOnTournamentTeamGames(tournamentId: string) {

    const that = this;
    this.store.dispatch(new ClearTournamentTeamGamesAction());
    if (this.tournamentTeamGamesRef) {
      this.tournamentTeamGamesRef.off();
    }

    this.tournamentTeamGamesRef = firebase.database().ref('tournament-team-games/' + tournamentId);

    this.tournamentTeamGamesRef.on('child_added', function (snapshot) {

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch(new AddTournamentTeamGameAction(tournamentGame));

    });

    this.tournamentTeamGamesRef.on('child_changed', function (snapshot) {

      const tournamentGame: TournamentGame = TournamentGame.fromJson(snapshot.val());
      tournamentGame.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentTeamGameAction(tournamentGame));

    });

    this.tournamentTeamGamesRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentTeamGameAction(snapshot.key));

    });
  }

  public subscribeOnTournamentTeamRegistrations(tournamentId: string) {

    const that = this;
    this.store.dispatch(new ClearTournamentTeamRegistrationsAction());

    if (this.tournamentTeamsRegistrationRef) {
      this.tournamentTeamsRegistrationRef.off();
    }

    this.tournamentTeamsRegistrationRef = firebase.database().ref('tournament-team-registrations/' + tournamentId);

    this.tournamentTeamsRegistrationRef.on('child_added', function (snapshot) {

      const team: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      team.id = snapshot.key;

      that.store.dispatch(new AddTournamentTeamRegistrationAction(team));

    });

    this.tournamentTeamsRegistrationRef.on('child_changed', function (snapshot) {

      const tournamentTeam: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      tournamentTeam.id = snapshot.key;

      that.store.dispatch(new ChangeTournamentTeamRegistrationAction(tournamentTeam));

    });

    this.tournamentTeamsRegistrationRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new DeleteTournamentTeamRegistrationAction(snapshot.key));

    });
  }

  pushTournamentTeamRegistration(team: TournamentTeam) {
    const tournamentTeamsRef = this.afoDatabase.list('tournament-team-registrations/' + team.tournamentId);
    tournamentTeamsRef.push(team);

    this.snackBar.open('Team registered successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  acceptTournamentTeamRegistration(teamRegistrationPush: TeamRegistrationPush) {

    const that = this;

    const tournamentTeamsRegRef = this.afoDatabase.
        object('tournament-teams/' + teamRegistrationPush.tournament.id + '/' + teamRegistrationPush.team.id);
    tournamentTeamsRegRef.set(teamRegistrationPush.team);

    const teamRegistrationRef = that.afoDatabase.
        object('tournament-team-registrations/' + teamRegistrationPush.tournament.id + '/' + teamRegistrationPush.team.id);
    teamRegistrationRef.update({isAcceptedTournamentTeam: true});

    _.each(teamRegistrationPush.registrations, function (registration: Registration) {
      const tournamentPlayer = TournamentPlayer.fromRegistration(registration);

      const tournamentPlayers = that.afoDatabase.list('tournament-players/' + registration.tournamentId);
      tournamentPlayers.push(tournamentPlayer);

      const registrationRef = that.afoDatabase.
        object('tournament-registrations/' + registration.tournamentId + '/' + registration.id);
      registrationRef.update({isTournamentPlayer: true});
    });

    this.snackBar.open('Team Registration accepted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
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

    _.each(tournamentTeamErase.players, function (player: TournamentPlayer) {
        const playerRef = that.afoDatabase.list('tournament-players/' + player.tournamentId + '/' + player.id);
        playerRef.remove();
    });

    this.snackBar.open('Tournament Team deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  eraseTournamentTeamRegistration(teamRegistrationErase: TeamRegistrationPush) {

    const that = this;

    const teamRegistrationRef = this.afoDatabase.
    object('tournament-team-registrations/' + teamRegistrationErase.tournament.id + '/' + teamRegistrationErase.team.id);
      teamRegistrationRef.remove();

    _.each(teamRegistrationErase.registrations, function (reg: Registration) {
      const regRef = that.afoDatabase.list('tournament-registrations/' + reg.tournamentId + '/' + reg.id);
      regRef.remove();
    });


    this.snackBar.open('Tournament Team Registration deleted successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  addDummyTeam(tournamentId: string) {
    const dummy = new TournamentTeam(false, tournamentId, '', 'DUMMY', '', '', true, [], [], '', 'DUMMY-LEADER',
                                     false, false, false, false, 0);

    const tournamentPlayers = this.afoDatabase.list('tournament-teams/' + tournamentId);
    tournamentPlayers.push(dummy);

    this.snackBar.open('Dummy Team successfully inserted', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  teamRegistrationChange(change: TeamRegistrationChange) {
    const registrationRef = this.afoDatabase.object('tournament-team-registrations/' +
      change.team.tournamentId + '/' + change.team.id);
    registrationRef.update({
      armyListsChecked: change.armyListsChecked,
      paymentChecked:  change.paymentChecked,
      playerMarkedPayment: change.playerMarkedPayment,
      playerUploadedArmyLists: change.playerUploadedArmyLists
    });

    this.snackBar.open('Successfully update Team Registration', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  armyListForTeamRegistration(armyListTeamPush: ArmyListTeamPush) {
    const tournamentArmyListRef = this.afoDatabase.list('tournament-armyLists/' + armyListTeamPush.armyList.tournamentId);
    tournamentArmyListRef.push(armyListTeamPush.armyList);

    const registrationRef = this.afoDatabase.object('tournament-team-registrations/' +
      armyListTeamPush.team.tournamentId + '/' + armyListTeamPush.team.id);
    registrationRef.update({
      playerUploadedArmyLists: true,
      armyListsChecked: false
    });

    this.snackBar.open('ArmyList for Team-Registration saved successfully', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });
  }

  updateTeam(teamUpdate: TeamUpdate) {

    const that = this;

    const teamRef = this.afoDatabase.object('tournament-teams/' + teamUpdate.team.tournamentId + '/' + teamUpdate.team.id);
    teamRef.set(teamUpdate.team);

    this.snackBar.open('Team successfully updated', '', {
      extraClasses: ['snackBar-success'],
      duration: 5000
    });

    _.each(teamUpdate.tournamentPlayers, function (player: TournamentPlayer) {
      const playerRef = that.afoDatabase.object('tournament-players/' + teamUpdate.team.tournamentId + '/' + player.id);
      playerRef.update({
        teamName: teamUpdate.team.teamName
      });
    });
  }
}
