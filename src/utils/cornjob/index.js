import { CronJob } from "cron";
import { Op } from "sequelize";
import tokenModel from "../../model/token/index.js";
import Otp from "../../model/otp/index.js";

import { io } from "../../app.js";
import reservation from "../../model/reservation/index.js";

const scheduleTokenCleanup = () => {
  // Cron job for cleaning up expired tokens and OTPs
  const tokenJob = new CronJob("0 */5 * * *", async () => {
    try {
      const now = new Date();
      await tokenModel.destroy({
        where: {
          expiresAt: {
            [Op.lt]: now,
          },
        },
      });
      await Otp.destroy({
        where: {
          expiresAt: {
            [Op.lt]: now,
          },
        },
      });
      console.log("Expired tokens and OTPs cleaned up");
    } catch (error) {
      console.error("Error cleaning up expired tokens and OTPs:", error);
    }
  });

  // Cron job for updating expired reservations
  const reservationJob = new CronJob("*/12 * * * *", async () => {
    try {
      const now = new Date();
      const [numUpdated, updatedReservations] = await reservation.update(
        { status: "cancelled" },
        {
          where: {
            status: {
              [Op.or]: ["pending", "confirmed"],
            },
            expiresAt: {
              [Op.lt]: now,
            },
          },
          returning: true,
        }
      );

      if (numUpdated > 0) {
        updatedReservations.forEach((reservation) => {
          io.emit("reservationUpdated", {
            reservationId: reservation.id,
            status: reservation.status,
          });
        });
        console.log("Expired reservations updated to cancelled");
      }
    } catch (error) {
      console.error("Error updating expired reservations:", error);
    }
  });

  // Start the jobs
  tokenJob.start();
  reservationJob.start();
};

export default scheduleTokenCleanup;
