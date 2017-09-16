import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {GameResult} from '../../../shared/dto/game-result';
import {TournamentGame} from '../../../shared/model/tournament-game';
import {GameConfig, getWarmachineConfig} from '../../../shared/dto/game-config';
import {ArmyList} from '../../../shared/model/armyList';
import {Observable} from 'rxjs/Observable';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {WindowRefService} from '../service/window-ref-service';

import * as _ from 'lodash';
import {Tournament} from '../../../shared/model/tournament';
import {TournamentRanking} from '../../../shared/model/tournament-ranking';
import {TournamentTeam} from '../../../shared/model/tournament-team';
import {SwapGames} from '../../../shared/dto/swap-player';
import {Player} from "../../../shared/model/player";

@Component({
  selector: 'team-game-result-dialog',
  templateUrl: './team-game-result-dialog.html',
  styleUrls: ['./team-game-result-dialog.scss']
})
export class TeamMatchDialogComponent {

  isAdmin: boolean;
  isCoOrganizer: boolean;
  userPlayerData: Player;
  round: number;

  selectedTeamMatch: TournamentGame;
  actualTournament: Tournament;
  armyLists: ArmyList[];
  playerGamesForTeam$: Observable<TournamentGame[]>;
  rankingsForRound: TournamentRanking[];
  actualTournamentTeams: TournamentTeam[];

  @Output() onGameResultEntered = new EventEmitter<GameResult>();
  @Output() onClearPlayerGameResult = new EventEmitter<TournamentGame>();

  constructor(public dialogRef: MdDialogRef<TeamMatchDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {

    this.selectedTeamMatch = data.selectedTeamMatch;
    this.isAdmin = data.isAdmin;
    this.isCoOrganizer = data.isCoOrganizer;
    this.round = data.round;
    this.userPlayerData = data.userPlayerData;

    this.actualTournament = data.actualTournament;

    this.armyLists = data.armyLists;
    this.actualTournamentTeams = data.actualTournamentTeams;

    this.playerGamesForTeam$ = data.playerGamesForTeam$;
    this.rankingsForRound = data.rankingsForRound;
  }

  handlePlayerGameResult(result: GameResult) {

    this.onGameResultEntered.emit(result);
  }


  handleClearPlayerGameResult(game: TournamentGame) {

    this.onClearPlayerGameResult.emit(game);
  }
}
