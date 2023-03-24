interface Points {
  [key: string]: number;
}

export class Driver {
  readonly id?: string;
  name: string = "";
  country: string = "";
  slug: string = "";
  teamId: string = "";
  points: Points = {};
  pointsTotal: number = 0;
  previousPointsTotal: number = 0;
}

export interface DriverWithPoints extends Driver {
  lastPointsGained: number;
  positionsGained: number;
  pointsTotal: number;
}
