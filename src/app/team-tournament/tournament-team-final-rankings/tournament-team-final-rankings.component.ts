import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tournament} from '../../../../shared/model/tournament';
import {Observable} from 'rxjs/Observable';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';
import {Player} from '../../../../shared/model/player';
import {PrintRankingsDialogComponent} from '../../dialogs/print-rankings-dialog';
import {MdDialog} from '@angular/material';
import {ShowSoloRankingsComponent} from '../../dialogs/mini-dialog/show-solo-rankings-dialog';
import {GlobalEventService} from '../../service/global-event-service';

@Component({
  selector: 'tournament-team-final-rankings',
  templateUrl: './tournament-team-final-rankings.component.html',
  styleUrls: ['./tournament-team-final-rankings.component.scss']
})
export class TournamentTeamFinalRankingsComponent implements OnInit {

  @Input() actualTournament: Tournament;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;

  @Input() userPlayerData: Player;
  @Input() actualTournamentArmyList$: Observable<ArmyList[]>;
  @Input() finalPlayerRankings$: Observable<TournamentRanking[]>;
  @Input() finalTeamRankings$: Observable<TournamentRanking[]>;

  @Output() onUndoTeamTournamentEnd = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onUploadTeamTournament = new EventEmitter();

  rankingsFullscreenMode: boolean;

  armyLists$: Observable<ArmyList[]>;

  constructor(public dialog: MdDialog,
              private messageService: GlobalEventService){

  }

  ngOnInit() {

    this.armyLists$ = this.actualTournamentArmyList$;
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

  printRankings() {
    this.dialog.open(PrintRankingsDialogComponent, {
      data: {
        tournament: this.actualTournament,
        rankings$: this.finalTeamRankings$,
        round: this.actualTournament.actualRound,
        teamMatch: true
      }
    });
  }
  openRankingsFullScreenMode(mode: boolean) {
    this.rankingsFullscreenMode = mode;

    this.messageService.broadcast('fullScreenMode', mode);
  }

  openSoloRankingForTeamTournament() {
    this.dialog.open(ShowSoloRankingsComponent, {
      data: {
        isAdmin: this.isAdmin,
        actualTournament: this.actualTournament,
        userPlayerData: this.userPlayerData,
        rankingsForRound$: this.finalPlayerRankings$,
        actualTournamentArmyList$: this.actualTournamentArmyList$
      },
      width: '800px',
    });
  }
}
