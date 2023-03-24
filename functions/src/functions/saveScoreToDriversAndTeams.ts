import { QuerySnapshot } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { EventContext } from "firebase-functions";
import { Result } from "../models/result.model";
import { RacePrediction } from "../models/prediction.model";
import { Driver } from "../models/driver.model";
import { Race } from "../models/race.model";

interface Points {
  [key: string]: number;
}

export default async (data: Result, context: EventContext, admin: any) => {
  const driversRef = admin.firestore().collection("drivers");
  const teamsRef = admin.firestore().collection("teams");
  const raceRef = admin.firestore().collection("races").doc(data.raceId);

  const race = await raceRef.get();
  const raceData = race.data() as Race;

  functions.logger.log(
    "saveScoreToDriversAndteams",
    context.params.documentId,
    data
  );

  const getRacePoints = (): Array<number> => {
    switch (data.scoreMultiplier) {
      case "raced75orMore":
        return [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0];
      case "raced50till75":
        return [19, 14, 12, 10, 8, 6, 4, 3, 2, 1, 0];
      case "raced25till50":
        return [13, 10, 8, 6, 5, 4, 3, 2, 1, 0, 0];
      case "raced2lapstill25":
        return [6, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0];
      default:
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  };

  const racePoints: Array<number> = getRacePoints();

  const sprintRacePoints = [8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0];

  const teamPoints = new Map();

  await driversRef
    .get()
    .then((querySnapshot: QuerySnapshot) => {
      querySnapshot.forEach((doc) => {
        const driver = doc.data() as Driver;
        const driverId = doc.id;
        const results = Object.keys(data.race).filter(
          (key) => data.race[key as keyof RacePrediction] === driverId
        );

        let points = 0;
        results.sort().reverse(); // So pos* goes before Fastest lap

        results.forEach((result) => {
          if (result.includes("pos")) {
            const pos = parseInt(result.replace("pos", ""));
            points += racePoints[pos - 1];
          }

          // Driver has to have finished in top 10 to get fastest lap (so has points)
          if (result.includes("fastest") && points > 0) {
            points += 1;
          }
        });

        if (raceData.isSprintRace) {
          const qualification = data.qualification as any;
          const results = Object.keys(data.qualification).filter(
            (key) => qualification[key] === driverId
          );

          results.forEach((result) => {
            const pos = parseInt(result.replace("pos", ""));
            points += sprintRacePoints[pos - 1];
          });
        }

        // Add to list of points
        let driverPoints = driver.points as Points;
        if (Array.isArray(driverPoints)) driverPoints = {};
        if (data.raceId) {
          driverPoints[data.raceId] = points;
        }

        // Calculate pointsTotal
        const pointsTotal = Object.values(driverPoints).reduce(
          (acc, val) => acc + val,
          0
        );
        const previousPointsTotal = pointsTotal - points;

        // Add points to team
        if (teamPoints.get(driver.teamId)) {
          teamPoints.set(driver.teamId, teamPoints.get(driver.teamId) + points);
        } else {
          teamPoints.set(driver.teamId, points);
        }

        doc.ref
          .update({ points: driverPoints, pointsTotal, previousPointsTotal })
          .then(() => {
            console.log("Driver updated successfully");
          })
          .catch((error) => {
            console.error("Error updating driver: ", error);
          });
      });
    })
    .catch((error: Error) => {
      console.error("Error getting drivers: ", error);
    });

  // Write score to team
  teamPoints.forEach(async (value, key) => {
    const documentRef = teamsRef.doc(key);

    try {
      const doc = await documentRef.get();
      const docData = doc.data();
      let points = docData?.points as Points;
      if (Array.isArray(points)) points = {};
      if (data.raceId) {
        points[data.raceId] = value;
      }

      // Calculate pointsTotal
      const pointsTotal = Object.values(points).reduce(
        (acc, val) => acc + val,
        0
      );
      const previousPointsTotal = pointsTotal - key;

      documentRef.update({ points, pointsTotal, previousPointsTotal });
    } catch (error) {
      console.error("Error in teams: ", error);
    }
  });
};
