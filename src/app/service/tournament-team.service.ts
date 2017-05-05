import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';

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


@Injectable()
export class TournamentTeamService implements OnDestroy {

  tournamentTeamsRef: firebase.database.Reference;
  tournamentTeamsRegistrationRef: firebase.database.Reference;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb,
              private snackBar: MdSnackBar) {
  }

  ngOnDestroy(): void {

    if (this.tournamentTeamsRef) {
      this.tournamentTeamsRef.off();
    }
    if (this.tournamentTeamsRegistrationRef) {
      this.tournamentTeamsRegistrationRef.off();
    }
  }

  public subscribeOnTournamentTeams(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearTournamentTeamsAction());
    if (this.tournamentTeamsRef) {
      this.tournamentTeamsRef.off();
    }

    console.log('subscribeOnTournamentGames');

    this.tournamentTeamsRef = this.fb.database().ref('tournament-teams/' + tournamentId);

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

  public subscribeOnTournamentTeamRegistrations(tournamentId: string) {

    const that = this;

    this.store.dispatch(new ClearTournamentTeamRegistrationsAction());
    if (this.tournamentTeamsRegistrationRef) {
      this.tournamentTeamsRegistrationRef.off();
    }

    console.log('subscribeOnTournamentTeamRegistrations');

    this.tournamentTeamsRegistrationRef = this.fb.database().ref('tournament-team-registrations/' + tournamentId);

    this.tournamentTeamsRegistrationRef.on('child_added', function (snapshot) {

      const tournamentTeam: TournamentTeam = TournamentTeam.fromJson(snapshot.val());
      tournamentTeam.id = snapshot.key;

      that.store.dispatch(new AddTournamentTeamRegistrationAction(tournamentTeam));

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
    const tournamentTeamsRef = this.afService.database.list('tournament-team-registrations/' + team.tournamentId);
    tournamentTeamsRef.push(team);

    this.snackBar.open('Team registered successfully', '', {
      duration: 5000
    });
  }

  acceptTournamentTeamRegistration(teamRegistrationPush: TeamRegistrationPush) {

    const that = this;

    const tournamentTeamsRegRef = this.afService.database.
        object('tournament-teams/' + teamRegistrationPush.tournament.id + '/' + teamRegistrationPush.team.id);
    tournamentTeamsRegRef.set(teamRegistrationPush.team);

    const teamRegistrationRef = that.afService.database.
        object('tournament-team-registrations/' + teamRegistrationPush.tournament.id + '/' + teamRegistrationPush.team.id);
    teamRegistrationRef.update({isAcceptedTournamentTeam: true});

    _.each(teamRegistrationPush.registrations, function (registration: Registration) {
      const tournamentPlayer = TournamentPlayer.fromRegistration(registration);

      const tournamentPlayers = that.afService.database.list('tournament-players/' + registration.tournamentId);
      tournamentPlayers.push(tournamentPlayer);

      const registrationRef = that.afService.database.
        object('tournament-registrations/' + registration.tournamentId + '/' + registration.id);
      registrationRef.update({isTournamentPlayer: true});
    });

    this.snackBar.open('Team Registration accepted successfully', '', {
      duration: 5000
    });
  }

  pushTournamentTeam(team: TournamentTeam) {
    const tournamentTeamsRef = this.afService.database.list('tournament-teams/' + team.tournamentId);
    tournamentTeamsRef.push(team);

    this.snackBar.open('Team saved successfully', '', {
      duration: 5000
    });
  }

  eraseTournamentTeam(tournamentTeamErase: TournamentTeamEraseModel) {

    const that = this;

    const tournamentTeamsRef = this.afService.database.
        object('tournament-teams/' + tournamentTeamErase.tournament.id + '/' + tournamentTeamErase.team.id);
    tournamentTeamsRef.remove();

    if (tournamentTeamErase.team.isRegisteredTeam) {
      const tournamentTeamsRegRef = that.afService.database.
        object('tournament-team-registrations/' + tournamentTeamErase.tournament.id + '/' + tournamentTeamErase.team.id);
      tournamentTeamsRegRef.update({isAcceptedTournamentTeam: false});
    }

    _.each(tournamentTeamErase.players, function (player: TournamentPlayer) {
        const playerRef = that.afService.database.list('tournament-players/' + player.tournamentId + '/' + player.id);
        playerRef.remove();
    });

    this.snackBar.open('Tournament Team deleted successfully', '', {
      duration: 5000
    });
  }
}
