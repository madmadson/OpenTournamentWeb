import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';

import {
  AddArmyListAction, ArmyListDeletedAction,
  ClearArmyListsAction,
  ClearRegistrationAction, ClearTournamentPlayerAction,
  SetActualTournamentAction, TournamentPlayerAdded, TournamentPlayerChanged, TournamentPlayerDeleted,
  TournamentRegistrationAdded,
  TournamentRegistrationChanged,
  TournamentRegistrationDeleted
} from '../store/actions/tournament-actions';
import {Registration} from '../../../shared/model/registration';
import {MdSnackBar} from '@angular/material';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {ArmyList} from '../../../shared/model/armyList';


@Injectable()
export class TournamentService implements OnDestroy {

  private tournamentRegistrationsRef: firebase.database.Reference;
  private tournamentPlayerRef: firebase.database.Reference;
  private armyListsRef: firebase.database.Reference;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb,
              private snackBar: MdSnackBar) {

  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy  TournamentService');
    this.tournamentRegistrationsRef.off();
    this.store.dispatch(new ClearRegistrationAction());
  }


  subscribeOnTournament(tournamentId: string) {
    this.afService.database.object('tournaments/' + tournamentId).subscribe(
      tournament => {
        tournament.id = tournamentId;
        this.store.dispatch(new SetActualTournamentAction(tournament));

      }
    );

    this.subscribeOnRegistrations(tournamentId);
    this.subscribeOnTournamentPlayers(tournamentId);
    this.subscribeOnArmyLists(tournamentId);
  }

  private subscribeOnRegistrations(tournamentId: string) {

    const that = this;

    this.tournamentRegistrationsRef = this.fb.database().ref('tournament-registration/' + tournamentId);

    this.tournamentRegistrationsRef.on('child_added', function (snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new TournamentRegistrationAdded(registration));

    });

    this.tournamentRegistrationsRef.on('child_changed', function (snapshot) {

      const registration: Registration = Registration.fromJson(snapshot.val());
      registration.id = snapshot.key;

      that.store.dispatch(new TournamentRegistrationChanged(registration));

    });

    this.tournamentRegistrationsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new TournamentRegistrationDeleted(snapshot.key));

    });
  }

  private subscribeOnTournamentPlayers(tournamentId: string) {
    const that = this;

    this.tournamentPlayerRef = this.fb.database().ref('tournament-player/' + tournamentId);

    this.tournamentPlayerRef.on('child_added', function (snapshot) {

      const tournamentPlayer: TournamentPlayer = TournamentPlayer.fromJson(snapshot.val());
      tournamentPlayer.id = snapshot.key;

      that.store.dispatch(new TournamentPlayerAdded(tournamentPlayer));

    });

    this.tournamentPlayerRef.on('child_changed', function (snapshot) {

      const tournamentPlayer: TournamentPlayer = TournamentPlayer.fromJson(snapshot.val());
      tournamentPlayer.id = snapshot.key;

      that.store.dispatch(new TournamentPlayerChanged(tournamentPlayer));

    });

    this.tournamentPlayerRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new TournamentPlayerDeleted(snapshot.key));

    });
  }

  private subscribeOnArmyLists(tournamentId: string) {
    const that = this;

    this.armyListsRef = this.fb.database().ref('tournament-armyLists/' + tournamentId);

    this.armyListsRef.on('child_added', function (snapshot) {

      const armyList: ArmyList = ArmyList.fromJson(snapshot.val());
      armyList.id = snapshot.key;

      that.store.dispatch(new AddArmyListAction(armyList));

    });

    this.armyListsRef.on('child_removed', function (snapshot) {

      that.store.dispatch(new ArmyListDeletedAction(snapshot.key));

    });
  }

  pushRegistration(newRegistration: Registration) {

    const registrations = this.afService.database.list('tournament-registration/' + newRegistration.tournamentId );
    registrations.push(newRegistration);

    this.snackBar.open('Registration saved successfully', '', {
      duration: 5000
    });
  }

  pushTournamentPlayer(payload: Registration) {

    TournamentPlayer.fromRegistration(payload);

    const tournamentPlayers = this.afService.database.list('tournament-player/' + payload.tournamentId );
    tournamentPlayers.push(payload);

    this.snackBar.open('Tournament Player saved successfully', '', {
      duration: 5000
    });
  }

  eraseRegistration(reg: Registration) {

    const regRef = this.afService.database.list('tournament-registration/' + reg.tournamentId + '/' + reg.id);
    regRef.remove();

    this.snackBar.open('Registration deleted successfully', '', {
      duration: 5000
    });
  }

  eraseTournamentPlayer(player: TournamentPlayer) {
    const playerRef = this.afService.database.list('tournament-player/' + player.tournamentId + '/' + player.id);
    playerRef.remove();

    this.snackBar.open('Tournament Player deleted successfully', '', {
      duration: 5000
    });
  }

  pushArmyList(armyList: ArmyList) {

    const tournamentPlayers = this.afService.database.list('tournament-armyLists/' + armyList.tournamentId );
    tournamentPlayers.push(armyList);

    this.snackBar.open('Army List saved successfully', '', {
      duration: 5000
    });
  }

  eraseArmyList(armyList: ArmyList) {
    const armyListRef = this.afService.database
      .list('tournament-armyLists/' + armyList.tournamentId + '/' + armyList.playerId);
    armyListRef.remove();

    this.snackBar.open('ArmyList deleted successfully', '', {
      duration: 5000
    });
  }

  unsubscribeOnTournament() {
    this.tournamentRegistrationsRef.off();
    this.store.dispatch(new ClearRegistrationAction());
    this.store.dispatch(new ClearTournamentPlayerAction());
    this.store.dispatch(new ClearArmyListsAction());
  }



}
