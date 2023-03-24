import { QuerySnapshot } from "firebase-admin/firestore";
import { EventContext } from "firebase-functions";
import {
  Prediction,
  QualificationPrediction,
  RacePrediction,
} from "../models/prediction.model";
import { Result } from "../models/result.model";
import { User } from "../models/user.model";

interface Points {
  [key: string]: {
    qualification: number;
    race: number | null;
    total: number;
  };
}

export default async (result: Result, context: EventContext, admin: any) => {
  const usersRef = admin.firestore().collection("users");
  const predictionsRef = admin.firestore().collection("predictions");

  const calculateQualificationResult = (prediction: Prediction): number => {
    let score = 0;
    const qualificationResult = result.qualification;
    for (const [key, value] of Object.entries(qualificationResult)) {
      if (
        prediction.qualification[key as keyof QualificationPrediction] === value
      ) {
        score++;
      }
    }

    // If user has all three correct, extra point is awarded
    if (score === 3) score = 4;
    return score;
  };

  const calculateRaceResult = (prediction: Prediction): number | null => {
    const raceResult = result.race;
    if (Object.keys(raceResult).length < 13) return null;

    let score = 0;

    for (const [key, value] of Object.entries(raceResult)) {
      const predictionValue = prediction.race[key as keyof RacePrediction];
      if (!value || !predictionValue) continue;

      if (predictionValue === value) {
        // Direct hit
        if (key === "driverOfTheDay" || key === "fastestLap") {
          // These get one point
          score++;
        } else {
          // These get three points
          score += 3;
        }
      } else if (key.includes("pos")) {
        const keyNumber = parseInt(key.replace("pos", ""));
        if (
          predictionValue ===
            raceResult[`pos${keyNumber - 1}` as keyof RacePrediction] ||
          predictionValue ===
            raceResult[`pos${keyNumber + 1}` as keyof RacePrediction]
        ) {
          // Indirect hit (one position of)
          // One point
          score++;
        }
      }
    }

    return score;
  };

  await usersRef.get().then((querySnapshot: QuerySnapshot) => {
    querySnapshot.forEach(async (doc) => {
      const user = doc.data() as User;
      const userId = doc.id;

      const predictionQuerySnapshot: QuerySnapshot = await predictionsRef
        .where("raceId", "==", result.raceId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

      let qualificationPoints = 0;
      let racePoints = null;

      if (!predictionQuerySnapshot.empty) {
        const prediction = predictionQuerySnapshot.docs[0].data() as Prediction;
        qualificationPoints = calculateQualificationResult(prediction);
        racePoints = calculateRaceResult(prediction);
      }

      const totalPointsForThisPrediction = racePoints
        ? racePoints + qualificationPoints
        : qualificationPoints;

      let points = user?.points as Points;
      if (!points) points = {};

      if (result.raceId) {
        points[result.raceId] = {
          qualification: qualificationPoints,
          race: racePoints,
          total: totalPointsForThisPrediction,
        };
      }

      const pointsTotal = Object.values(points).reduce(
        (acc, { total }) => acc + total,
        0
      );
      const previousPointsTotal = pointsTotal - totalPointsForThisPrediction;

      console.log({
        user: user.name,
        totalPointsForThisPrediction,
        pointsTotal,
        previousPointsTotal,
      });

      doc.ref.update({ points, pointsTotal, previousPointsTotal });
    });
  });
};
