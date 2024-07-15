import { CronJob } from "cron";
import { Op } from "sequelize";
import tokenModel from "../../model/token/index.js";
import Otp from "../../model/otp/index.js";

const scheduleTokenCleanup = () => {
  const job = new CronJob("0 */5 * * *", async () => {
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
      console.log("Expired tokens cleaned up");
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  });

  // Start the job
  job.start();
};

export default scheduleTokenCleanup;
