import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../shared/model/armyList';
import {Player} from '../../../../shared/model/player';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Tournament} from '../../../../shared/model/tournament';

import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {PairingConfiguration} from '../../../../shared/model/pairing-configuration';

import * as _ from 'lodash';
import {GameResult} from '../../../../shared/model/game-result';
import {PublishRound} from '../../../../shared/model/publish-round';

@Component({
  selector: 'tournament-round-overview',
  templateUrl: './tournament-round-overview.component.html',
  styleUrls: ['./tournament-round-overview.component.css']
})
export class TournamentRoundOverviewComponent implements OnInit {

  @Input() round: number;
  @Input() actualTournament: Tournament;

  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyLists$: Observable<ArmyList[]>;
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() gamesForRound$: Observable<TournamentGame[]>;

  @Output() onPairAgain = new EventEmitter<PairingConfiguration>();
  @Output() onNewRound = new EventEmitter<PairingConfiguration>();
  @Output() onKillRound = new EventEmitter<PairingConfiguration>();
  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onPublishRound = new EventEmitter<PublishRound>();

  userPlayerData: Player;
  currentUserId: string;

  allGamesFinished: boolean;
  allGamesUntouched: boolean;

  constructor(public dialog: MdDialog) { }

  ngOnInit() {


    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;
    });

    this.gamesForRound$.subscribe((games: TournamentGame[]) => {
      const unfinishedGames = _.find(games, function (game: TournamentGame) {
        return !game.finished;
      });
      this.allGamesFinished = !unfinishedGames;

      const startedGames = _.find(games, function (game: TournamentGame) {
        return game.finished;
      });
      this.allGamesUntouched = !startedGames;
    });

  }

  handleGameResult(gameResult: GameResult) {

    this.onGameResult.emit(gameResult);
  }
  publishRound() {
    this.onPublishRound.emit({tournamentId: this.actualTournament.id, roundToPublish: this.round});
  }

  openKillRoundDialog() {
    const dialogRef = this.dialog.open(KillRoundDialogComponent, {
      data: {
        round: this.round
      },
    });
    const eventSubscribe = dialogRef.componentInstance.onKillRound
      .subscribe((config: PairingConfiguration) => {

        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          config.round = this.round;
          this.onKillRound.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openPairAgainDialog() {
    const dialogRef = this.dialog.open(PairAgainDialogComponent, {
      data: {
        round: this.round
      },
    });
    const eventSubscribe = dialogRef.componentInstance.onPairAgain
      .subscribe((config: PairingConfiguration) => {

      if (config !== undefined) {
        config.tournamentId = this.actualTournament.id;
        config.round = this.round;
        this.onPairAgain.emit(config);
      }
    });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openNewRoundDialog() {
    const dialogRef = this.dialog.open(NewRoundDialogComponent, {
      data: {
        round: this.round
      },
    });
    const eventSubscribe = dialogRef.componentInstance.onNewRound
      .subscribe((config: PairingConfiguration) => {

        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          config.round = this.round + 1;
          this.onNewRound.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }
}

@Component({
  selector: 'pair-again-dialog',
  templateUrl: './pair-again-dialog.html'
})
export class PairAgainDialogComponent {

  @Output() onPairAgain = new EventEmitter<PairingConfiguration>();

  constructor(public dialogRef: MdDialogRef<PairAgainDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  pairRoundAgain() {

    this.onPairAgain.emit({tournamentId: '', round: 1});
    this.dialogRef.close();
  }
}

@Component({
  selector: 'new-round-dialog',
  templateUrl: './new-round-dialog.html'
})
export class NewRoundDialogComponent {

  @Output() onNewRound = new EventEmitter<PairingConfiguration>();

  killButtonDisabled: boolean;

  constructor(public dialogRef: MdDialogRef<NewRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.killButtonDisabled = true;
  }

  enableKillButton() {
    this.killButtonDisabled = false;
  }

  pairRoundAgain() {

    this.onNewRound.emit({tournamentId: '', round: 1});
    this.dialogRef.close();
  }
}

@Component({
  selector: 'kill-round-dialog',
  templateUrl: './kill-round-dialog.html'
})
export class KillRoundDialogComponent {

  @Output() onKillRound = new EventEmitter<PairingConfiguration>();

  constructor(public dialogRef: MdDialogRef<KillRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  pairRoundAgain() {

    this.onKillRound.emit({tournamentId: '', round: 1});
    this.dialogRef.close();
  }
}
