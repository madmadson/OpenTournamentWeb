export interface TournamentListVM {

  monthYear: number;
  tournaments: TournamentVM[];

}

export interface TournamentVM {

  name: String;
  location: String;
  beginDate: String;
  endDate: String;
  maxParticipants: number;
  teamSize: number;
  actualRound: number;
  creatorUid: string;
}


