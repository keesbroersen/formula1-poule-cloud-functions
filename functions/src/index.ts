import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import saveScoreToDriversAndTeams from "./functions/saveScoreToDriversAndTeams";
import saveScoreToUsers from "./functions/saveScoreToUsers";
import { Result } from "./models/result.model";

admin.initializeApp();

exports.resultSet = functions.firestore
  .document("results/{documentId}")
  .onWrite((change, context) => {
    const data = change.after.data() as Result;

    saveScoreToDriversAndTeams(data, context, admin);
    saveScoreToUsers(data, context, admin);

    return null;
  });
