


export class Game {
  id = 0;
  name = '';


  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export const dummyGames: Game[] = [
  {
    id: 1,
    name: 'Warmachine'
  },
  {
    id: 2,
    name: 'Judgement!'
  },
  {
    id: 3,
    name: 'Badminton'
  },
];
