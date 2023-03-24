import { Timestamp } from "firebase/firestore";

export class RaceDates {
  qualification: Timestamp = Timestamp.now();
  race: Timestamp = Timestamp.now();
}

export class Race {
  readonly id?: string;
  circuit: string = "";
  country: string = "";
  countryCode: string = "";
  dates: RaceDates = new RaceDates();
  isSprintRace: boolean = false;
  slug: string = "";
  result?: Object;
}
