import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tournament} from '../../../../shared/model/tournament';
import {Observable} from 'rxjs/Observable';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {Player} from '../../../../shared/model/player';

@Component({
  selector: 'tournament-team-final-rankings',
  templateUrl: './tournament-team-final-rankings.component.html',
  styleUrls: ['./tournament-team-final-rankings.component.scss']
})
export class TournamentTeamFinalRankingsComponent implements OnInit {

  @Input() actualTournament: Tournament;

  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() finalPlayerRankings$: Observable<TournamentRanking[]>;
  @Input() finalTeamRankings$: Observable<TournamentRanking[]>;

  @Output() onUndoTeamTournamentEnd = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onUploadTeamTournament = new EventEmitter();

  userPlayerData: Player;
  currentUserId: string;

  armyLists$: Observable<ArmyList[]>;

  constructor() { }

  ngOnInit() {

    this.armyLists$ = this.actualTournamentArmyList$;

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;
    });
  }

  publishTeamTournament() {
    this.onUploadTeamTournament.emit();
  }

  undoTeamTournamentEnd() {
    this.onUndoTeamTournamentEnd.emit({
      tournamentId: this.actualTournament.id,
      round: (this.actualTournament.actualRound + 1 ),
      teamRestriction: false,
      metaRestriction: false,
      originRestriction: false,
      countryRestriction: false,
    });
  }

}
