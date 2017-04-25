


export function getWarmachineConfig(): GameConfig {

  return new GameConfig('warmachine',
    [new GamePoint('score', 'sc', 0, 1),
      new GamePoint('controlPoints', 'cp', 0, 30),
      new GamePoint('victoryPoints', 'vp', 0, 500)]);
}

export class GameConfig {

  id: string;
  points: GamePoint[];

  constructor(id: string, points: GamePoint[]) {

    this.id = id;
    this.points = points;
  }

}

export class GamePoint {

  description: string;
  descriptionShort: string;
  min: number;
  max: number;


  constructor(description: string, descriptionShort: string, min: number, max: number) {

    this.description = description;
    this.descriptionShort = descriptionShort;
    this.min = min;
    this.max = max;
  }
}
