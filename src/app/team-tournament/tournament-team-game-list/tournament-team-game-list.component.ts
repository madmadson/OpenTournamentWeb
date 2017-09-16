import {AfterContentChecked, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {Player} from '../../../../shared/model/player';
import {Observable} from 'rxjs/Observable';
import {TournamentGame} from '../../../../shared/model/tournament-game';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';

import {AuthenticationStoreState} from '../../store/authentication-state';
import {Tournament} from '../../../../shared/model/tournament';
import {TournamentRanking} from '../../../../shared/model/tournament-ranking';

import * as _ from 'lodash';
import {SwapGames} from '../../../../shared/dto/swap-player';
import {WindowRefService} from '../../service/window-ref-service';
import {GlobalEventService} from 'app/service/global-event-service';
import {getAllScenarios} from '../../../../shared/model/szenarios';
import {ScenarioSelectedModel} from '../../../../shared/dto/scenario-selected-model';
import {GameResult} from '../../../../shared/dto/game-result';
import {ArmyList} from '../../../../shared/model/armyList';
import {TournamentTeam} from '../../../../shared/model/tournament-team';


@Component({
  selector: 'tournament-team-game-list',
  templateUrl: './tournament-team-game-list.component.html',
  styleUrls: ['./tournament-team-game-list.component.scss']
})
export class TournamentTeamGameListComponent implements OnInit, AfterContentChecked {

  @Input() round: number;
  @Input() isAdmin: boolean;
  @Input() isCoOrganizer: boolean;
  @Input() actualTournament: Tournament;
  @Input() authenticationStoreState$: Observable<AuthenticationStoreState>;
  @Input() actualTournamentArmyLists$: Observable<ArmyList[]>;
  @Input() teamGamesForRound: TournamentGame[];
  @Input() playerGamesForRound$: Observable<TournamentGame[]>;
  @Input() rankingsForRound$: Observable<TournamentRanking[]>;
  @Input() actualTournamentTeams$: Observable<TournamentTeam[]>;

  @Output() onTeamMatchGameResult = new EventEmitter<GameResult>();
  @Output() onSwapPlayer = new EventEmitter<SwapGames>();
  @Output() onSwapTeam = new EventEmitter<SwapGames>();
  @Output() onScenarioSelectedForTeamTournament = new EventEmitter<ScenarioSelectedModel>();

  @Output() onClearPlayerGameResult = new EventEmitter<TournamentGame>();
  @Output() onClearTeamGameResult = new EventEmitter<TournamentGame>();

  userPlayerData: Player;
  currentUserId: string;
  armyLists$: Observable<ArmyList[]>;

  dragStarted: boolean;
  draggedTournamentPlayerId: string;
  draggedTournamentPlayerCurrentOpponentId: string;
  draggedTournamentPlayerOpponentIds: string[];
  draggedGame: TournamentGame;

  teamRankingsForRound: TournamentRanking[];
  allVisibleTeamGames: TournamentGame[];

  smallScreen: boolean;
  swapPlayerMode: boolean;
  requestClearGame: string;
  scenarios: string[];

  selectedScenario: string;

  loggedInUserTeam: string;
  dragRequestTeamName: string;

  constructor(public dialog: MdDialog,
              private snackBar: MdSnackBar,
              private messageService: GlobalEventService,
              private winRef: WindowRefService) {
    this.smallScreen = this.winRef.nativeWindow.screen.width < 1024;
    this.scenarios = getAllScenarios();
  }

  ngOnInit() {

    const that = this;

    this.armyLists$ = this.actualTournamentArmyLists$;

    this.authenticationStoreState$.subscribe(auth => {
      this.userPlayerData = auth.userPlayerData;
      this.currentUserId = auth.currentUserId;

      this.actualTournamentTeams$.subscribe(teams => {
        if (this.userPlayerData ) {
          _.each(teams, function (team: TournamentTeam) {
            if (team.registeredPlayerIds.indexOf(that.userPlayerData.id) !== -1) {
              that.loggedInUserTeam = team.teamName;
            }
          });
        }
      });

    });

    this.rankingsForRound$.subscribe(rankings => {
      this.teamRankingsForRound = rankings;
    });

    this.allVisibleTeamGames = this.teamGamesForRound;
  }

  ngAfterContentChecked(): void {

    if (this.teamGamesForRound[0]) {
      this.selectedScenario = this.teamGamesForRound[0].scenario;
    }
  }

  changeScenario(): void {

    if (this.teamGamesForRound[0]) {
      this.onScenarioSelectedForTeamTournament.emit({
        tournamentId: this.actualTournament.id,
        round: this.teamGamesForRound[0].tournamentRound,
        scenario: this.selectedScenario
      });
    }
  }

  clickSwapTeam(event: any, game: TournamentGame, dragTournamentPlayerId: string,
                dragTournamentPlayerOpponentId: string) {

    console.log('click swap team');

    event.stopPropagation();

    this.dragRequestTeamName = dragTournamentPlayerId;

    const that = this;

    this.swapPlayerMode = true;
    this.draggedTournamentPlayerId = dragTournamentPlayerId;
    this.draggedTournamentPlayerCurrentOpponentId = dragTournamentPlayerOpponentId;
    this.draggedGame = game;
    this.dragStarted = true;

    _.each(this.teamRankingsForRound, function (ranking: TournamentRanking) {
      if (ranking.tournamentPlayerId === dragTournamentPlayerId) {
        that.draggedTournamentPlayerOpponentIds = ranking.opponentTournamentPlayerIds;
      }
    });

    this.messageService.broadcast('swapPlayerMode', true);
  }

  requestClearGameResult(event: any, game: TournamentGame) {
    event.stopPropagation();

    this.requestClearGame = game.id;
  }

  clearGameResultConfirm(event: any, game: TournamentGame) {

    event.stopPropagation();

    this.requestClearGame = '';
    this.onClearTeamGameResult.emit(game);
  }

  clearGameResultDecline(event: any) {
    event.stopPropagation();
    this.requestClearGame = '';
  }

  endSwapPlayer(event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.dragRequestTeamName = '';

    this.swapPlayerMode = false;
    this.dragStarted = false;

    this.messageService.broadcast('swapPlayerMode', false);
  }

  confirmSwapTeam(event: any, droppedGame: TournamentGame,
                  droppedTournamentPlayerId: string,
                  droppedTournamentPlayerOpponentId: string) {

    if (this.dragStarted) {

      event.stopPropagation();

      if (!droppedGame.finished && this.draggedGame) {
        this.swapPlayerMode = false;
        this.dragStarted = false;
        this.dragRequestTeamName = '';
        this.messageService.broadcast('swapPlayerMode', false);

        // Don't do anything if dropping the same column we're dragging.
        if (droppedTournamentPlayerId !== this.draggedTournamentPlayerId &&
          droppedGame !== this.draggedGame) {
          if (!this.playedAgainstOthers(this.draggedTournamentPlayerId, droppedTournamentPlayerOpponentId, droppedGame) &&
            !this.playedAgainstOthers(droppedTournamentPlayerId, this.draggedTournamentPlayerCurrentOpponentId, this.draggedGame)) {
            this.doSwapping(droppedGame, droppedTournamentPlayerId);
          }
        }

      }
    }
  }

  dragEnable(tournamentPlayerId: string, opponentTournamentPlayerId: string): boolean {

    return !(this.draggedTournamentPlayerId === tournamentPlayerId ||
    this.draggedTournamentPlayerId === opponentTournamentPlayerId ||
    _.includes(this.draggedTournamentPlayerOpponentIds, opponentTournamentPlayerId));

  }


  private doSwapping(droppedGame: TournamentGame, droppedTournamentPlayerId: string) {
    const newGameOne = this.createGameOne(droppedGame, droppedTournamentPlayerId);
    const newGameTwo = this.createGameTwo(droppedGame, droppedTournamentPlayerId);

    const swapPlayer: SwapGames = {
      gameOne: newGameOne,
      gameTwo: newGameTwo,
    };

    this.onSwapTeam.emit(swapPlayer);
  }

  private createGameOne(droppedGame: TournamentGame, droppedTournamentPlayerId: string): TournamentGame {

    let gameOnePlayerOneAffected = false;
    let gameOnePlayerTwoAffected = false;
    let gameTwoPlayerOneAffected = false;
    let gameTwoPlayerTwoAffected = false;

    if (this.draggedGame.playerOneTournamentPlayerId === this.draggedTournamentPlayerId) {
      // X-1 / X-2
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOneAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // X-1 / 2-X
        gameOnePlayerOneAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    } else {
      // 1-X / X-2
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // 1-X / 2-X
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    }

    return {
      id: this.draggedGame.id,
      tournamentId: this.draggedGame.tournamentId,

      playerOnePlayerId: gameOnePlayerTwoAffected ? this.draggedGame.playerOnePlayerId :
        gameTwoPlayerOneAffected ? droppedGame.playerOnePlayerId : droppedGame.playerTwoPlayerId,
      playerOneTournamentPlayerId: gameOnePlayerTwoAffected ? this.draggedGame.playerOneTournamentPlayerId :
        gameTwoPlayerOneAffected ? droppedGame.playerOneTournamentPlayerId : droppedGame.playerTwoTournamentPlayerId,
      playerOnePlayerName: gameOnePlayerTwoAffected ? this.draggedGame.playerOnePlayerName :
        gameTwoPlayerOneAffected ? droppedGame.playerOnePlayerName : droppedGame.playerTwoPlayerName,
      playerOneTeamName: '',
      playerOneFaction: gameOnePlayerTwoAffected ? this.draggedGame.playerOneFaction :
        gameTwoPlayerOneAffected ? droppedGame.playerOneFaction : droppedGame.playerTwoFaction,
      playerOneElo: gameOnePlayerTwoAffected ? this.draggedGame.playerOneElo :
        gameTwoPlayerOneAffected ? droppedGame.playerOneElo : droppedGame.playerTwoElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,
      playerOneIntermediateResult: 0,

      playerTwoPlayerId: gameOnePlayerOneAffected ? this.draggedGame.playerTwoPlayerId :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoPlayerId : droppedGame.playerOnePlayerId,
      playerTwoTournamentPlayerId: gameOnePlayerOneAffected ? this.draggedGame.playerTwoTournamentPlayerId :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoTournamentPlayerId : droppedGame.playerOneTournamentPlayerId,
      playerTwoPlayerName: gameOnePlayerOneAffected ? this.draggedGame.playerTwoPlayerName :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoPlayerName : droppedGame.playerOnePlayerName,
      playerTwoTeamName: '',
      playerTwoFaction: gameOnePlayerOneAffected ? this.draggedGame.playerTwoFaction :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoFaction : droppedGame.playerOneFaction,
      playerTwoElo: gameOnePlayerOneAffected ? this.draggedGame.playerTwoElo :
        gameTwoPlayerTwoAffected ? droppedGame.playerTwoElo : droppedGame.playerOneElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,
      playerTwoIntermediateResult: 0,

      playingField: this.draggedGame.playingField,
      tournamentRound: this.draggedGame.tournamentRound,
      finished: this.draggedGame.finished,
      scenario: this.draggedGame.scenario
    };
  }

  private createGameTwo(droppedGame: TournamentGame, droppedTournamentPlayerId: string): TournamentGame {
    let gameOnePlayerOneAffected = false;
    let gameOnePlayerTwoAffected = false;
    let gameTwoPlayerOneAffected = false;
    let gameTwoPlayerTwoAffected = false;

    if (this.draggedGame.playerOneTournamentPlayerId === this.draggedTournamentPlayerId) {
      // Drag:  X-1 /Drop: X-1
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerOneAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // Drag: X-1 / Drop: 1-X
        gameOnePlayerOneAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    } else {
      // Drag: 1-X /Drop: X-1
      if (droppedGame.playerOneTournamentPlayerId === droppedTournamentPlayerId) {
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerOneAffected = true;
      } else {
        // Drag: 1-X /Drop: 1-X
        gameOnePlayerTwoAffected = true;
        gameTwoPlayerTwoAffected = true;
      }
    }


    return {
      id: droppedGame.id,
      tournamentId: droppedGame.tournamentId,

      playerOnePlayerId: gameTwoPlayerTwoAffected ? droppedGame.playerOnePlayerId :
        gameOnePlayerOneAffected ? this.draggedGame.playerOnePlayerId : this.draggedGame.playerTwoPlayerId,
      playerOneTournamentPlayerId: gameTwoPlayerTwoAffected ? droppedGame.playerOneTournamentPlayerId :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneTournamentPlayerId : this.draggedGame.playerTwoTournamentPlayerId,
      playerOnePlayerName: gameTwoPlayerTwoAffected ? droppedGame.playerOnePlayerName :
        gameOnePlayerOneAffected ? this.draggedGame.playerOnePlayerName : this.draggedGame.playerTwoPlayerName,
      playerOneTeamName: '',
      playerOneFaction: gameTwoPlayerTwoAffected ? droppedGame.playerOneFaction :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneFaction : this.draggedGame.playerTwoFaction,
      playerOneElo: gameTwoPlayerTwoAffected ? droppedGame.playerOneElo :
        gameOnePlayerOneAffected ? this.draggedGame.playerOneElo : this.draggedGame.playerTwoElo,
      playerOneScore: 0,
      playerOneControlPoints: 0,
      playerOneVictoryPoints: 0,
      playerOneArmyList: '',
      playerOneEloChanging: 0,
      playerOneIntermediateResult: 0,

      playerTwoPlayerId: gameTwoPlayerOneAffected ? droppedGame.playerTwoPlayerId :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoPlayerId : this.draggedGame.playerOnePlayerId,
      playerTwoTournamentPlayerId: gameTwoPlayerOneAffected ? droppedGame.playerTwoTournamentPlayerId :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoTournamentPlayerId : this.draggedGame.playerOneTournamentPlayerId,
      playerTwoPlayerName: gameTwoPlayerOneAffected ? droppedGame.playerTwoPlayerName :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoPlayerName : this.draggedGame.playerOnePlayerName,
      playerTwoTeamName: '',
      playerTwoFaction: gameTwoPlayerOneAffected ? droppedGame.playerTwoFaction :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoFaction : this.draggedGame.playerOneFaction,
      playerTwoElo: gameTwoPlayerOneAffected ? droppedGame.playerTwoElo :
        gameOnePlayerTwoAffected ? this.draggedGame.playerTwoElo : this.draggedGame.playerOneElo,
      playerTwoScore: 0,
      playerTwoControlPoints: 0,
      playerTwoVictoryPoints: 0,
      playerTwoArmyList: '',
      playerTwoEloChanging: 0,
      playerTwoIntermediateResult: 0,

      playingField: droppedGame.playingField,
      tournamentRound: droppedGame.tournamentRound,
      finished: droppedGame.finished,
      scenario: droppedGame.scenario
    };
  }


  playedAgainstOthers(tournamentPlayerOneId: string, tournamentPlayerTwoId: string, game: TournamentGame): boolean {

    // const that = this;
    //
    // let playedAgainstOther = false;
    //
    // _.forEach(this.teamRankingsForRound, function (rank) {
    //
    //   if (tournamentPlayerOneId === 'bye' && rank.tournamentPlayerId === tournamentPlayerTwoId) {
    //
    //     const alreadyHasABye = _.includes(rank.opponentTournamentPlayerIds, 'bye');
    //
    //     if (alreadyHasABye) {
    //       that.snackBar.open(rank.playerName + 'already has a BYE ', '', {
    //         extraClasses: ['snackBar-info'],
    //         duration: 5000
    //       });
    //       playedAgainstOther = true;
    //     }
    //     return;
    //   }
    //   if (rank.tournamentPlayerId === tournamentPlayerOneId) {
    //     const pl = _.find(rank.opponentTournamentPlayerIds,
    //       function (player1OpponentTournamentPlayerId: string) {
    //         return player1OpponentTournamentPlayerId === tournamentPlayerTwoId;
    //       });
    //     if (pl) {
    //       playedAgainstOther = true;
    //       if (tournamentPlayerTwoId === game.playerOneTournamentPlayerId) {
    //         that.snackBar.open(rank.playerName + ' already played against ' + game.playerOnePlayerName, '', {
    //           extraClasses: ['snackBar-info'],
    //           duration: 5000
    //         });
    //       } else {
    //         that.snackBar.open(rank.playerName + ' already played against ' + game.playerTwoPlayerName, '', {
    //           extraClasses: ['snackBar-info'],
    //           duration: 5000
    //         });
    //       }
    //     }
    //     return;
    //   }
    // });

    return false;
  }


  openTeamMatchDialog(selectedTeamMatch: TournamentGame) {



  }

  isItMyTeamGame(game: TournamentGame) {
    if (this.userPlayerData && this.loggedInUserTeam) {
      return (game.playerOnePlayerName === this.loggedInUserTeam) ||
        (game.playerTwoPlayerName === this.loggedInUserTeam);
    }
  }
}

