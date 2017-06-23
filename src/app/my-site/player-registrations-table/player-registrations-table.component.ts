import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Registration} from '../../../../shared/model/registration';
import {Router} from '@angular/router';
import {WindowRefService} from '../../service/window-ref-service';

@Component({
  selector: 'player-registrations-table',
  templateUrl: './player-registrations-table.component.html',
  styleUrls: ['./player-registrations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerRegistrationsTableComponent {


  @Input() myRegistrations: Registration[];

  smallScreen: boolean;
  truncateMax: number;

  page = 1;

  constructor(private router: Router,
              private winRef: WindowRefService) {

    if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 30;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  onSelect(reg: Registration) {
    this.router.navigate(['/tournament/' + reg.tournamentId]);
  }
}
