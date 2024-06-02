import axios from "axios";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import dayjs = require("dayjs");

dotenv.config();

// Set up Nodemailer with your email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_EMAIL_FROM,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const API_URL = "https://portal.matchday-backend.com/liff/free-courts?lang=th";
const API_HEADERS = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9",
  authorization: process.env.ENDPOINT_BEARER_TOKEN,
  "content-type": "application/json",
  dnt: "1",
  origin: "https://line-liff-358c1.web.app",
  priority: "u=1, i",
  referer: "https://line-liff-358c1.web.app/",
  "sec-ch-ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

// ✏️ Edit the time slots to check for court availability
const timeSlots = [
  {
    time_start: "2024-06-06 19:00:00.000",
    time_end: "2024-06-06 21:00:00.000",
  },
  {
    time_start: "2024-06-13 19:00:00.000",
    time_end: "2024-06-13 21:00:00.000",
  },
  {
    time_start: "2024-06-20 19:00:00.000",
    time_end: "2024-06-20 21:00:00.000",
  },
  {
    time_start: "2024-06-27 19:00:00.000",
    time_end: "2024-06-27 21:00:00.000",
  },
];

export const checkBadmintonCourts = async () => {
  console.log("checkBadmintonCourts");

  try {
    const freeCourtsPromises = timeSlots.map((slot) => {
      return axios.post(
        API_URL,
        { court_type_id: 1092, ...slot },
        { headers: API_HEADERS }
      );
    });

    const freeCourtsResponses = await Promise.all(freeCourtsPromises);

    const emailPromises = freeCourtsResponses.map(async (response, index) => {
      const data = response.data;
      const slot = timeSlots[index];

      if (!data.is_full) {
        const mailOptions = {
          to: process.env.GOOGLE_EMAIL_TO,
          from: process.env.GOOGLE_EMAIL_FROM,
          subject: "✅ Badminton Court Availability",
          html: `The NJ court is available for booking for ${
            data.courts.length
          } court${data.courts.length > 0 ? "s" : ""} on ${dayjs(
            slot.time_start
          ).format("MMM, D (ddd)")} at ${dayjs(slot.time_start).format(
            "HH:mm"
          )} - ${dayjs(slot.time_end).format(
            "HH:mm"
          )}<a href="https://liff.line.me/2004766449-ZL1VLM66">🔗 Open Link</a>.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(
          `✅ Email sent successfully for time slot ${slot.time_start} to ${slot.time_end}`
        );
      } else {
        console.log(`❌ ${slot.time_start} - ${slot.time_end} is full`);
        return Promise.resolve(); // Return a resolved promise if the court is full
      }
    });

    await Promise.all(emailPromises);
  } catch (error) {
    console.error("Error checking court availability:", error);
  }
};
