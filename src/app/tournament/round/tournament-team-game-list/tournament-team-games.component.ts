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

import {SwappingService} from '../../swapping.service';
import {TournamentTeam} from '../../../../../shared/model/tournament-team';
import {TeamMatchDialogComponent} from '../../../dialogs/team-game-result-dialog';
import {Observable} from 'rxjs/Observable';
import {TeamMatchClearModel} from '../../../../../shared/dto/player-match-team-clear-model';
import {TournamentPlayer} from '../../../../../shared/model/tournament-player';


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
  @Input() playerGamesForRound$: Observable<TournamentGame[]>;
  @Input() playerRankingsForRound: TournamentRanking[];
  @Input() allPlayerRankings: TournamentRanking[];
  @Input() teamRankingsForRound: TournamentRanking[];
  @Input() allTeamRankings: TournamentRanking[];
  @Input() actualTournamentTeams: TournamentTeam[];
  @Input() actualTournamentPlayers: TournamentPlayer[];

  @Output() onTeamMatchGameResult = new EventEmitter<GameResult>();
  @Output() onClearTeamGameResult = new EventEmitter<TeamMatchClearModel>();
  @Output() onClearTeamPlayerGameResult = new EventEmitter<TournamentGame>();

  requestClearTeamGame: string;

  draggedTournamentPlayerCurrentOpponentId: string;
  draggedGame: TournamentGame;
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
    return game.playerOneScore > game.playerTwoScore;
  }

  teamOneLead(game: TournamentGame): boolean {
    return game.playerOneIntermediateResult > game.playerTwoIntermediateResult && !game.finished;
  }

  teamTie(game: TournamentGame): boolean {
    return game.playerOneIntermediateResult === game.playerTwoIntermediateResult &&
      (game.playerOneIntermediateResult + game.playerTwoIntermediateResult !== 0);
  }

  teamTwoLead(game: TournamentGame): boolean {
    return game.playerOneIntermediateResult < game.playerTwoIntermediateResult && !game.finished;
  }

  teamTwoWon(game: TournamentGame): boolean {
    return game.playerOneScore < game.playerTwoScore;
  }

  isItMyTeam(teamMatch: TournamentGame) {

    return teamMatch.playerOnePlayerName === this.myTeam ||
      teamMatch.playerTwoPlayerName === this.myTeam;
  }


  requestClearTeamGameResult(event: any, game: TournamentGame) {
    event.stopPropagation();

    this.requestClearTeamGame = game.id;
  }

  clearTeamGameResultConfirm(event: any, teamMatch: TournamentGame) {

    event.stopPropagation();

    this.requestClearTeamGame = '';

    this.onClearTeamGameResult.emit({
      teamMatch: teamMatch,
      playerMatchesForTeamOne: this.getPlayerMatchesForTeamOne(teamMatch)
    });
  }

  clearTeamGameResultDecline(event: any) {
    event.stopPropagation();
    this.requestClearTeamGame = '';
  }

  openTeamGameResultDialog(selectedTeamMatch: TournamentGame) {

    if (this.draggedTournamentPlayerId) {
      return;
    }

    const dialogRef = this.dialog.open(TeamMatchDialogComponent, {
      data: {
        selectedTeamMatch: selectedTeamMatch,
        isAdmin: this.isAdmin,
        isCoOrganizer: this.isCoOrganizer,
        userPlayerData: this.userPlayerData,
        round: this.round,
        myTeam: this.myTeam,

        actualTournament: this.actualTournament,
        armyLists: this.armyLists,
        playerGamesForTeam$: this.getPlayerMatchesForBothTeams(selectedTeamMatch),
        rankingsForRound: this.playerRankingsForRound,
        actualTournamentTeams: this.actualTournamentTeams
      },
    });
    const gameResultEvent = dialogRef.componentInstance.onGameResultEntered
      .subscribe((gameResult: GameResult) => {

        if (gameResult !== undefined) {

          this.onTeamMatchGameResult.emit({
            gameBefore: gameResult.gameBefore,
            gameAfter: gameResult.gameAfter
          });
        }
      });


    const clearPlayerGameEvent = dialogRef.componentInstance.onClearPlayerGameResult
      .subscribe((game: TournamentGame) => {

        if (game !== undefined) {

          this.onClearTeamPlayerGameResult.emit(game);
        }
      });

    dialogRef.afterClosed().subscribe(() => {

      gameResultEvent.unsubscribe();
      clearPlayerGameEvent.unsubscribe();
    });
  }

  swapTeamOne(event: any, game: TournamentGame) {

    const that = this;

    event.stopPropagation();

    this.draggedTournamentPlayerId = game.playerOneTournamentPlayerId;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerTwoTournamentPlayerId;
    this.draggedGame = game;

    _.forEach(this.teamRankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.opponentTournamentPlayerIds && ranking.tournamentPlayerId === game.playerOneTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });

    this.snackBar.open('Player swap started. Click other player to swap', '', {
      extraClasses: ['snackBar-info'],
      duration: 5000
    });
  }

  swapTeamTwo(event: any, game: TournamentGame) {

    const that = this;

    event.stopPropagation();

    this.draggedTournamentPlayerId = game.playerTwoTournamentPlayerId;
    this.draggedTournamentPlayerCurrentOpponentId = game.playerOneTournamentPlayerId;
    this.draggedGame = game;

    _.forEach(this.teamRankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.opponentTournamentPlayerIds && ranking.tournamentPlayerId === game.playerTwoTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });
  }

  endSwapTeam(event: any) {
    event.stopPropagation();

    this.draggedTournamentPlayerId = '';
    this.draggedTournamentPlayerCurrentOpponentId = '';
    this.draggedGame = undefined;

  }

  dropPossible(game: TournamentGame, playerId: string): boolean {

    return !game.finished &&
      !_.includes(this.draggedTournamentPlayerOpponentIds, playerId) &&
      this.draggedTournamentPlayerCurrentOpponentId !== playerId &&
      this.draggedTournamentPlayerId !== playerId;
  }

  confirmDropTeam(event: any,
                  droppedGame: TournamentGame,
                  droppedTournamentPlayerId: string,
                  opponentDroppedPlayerId: string) {

    if (this.draggedTournamentPlayerId &&
        this.dropPossible(droppedGame, opponentDroppedPlayerId)) {
      event.stopPropagation();

      console.log('confirmDropTeam');

      this.swappingService.swapTeam(this.actualTournament,
        this.draggedGame,
        this.draggedTournamentPlayerId,
        droppedGame,
        droppedTournamentPlayerId,
        this.playerGamesForRound,
        this.actualTournamentPlayers,
        this.playerRankingsForRound,
        this.teamRankingsForRound,
        this.allTeamRankings);

      this.snackBar.open('Teams successfully swapped ', '', {
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

      return teamMatch.playerOnePlayerName === playerMatch.playerOneTeamName ||
        teamMatch.playerTwoPlayerName === playerMatch.playerOneTeamName;
    });
  }

  getPlayerMatchesForBothTeams(teamMatch: TournamentGame): Observable<TournamentGame[]> {

    return this.playerGamesForRound$.map(games => {
      return games.filter((playerMatch: TournamentGame) => {
        return teamMatch.playerOnePlayerName === playerMatch.playerOneTeamName ||
          teamMatch.playerTwoPlayerName === playerMatch.playerOneTeamName ||
          teamMatch.playerOnePlayerName === playerMatch.playerTwoTeamName ||
          teamMatch.playerTwoPlayerName === playerMatch.playerTwoTeamName;
      });
    });
  }
}
