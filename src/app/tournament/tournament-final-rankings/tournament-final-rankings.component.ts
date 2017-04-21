import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TournamentRanking} from "../../../../shared/model/tournament-ranking";
import {ArmyList} from "../../../../shared/model/armyList";
import {AuthenticationStoreState} from "../../store/authentication-state";
import {Tournament} from "../../../../shared/model/tournament";
import {Player} from "../../../../shared/model/player";
import {TournamentManagementConfiguration} from "../../../../shared/dto/tournament-management-configuration";

@Component({
  selector: 'tournament-final-rankings',
  templateUrl: './tournament-final-rankings.component.html',
  styleUrls: ['./tournament-final-rankings.component.css']
})
export class TournamentFinalRankingsComponent implements OnInit {
  @Input() actualTournament: Tournament;

  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() finalRankings$: Observable<TournamentRanking[]>;

  @Output() onUndoTournamentEnd = new EventEmitter<TournamentManagementConfiguration>();

  userPlayerData: Player;
  currentUserId: string;

  constructor() { }

  ngOnInit() {

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;
    });
  }

  uploadTournament() {

  }

  undoTournamentEnd() {

    this.onUndoTournamentEnd.emit({tournamentId: this.actualTournament.id, round: (this.actualTournament.actualRound + 1 )});
  }
}
