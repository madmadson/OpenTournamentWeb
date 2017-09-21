import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';


import * as _ from 'lodash';
import {Tournament} from '../../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../../shared/model/tournament-ranking';
import {TournamentGame} from '../../../../../shared/model/tournament-game';
import {GameResult} from '../../../../../shared/dto/game-result';
import {MdDialog, MdPaginator, MdSnackBar, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';
import {ArmyList} from '../../../../../shared/model/armyList';
import {Player} from '../../../../../shared/model/player';
import {GamesDatabase, GamesDataSource} from '../../../../../shared/table-model/game';
import {GameResultDialogComponent} from '../../../dialogs/game-result-dialog';
import {SwappingService} from '../../swapping.service';


@Component({
  selector: 'tournament-games',
  templateUrl: './tournament-games.component.html',
  styleUrls: ['./tournament-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentGamesComponent implements OnInit, OnChanges {


  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;

  @Input() round: number;
  @Input() isTeamMatch: boolean;

  @Input() userPlayerData: Player;
  @Input() actualTournament: Tournament;

  @Input() armyLists: ArmyList[];
  @Input() gamesForRound: TournamentGame[];
  @Input() rankingsForRound: TournamentRanking[];

  @Output() onGameResultEntered = new EventEmitter<GameResult>();
  @Output() onClearPlayerGameResult = new EventEmitter<TournamentGame>();

  requestClearGame: string;

  draggedTournamentPlayerCurrentOpponentId: string;
  draggedGame: TournamentGame;
  draggedTournamentPlayerId = '';
  draggedTournamentTeamName = '';
  draggedTournamentPlayerOpponentIds: string[] = [];

  displayedColumns = ['playingField', 'playerOnePlayerName', 'swapPlayerOne', 'vs',
    'swapPlayerTwo', 'playerTwoPlayerName', 'actions'];

  gamesDb: GamesDatabase;
  dataSource: GamesDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;


  smallScreen: boolean;
  truncateMax: number;

  nextUnfinishedGame: TournamentGame;

  constructor(private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private winRef: WindowRefService,
              private swappingService: SwappingService) {

    if (this.winRef.nativeWindow.screen.width < 500) {
      this.smallScreen = true;
      this.truncateMax = 10;
    } else if (this.winRef.nativeWindow.screen.width < 800) {
      this.smallScreen = true;
      this.truncateMax = 20;
    } else {
      this.smallScreen = false;
      this.truncateMax = 40;
    }
  }

  ngOnInit() {

    this.gamesDb = new GamesDatabase(this.gamesForRound);

    this.dataSource = new GamesDataSource(this.gamesDb, this.sort, this.paginator);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.gamesDb && propName === 'gamesForRound') {
          this.gamesDb.resetDatabase(change.currentValue);

          if (this.nextUnfinishedGame) {
            console.log('open ' + JSON.stringify(this.nextUnfinishedGame));
            this.openGameResultDialog(this.nextUnfinishedGame);
          }
        }
      }
    }
  }


  playerOneWon(game: TournamentGame): boolean {
    return game.playerOneScore > game.playerTwoScore;

  }

  playerTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;

  }

  isItMyGame(game: TournamentGame) {
    if (this.userPlayerData) {
      return (game.playerOnePlayerId === this.userPlayerData.id) ||
        (game.playerTwoPlayerId === this.userPlayerData.id);
    }
  }


  requestClearGameResult(event: any, game: TournamentGame) {
    event.stopPropagation();

    this.requestClearGame = game.id;
  }

  clearGameResultConfirm(event: any, game: TournamentGame) {

    event.stopPropagation();

    this.requestClearGame = '';
    this.onClearPlayerGameResult.emit(game);
  }

  clearGameResultDecline(event: any) {
    event.stopPropagation();
    this.requestClearGame = '';
  }

  openGameResultDialog(selectedGame: TournamentGame) {

    if (!this.draggedTournamentPlayerId && ((this.isItMyGame(selectedGame) && !selectedGame.finished)
        || this.isAdmin || this.isCoOrganizer) && !this.actualTournament.finished) {

      this.nextUnfinishedGame = undefined;

      const nextUnfinishedGame: TournamentGame = _.find(this.gamesForRound, function (game: TournamentGame) {
        return !game.finished && game.id !== selectedGame.id;
      });

      const dialogRef = this.dialog.open(GameResultDialogComponent, {
        data: {
          selectedGame: selectedGame,
          armyLists: this.armyLists,
          isAdmin: this.isAdmin,
          isCoOrganizer: this.isCoOrganizer,
          isTeamMatch: this.isTeamMatch,
          nextUnfinishedGame: nextUnfinishedGame
        }
      });
      const onGameResult = dialogRef.componentInstance.onGameResult
        .subscribe((gameResult: GameResult) => {

          if (gameResult !== undefined) {

            this.onGameResultEntered.emit(gameResult);
            dialogRef.close();
          }
        });

      const onGameResultAndNext = dialogRef.componentInstance.onGameResultAndNext
        .subscribe((gameResult: GameResult) => {

          if (gameResult !== undefined) {

            this.onGameResultEntered.emit(gameResult);
            dialogRef.close();
            this.nextUnfinishedGame = nextUnfinishedGame;
          }
        });
      dialogRef.afterClosed().subscribe(() => {

        onGameResult.unsubscribe();
        onGameResultAndNext.unsubscribe();
      });

    }
  }

  swapPlayerOne(event: any, game: TournamentGame) {

    const that = this;

    event.stopPropagation();

    this.draggedTournamentPlayerId = game.playerOneTournamentPlayerId;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerTwoTournamentPlayerId;
    this.draggedGame = game;
    this.draggedTournamentTeamName = game.playerOneTeamName;


    _.forEach(this.rankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.opponentTournamentPlayerIds && ranking.tournamentPlayerId === game.playerOneTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });

    this.snackBar.open('Player swap started. Click other player to swap', '', {
      extraClasses: ['snackBar-info'],
      duration: 5000
    });
  }

  swapPlayerTwo(event: any, game: TournamentGame) {

    const that = this;

    event.stopPropagation();

    this.draggedTournamentPlayerId = game.playerTwoTournamentPlayerId;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerOneTournamentPlayerId;
    this.draggedGame = game;
    this.draggedTournamentTeamName = game.playerTwoTeamName;

    _.forEach(this.rankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.opponentTournamentPlayerIds && ranking.tournamentPlayerId === game.playerTwoTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });
  }

  endSwapPlayer(event: any) {
    event.stopPropagation();

    this.draggedTournamentPlayerId = '';
    this.draggedTournamentPlayerCurrentOpponentId = '';
    this.draggedGame = undefined;

  }

  dropPossible(game: TournamentGame, playerId: string, playerTeam: string): boolean {

    if (this.isTeamMatch) {
      return !game.finished && this.draggedTournamentPlayerId !== playerId &&
        this.draggedTournamentTeamName === playerTeam;
    } else {
      return !game.finished && !this.draggedTournamentPlayerOpponentIds[playerId] &&
        this.draggedTournamentPlayerCurrentOpponentId !== playerId &&
        this.draggedTournamentPlayerId !== playerId;
    }
  }

  confirmDropPlayer(event: any,
                    droppedGame: TournamentGame,
                    droppedPlayerId: string,
                    droppedPlayerTeam: string) {

    if (this.draggedTournamentPlayerId && this.dropPossible(droppedGame, droppedPlayerId, droppedPlayerTeam)) {
      event.stopPropagation();

      console.log('confirmDropPlayerOne');

      this.swappingService.swapPlayer(this.rankingsForRound, this.draggedGame, this.draggedTournamentPlayerId, droppedGame, droppedPlayerId);

      this.snackBar.open('Players successfully swapped ', '', {
        extraClasses: ['snackBar-success'],
        duration: 5000
      });

      this.draggedTournamentPlayerId = '';
      this.draggedTournamentPlayerCurrentOpponentId = '';
      this.draggedGame = undefined;
    }
  }


}
