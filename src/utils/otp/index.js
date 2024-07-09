import Otp from "../../model/otp/index.js";
import otpGenerator from "otp-generator";
import sendEmail from "../email/index.js";
import { Op } from "sequelize";
import reservation from "../../model/reservation/index.js";
import customerModel from "../../model/user/customer.js";

const generateOtpCode = () => {
  return otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};
const generateAndSendOtp = async (customerId, email) => {
  const otpCode = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.create({
    customerId,
    otpCode,
    expiresAt,
  });

  await sendEmail(email, "Verify OTP", "otp.handlebars", { otpCode });
};

const validateOtp = async (req, res) => {
  try {
    const { customerId, otpCode } = req.body;

    const otpRecord = await Otp.findOne({
      where: {
        customerId,
        otpCode,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const reservationRecord = await reservation.findOne({
      where: {
        customerId,
        status: "pending",
      },
      order: [["createdAt", "DESC"]],
    });

    if (!reservationRecord) {
      return res.status(404).json({ message: "No pending reservation found" });
    }
    await reservationRecord.update({ status: "confirmed" });
    const userInfo = await customerModel.findByPk(customerId);

    const data = {
      fname: userInfo.firstName,
      lname: userInfo.lastName,
      stime: reservationRecord.startTime,
      etime: reservationRecord.endTime,
      tableId: reservationRecord.tableId,
    };
    await sendEmail(
      userInfo.email,
      "Reservation Confirmation",
      "confirmation.handlebars",
      data
    );
    await otpRecord.destroy();

    return res.status(200).json({
      message: "OTP validated and reservation confirmed",
      reservation: reservationRecord,
    });
  } catch (error) {
    console.error("Error validating OTP:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
export { generateAndSendOtp, validateOtp };
