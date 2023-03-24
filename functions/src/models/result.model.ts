export class QualificationResult {
  pos1: string | undefined = undefined;
  pos2: string | undefined = undefined;
  pos3: string | undefined = undefined;
  pos4?: string | undefined = undefined;
  pos5?: string | undefined = undefined;
  pos6?: string | undefined = undefined;
  pos7?: string | undefined = undefined;
  pos8?: string | undefined = undefined;
}

export class RaceResult {
  pos1: string | undefined = undefined;
  pos2: string | undefined = undefined;
  pos3: string | undefined = undefined;
  pos4: string | undefined = undefined;
  pos5: string | undefined = undefined;
  pos6: string | undefined = undefined;
  pos7: string | undefined = undefined;
  pos8: string | undefined = undefined;
  pos9: string | undefined = undefined;
  pos10: string | undefined = undefined;
  pos11: string | undefined = undefined;
  driverOfTheDay: string | undefined = undefined;
  fastestLap: string | undefined = undefined;
}

export class Result {
  readonly id?: string;
  raceId: string | undefined;
  raceIndex: number;
  scoreMultiplier:
    | "raced75orMore"
    | "raced50till75"
    | "raced25till50"
    | "raced2lapstill25"
    | "lessThan2laps";
  qualification: QualificationResult;
  race: RaceResult;

  constructor() {
    this.raceId = "";
    this.raceIndex = 0;
    this.scoreMultiplier = "raced75orMore";
    this.qualification = new QualificationResult();
    this.race = new RaceResult();
  }
}
