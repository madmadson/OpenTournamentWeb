import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Router} from '@angular/router';
import {Tournament} from '../../../../shared/model/tournament';
import {WindowRefService} from '../../service/window-ref-service';
import {TournamentInfoDialogComponent} from '../../dialogs/tournament-overview/tournament-info-dialog';
import {MdDialog} from '@angular/material';

@Component({
  selector: 'tournament-list',
  templateUrl: 'tournament-list.component.html',
  styleUrls: ['tournament-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentListComponent {

  @Input() tournaments: Tournament[];

  verySmallDevice: boolean;
  truncateMax: number;

  constructor(public dialog: MdDialog,
              private router: Router,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.verySmallDevice = true;
      this.truncateMax = 30;
    } else {
      this.verySmallDevice = false;
      this.truncateMax = 40;
    }

  }

  onSelect(tournament: Tournament) {

    if (tournament.finished) {
      this.router.navigate(['/tournament', tournament.id, 'finalRankings']);
    } else if (tournament.actualRound > 0) {
      this.router.navigate(['/tournament', tournament.id, 'round', tournament.actualRound]);
    } else {
      this.router.navigate(['/tournament', tournament.id, 'registrations']);
    }
  }

  openInfoDialog(event: any, tournament: Tournament) {

    event.stopPropagation();

    this.dialog.open(TournamentInfoDialogComponent, {
      data: {
        tournament: tournament
      },
      width: '800px'
    });
  }
}
