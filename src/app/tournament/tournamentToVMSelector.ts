import {TournamentVM} from './tournament.vm';
import {Tournament} from '../../../shared/model/tournament';

export function mapTournamentToTournamentVM(tournament: Tournament): TournamentVM {

  console.log('mapTournamentToTournamentVM:' + JSON.stringify(tournament));

  return {
    id: tournament.id,
    name: tournament.name,
    location: tournament.location,
    beginDate: tournament.beginDate,
    endDate: tournament.endDate,
    maxParticipants: tournament.maxParticipants,
    teamSize: tournament.teamSize,
    actualRound: tournament.actualRound,
    creatorUid: tournament.creatorUid
  };
}
