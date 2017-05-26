

import {Registration} from '../model/registration';
import {Tournament} from '../model/tournament';
import {TournamentTeam} from "../model/tournament-team";


export class RegistrationPush {

  registration: Registration;
  tournament: Tournament;
  tournamentTeam?: TournamentTeam;
}
