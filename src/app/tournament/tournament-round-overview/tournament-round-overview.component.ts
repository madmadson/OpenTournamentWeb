import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';
import {ArmyList} from '../../../../shared/model/armyList';
import {Player} from '../../../../shared/model/player';
import {AuthenticationStoreState} from '../../store/authentication-state';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {Tournament} from '../../../../shared/model/tournament';

import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {TournamentManagementConfiguration} from '../../../../shared/dto/tournament-management-configuration';

import * as _ from 'lodash';
import {GameResult} from '../../../../shared/dto/game-result';
import {PublishRound} from '../../../../shared/dto/publish-round';
import {SwapPlayer} from '../../../../shared/dto/swap-player';

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

  @Output() onPairAgain = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onNewRound = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onKillRound = new EventEmitter<TournamentManagementConfiguration>();
  @Output() onGameResult = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapPlayer>();
  @Output() onPublishRound = new EventEmitter<PublishRound>();
  @Output() onEndTournament = new EventEmitter<TournamentManagementConfiguration>();

  userPlayerData: Player;
  currentUserId: string;

  allGamesFinished: boolean;
  allGamesUntouched: boolean;

  armyLists$: Observable<ArmyList[]>;

  allGames: TournamentGame[];
  allGamesFiltered: TournamentGame[];

  constructor(public dialog: MdDialog) {
  }

  ngOnInit() {

    this.armyLists$ = this.actualTournamentArmyLists$;

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;
    });

    this.gamesForRound$.subscribe((games: TournamentGame[]) => {

      this.allGames = games;
      this.allGamesFiltered = games;

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

  handleSwapPlayer(swapPlayer: SwapPlayer) {

    this.onSwapPlayer.emit(swapPlayer);
  }

  publishRound() {
    this.onPublishRound.emit({tournamentId: this.actualTournament.id, roundToPublish: this.round});
  }

  search(searchString: string) {

    console.log('searchString: ' + searchString);

    if (searchString === '') {
      this.allGamesFiltered = this.allGames;
    }

    this.allGamesFiltered = _.filter(this.allGames, function (game) {
      return game.playerOnePlayerName.toLowerCase().startsWith(searchString.toLowerCase()) ||
        game.playerTwoPlayerName.toLowerCase().startsWith(searchString.toLowerCase());
    });

  }

  openKillRoundDialog() {
    const dialogRef = this.dialog.open(KillRoundDialogComponent, {
      data: {
        round: this.round
      },
    });
    const eventSubscribe = dialogRef.componentInstance.onKillRound
      .subscribe((config: TournamentManagementConfiguration) => {

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
      .subscribe((config: TournamentManagementConfiguration) => {

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
        round: this.round,
        allPlayers$: this.rankingsForRound$
      },
    });
    const eventSubscribe = dialogRef.componentInstance.onNewRound
      .subscribe((config: TournamentManagementConfiguration) => {
        if (config !== undefined) {
          config.tournamentId = this.actualTournament.id;
          this.onNewRound.emit(config);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      eventSubscribe.unsubscribe();
    });
  }

  openFinishTournamentDialog() {
    const dialogRef = this.dialog.open(FinishTournamentDialogComponent, {
      data: {
        round: this.round,
        allPlayers$: this.rankingsForRound$
      }
    });
    const eventSubscribe = dialogRef.componentInstance.onEndTournament
      .subscribe(() => {
        this.onEndTournament.emit({
          tournamentId: this.actualTournament.id,
          round: (this.round + 1),
          teamRestriction: false,
          metaRestriction: false,
          originRestriction: false,
          countryRestriction: false,
        });
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

  @Output() onPairAgain = new EventEmitter<TournamentManagementConfiguration>();

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  constructor(public dialogRef: MdDialogRef<PairAgainDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  pairRoundAgain() {

    this.onPairAgain.emit({
      tournamentId: '',
      round: this.data.round,
      teamRestriction: this.teamRestriction,
      metaRestriction: this.metaRestriction,
      originRestriction: this.originRestriction,
      countryRestriction: this.countryRestriction,
    });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'new-round-dialog',
  templateUrl: './new-round-dialog.html'
})
export class NewRoundDialogComponent {

  suggestedRoundToPlay: number;
  round: number;

  teamRestriction: boolean;
  metaRestriction: boolean;
  originRestriction: boolean;
  countryRestriction: boolean;

  @Output() onNewRound = new EventEmitter<TournamentManagementConfiguration>();

  constructor(public dialogRef: MdDialogRef<NewRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.round = data.round;
    data.allPlayers$.subscribe(allPlayers => {
      this.suggestedRoundToPlay = Math.round(Math.log2(allPlayers.length));
    });
  }

  pairNewRound() {

    this.onNewRound.emit({
      tournamentId: '',
      round: this.round + 1,
      teamRestriction: this.teamRestriction,
      metaRestriction: this.metaRestriction,
      originRestriction: this.originRestriction,
      countryRestriction: this.countryRestriction,
    });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'kill-round-dialog',
  templateUrl: './kill-round-dialog.html'
})
export class KillRoundDialogComponent {

  @Output() onKillRound = new EventEmitter<TournamentManagementConfiguration>();

  enableKill: boolean;

  constructor(public dialogRef: MdDialogRef<KillRoundDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  killIt() {

    this.onKillRound.emit({
      tournamentId: '',
      round: this.data.round,
      teamRestriction: false,
      metaRestriction: false,
      originRestriction: false,
      countryRestriction: false,
    });
    this.dialogRef.close();
  }
}

@Component({
  selector: 'finish-tournament-dialog',
  templateUrl: './finish-tournament-dialog.html'
})
export class FinishTournamentDialogComponent {

  suggestedRoundToPlay: number;
  round: number;

  @Output() onEndTournament = new EventEmitter();

  constructor(public dialogRef: MdDialogRef<FinishTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.round = data.round;
    data.allPlayers$.subscribe(allPlayers => {
      this.suggestedRoundToPlay = Math.round(Math.log2(allPlayers.length));
    });
  }

  endTournament() {

    this.onEndTournament.emit();
    this.dialogRef.close();
  }
}
