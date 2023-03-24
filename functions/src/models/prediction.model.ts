export class QualificationPrediction {
  pos1: string | undefined = undefined;
  pos2: string | undefined = undefined;
  pos3: string | undefined = undefined;
}

export class RacePrediction {
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
  driverOfTheDay: string | undefined = undefined;
  fastestLap: string | undefined = undefined;
}

export class Prediction {
  readonly id?: string;
  raceId: string | undefined;
  userId: string | undefined;
  qualification: QualificationPrediction;
  race: RacePrediction;
  qualificationScore?: number;
  raceScore?: number;

  constructor() {
    this.raceId = "";
    this.userId = "";
    this.qualification = new QualificationPrediction();
    this.race = new RacePrediction();
  }
}
