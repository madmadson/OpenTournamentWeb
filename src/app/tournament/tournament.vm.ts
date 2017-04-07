export interface TournamentListVM {

  monthYear: number;
  tournaments: TournamentVM[];

}

export interface TournamentVM {

  id: string;
  name: string;
  location: string;
  beginDate: String;
  endDate: String;
  maxParticipants: number;
  teamSize: number;
  actualRound: number;
  creatorUid: string;
}


