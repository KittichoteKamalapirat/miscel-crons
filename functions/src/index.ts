import { onSchedule } from "firebase-functions/v2/scheduler";
import { checkBadmintonCourts } from "./services/checkBadmintonCourts";
// import { onRequest } from "firebase-functions/v2/https";

export const checkBadmintonCourtsOnSchedule = onSchedule(
  // "every day 00:00",
  "every 60 minutes",
  // "every 1 minutes",
  // "0 1 * * *", // min, hour, day of month, month, day of week,
  checkBadmintonCourts
);

// export const checkBadmintonCourtsOnRequest = onRequest(checkBadmintonCourts);
