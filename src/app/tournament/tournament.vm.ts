export interface TournamentListVM {

  monthYear: number;
  tournaments: Tournament[];

}

export interface Tournament {

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


