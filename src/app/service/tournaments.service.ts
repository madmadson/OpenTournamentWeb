import {Inject, Injectable, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../store/application-state';
import {AngularFire, FirebaseRef} from 'angularfire2';
import {
  TournamentAddedAction,
  TournamentChangedAction,
  TournamentDeletedAction,
  TournamentsClearAction
} from '../store/actions/tournaments-actions';
import {Tournament} from '../../../shared/model/tournament';
import {TournamentVM} from '../tournament/tournament.vm';

@Injectable()
export class TournamentsService implements OnDestroy {

  private query: firebase.database.Reference;

  constructor(protected afService: AngularFire,
              protected store: Store<ApplicationState>,
              @Inject(FirebaseRef) private fb) {

  }

  ngOnDestroy(): void {
    this.query.off();
  }


  subscribeOnTournaments() {

    if (!this.query) {
      console.log('subscribe on tournaments');
      this.store.dispatch(new TournamentsClearAction());

      const that = this;

      this.query = this.fb.database().ref('tournaments').orderByChild('beginDate');

      this.query.on('child_added', function(snapshot) {

        const tournament: Tournament = Tournament.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch(new TournamentAddedAction(tournament));

      });

      this.query.on('child_changed', function(snapshot) {

        const tournament: Tournament = Tournament.fromJson(snapshot.val());
        tournament.id = snapshot.key;

        that.store.dispatch(new TournamentChangedAction(tournament));
        });

      this.query.on('child_removed', function(snapshot) {

        that.store.dispatch(new TournamentDeletedAction(snapshot.key));
      });
    }

  }

  unsubscribeOnTournaments() {

    this.query.off();
  }

  pushTournament(tournament: Tournament) {
    const tournaments = this.afService.database.list('tournaments');

    tournaments.push(tournament);
  }


  pushTournaments(payload: TournamentVM) {

    const newTournament = Tournament.fromTournamentVM(payload);

    const tournaments = this.afService.database.list('tournaments');
    tournaments.push(newTournament);
  }
}

// this.pushTournament({
//   playerName: 'Tournament1',
//   location: 'Karlsruhe',
//   beginDate: moment('2017-03-12').format(),
//   endDate: moment('2017-03-12').format(),
//   actualRound: 0,
//   maxParticipants: 16,
//   teamSize: 1
// });
// this.pushTournament({
//   playerName: 'Tournament2',
//   location: 'Oberhausen',
//   beginDate: moment('2017-03-17').format(),
//   endDate: moment('2017-03-18').format(),
//   actualRound: 1,
//   maxParticipants: 64,
//   teamSize: 3
// });
// this.pushTournament({
//   playerName: 'Tournament3',
//   location: 'Erfurt',
//   beginDate: moment('2017-04-01').format(),
//   endDate: moment('2017-04-01').format(),
//   actualRound: 0,
//   maxParticipants: 32,
//   teamSize: 1
// });
