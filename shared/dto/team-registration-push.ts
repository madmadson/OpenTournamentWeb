



import {Registration} from '../model/registration';
import {Tournament} from '../model/tournament';
import {TournamentTeam} from '../model/tournament-team';

export class TeamRegistrationPush {

  team: TournamentTeam;
  registrations: Registration[];
  tournament: Tournament;
}
