

import {TournamentTeam} from '../model/tournament-team';

export class TeamRegistrationChange {

  team: TournamentTeam;
  armyListsChecked?: boolean;
  paymentChecked?: boolean;
  playerMarkedPayment?: boolean;
  playerUploadedArmyLists?: boolean;

}
