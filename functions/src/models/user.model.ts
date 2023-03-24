interface Points {
  [key: string]: {
    qualification: number;
    race: number | null;
    total: number;
  };
}

export class User {
  readonly id?: string;
  name: string = "";
  slug: string = "";
  points: Points = {};
  pointsTotal: number = 0;
  previousPointsTotal: number = 0;
  role: "admin" | "user" = "user";
  driverChampion: string = "";
  constructorsChampion: string = "";
}

export interface UserWithPoints extends User {
  lastPointsGained: number;
  positionsGained: number;
  pointsTotal: number;
}
