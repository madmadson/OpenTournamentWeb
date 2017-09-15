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
import {ScenarioSelectedModel} from '../../../../../shared/dto/scenario-selected-model';
import {SwapGames} from '../../../../../shared/dto/swap-player';
import {GameResult} from '../../../../../shared/dto/game-result';
import {MdDialog, MdPaginator, MdSnackBar, MdSort} from '@angular/material';
import {WindowRefService} from '../../../service/window-ref-service';
import {ArmyList} from '../../../../../shared/model/armyList';
import {Player} from '../../../../../shared/model/player';
import {GamesDatabase, GamesDataSource} from '../../../../../shared/table-model/game';
import {GameResultDialogComponent} from '../../../dialogs/game-result-dialog';
import {SwappingService} from '../../swapping.service';
import {TeamMatchClearModel} from '../../../../../shared/dto/team-match-clear';
import {TournamentTeam} from '../../../../../shared/model/tournament-team';


@Component({
  selector: 'tournament-team-games',
  templateUrl: './tournament-team-games.component.html',
  styleUrls: ['./tournament-team-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TournamentTeamGamesComponent implements OnInit, OnChanges {


  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;

  @Input() round: number;
  @Input() teamMatch: boolean;

  @Input() myTeam: string;

  @Input() userPlayerData: Player;
  @Input() actualTournament: Tournament;

  @Input() armyLists: ArmyList[];
  @Input() teamGamesForRound: TournamentGame[];
  @Input() playerGamesForRound: TournamentGame[];
  @Input() rankingsForRound: TournamentRanking[];

  @Output() onGameResultEntered = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onScenarioSelected = new EventEmitter<ScenarioSelectedModel>();

  @Output() onClearTeamGameResult = new EventEmitter<TeamMatchClearModel>();

  draggedTournamentPlayerCurrentOpponentId: string;

  draggedGame: TournamentGame;

  swapPlayerMode: boolean;
  selectedScenario: string;

  requestClearGame: string;

  draggedTournamentPlayerId = '';
  draggedTournamentPlayerOpponentIds: string[] = [];

  displayedColumns = ['playingField', 'teamOneTeamName', 'swapPlayerOne', 'result-team-one',
                       'vs', 'result-team-two', 'swapPlayerTwo', 'teamTwoTeamName', 'actions'];

  gamesDb: GamesDatabase;
  dataSource: GamesDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;


  smallScreen: boolean;
  truncateMax: number;


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

    this.gamesDb = new GamesDatabase(this.teamGamesForRound);

    this.dataSource = new GamesDataSource(this.gamesDb, this.sort, this.paginator);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const change = changes[propName];
        if (this.gamesDb && propName === 'teamGamesForRound') {
          this.gamesDb.resetDatabase(change.currentValue);
        }
      }
    }
  }


  teamOneWon(game: TournamentGame): boolean {
    return game.playerOneIntermediateResult > game.playerTwoIntermediateResult;
  }

  teamTie(game: TournamentGame): boolean {
    return game.playerOneIntermediateResult === game.playerTwoIntermediateResult;

  }

  teamTwoWon(game: TournamentGame): boolean {
    return game.playerOneIntermediateResult < game.playerTwoIntermediateResult;

  }

  isItMyTeam(game: TournamentGame) {

    return game.playerOneTeamName === this.myTeam ||
      game.playerTwoTeamName === this.myTeam;
  }


  requestClearGameResult(event: any, game: TournamentGame) {
    event.stopPropagation();

    this.requestClearGame = game.id;
  }

  clearGameResultConfirm(event: any, teamMatch: TournamentGame) {

    event.stopPropagation();

    this.requestClearGame = '';

    this.onClearTeamGameResult.emit({
      teamMatch: teamMatch,
      playerMatchesForTeamOne: this.getPlayerMatchesForTeamOne(teamMatch)
    });
  }

  clearGameResultDecline(event: any) {
    event.stopPropagation();
    this.requestClearGame = '';
  }

  openGameResultDialog(selectedGame: TournamentGame) {

    if (!this.draggedTournamentPlayerId && (this.isItMyTeam(selectedGame) || this.isAdmin || this.isCoOrganizer) && !this.actualTournament.finished) {

      const dialogRef = this.dialog.open(GameResultDialogComponent, {
        data: {
          selectedGame: selectedGame,
          armyLists: this.armyLists,
          isAdmin: this.isAdmin,
          isCoOrganizer: this.isCoOrganizer
        },
        width: '800px'
      });
      const eventSubscribe = dialogRef.componentInstance.onGameResult
        .subscribe((gameResult: GameResult) => {

          if (gameResult !== undefined) {

            if (this.selectedScenario) {
              gameResult.gameAfter.scenario = this.selectedScenario;
            }

            this.onGameResultEntered.emit(gameResult);
            if (!this.teamMatch) {
              this.dialog.closeAll();
            } else {
              dialogRef.close();
            }
          }
        });
      dialogRef.afterClosed().subscribe(() => {

        eventSubscribe.unsubscribe();
        if (!this.teamMatch) {
          this.dialog.closeAll();
        }
      });

    }
  }

  swapPlayerOne(event: any, game: TournamentGame) {

    const that = this;

    event.stopPropagation();

    this.draggedTournamentPlayerId = game.playerOneTournamentPlayerId;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerTwoTournamentPlayerId;
    this.draggedGame = game;

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

  dropPossible(game: TournamentGame, playerId: string): boolean {

    return !game.finished && !this.draggedTournamentPlayerOpponentIds[playerId] &&
      this.draggedTournamentPlayerCurrentOpponentId !== playerId &&
      this.draggedTournamentPlayerId !== playerId;
  }

  confirmDropPlayer(event: any, droppedGame: TournamentGame, droppedPlayerId: string) {

    if (this.draggedTournamentPlayerId && this.dropPossible(droppedGame, droppedPlayerId)) {
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

  getPlayerMatchesForTeamOne(teamMatch: TournamentGame): TournamentGame[] {

    return _.filter(this.playerGamesForRound, function (playerMatch: TournamentGame) {

      return teamMatch.playerOnePlayerName === playerMatch.playerOneTeamName;
    });
  }
}
