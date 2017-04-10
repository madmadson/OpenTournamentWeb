import {Moment} from 'moment';
export interface TournamentListVM {

  monthYear: number;
  tournaments: TournamentVM[];

}

export interface TournamentVM {

  id: string;
  name: string;
  location: string;
  beginDate: string;
  endDate: string;
  maxParticipants: number;
  teamSize: number;
  actualRound: number;
  creatorUid: string;
}


