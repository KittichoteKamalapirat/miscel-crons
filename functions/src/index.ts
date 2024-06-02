import { onSchedule } from "firebase-functions/v2/scheduler";

export const punishUsersOnSchedule = onSchedule(
  // "every day 00:00",
  // "every 60 minutes",
  // "every 1 minutes",
  "3 * * * *", // min, hour, day of month, month, day of week,
  punishCustomer
);
