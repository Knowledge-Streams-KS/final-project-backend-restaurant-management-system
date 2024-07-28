import Otp from "../../model/otp/index.js";
import otpGenerator from "otp-generator";
import sendEmail from "../email/index.js";
import { Op } from "sequelize";
import reservation from "../../model/reservation/index.js";
import customerModel from "../../model/user/customer.js";
import timeSlotModel from "../../model/timeslots/index.js";
import { io } from "../../app.js";

const generateOtpCode = () => {
  return otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};
const generateAndSendOtp = async (email) => {
  try {
    console.log(email);
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const findCustomer = await customerModel.findOne({
      where: { email: email },
    });

    if (!findCustomer) {
      throw new Error({ message: `No customer with this email: ${email}` });
    }

    const checkOtp = await Otp.findOne({
      where: {
        customerId: findCustomer.id,
      },
    });
    if (checkOtp) {
      await checkOtp.destroy();
    }

    await Otp.create({
      customerId: findCustomer.id,
      otpCode,
      expiresAt,
    });
    await sendEmail(findCustomer.email, "Verify OTP", "otp.handlebars", {
      otpCode,
    });
    return null;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

const validateOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    console.log(req.body);
    const checkCustomer = await customerModel.findOne({
      where: { email: email },
    });
    console.log(checkCustomer);
    const otpRecord = await Otp.findOne({
      where: {
        customerId: checkCustomer.id,
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
        customerId: checkCustomer.id,
        status: "pending",
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: customerModel,
        },
        { model: timeSlotModel },
      ],
    });

    if (!reservationRecord) {
      return res
        .status(404)
        .json({
          message: "No pending reservation or reservation expired found",
        });
    }
    const startTimeUTC = moment
      .tz(
        `${reservationRecord.date} ${reservationRecord.TimeSlot.startTime}`,
        "YYYY-MM-DD HH:mm",
        "Asia/Karachi"
      )
      .utc()
      .toISOString();
    const expiresAt = moment.utc(startTimeUTC).add(30, "minutes").toDate();
    await reservationRecord.update({ status: "confirmed", expiresAt });

    const data = {
      fname: reservationRecord.Customer.firstName,
      lname: reservationRecord.Customer.lastName,
      date: reservationRecord.date,
      stime: reservationRecord.TimeSlot.startTime,
      etime: reservationRecord.TimeSlot.endTime,
      tableId: reservationRecord.tableId,
      seats: reservationRecord.seats,
    };
    await sendEmail(
      reservationRecord.Customer.email,
      "Reservation Confirmation",
      "confirmation.handlebars",
      data
    );
    await otpRecord.destroy();
    io.emit("reservationUpdated", reservationRecord);
    return res.status(200).json({
      message: "OTP validated and reservation confirmed",
      reservation: reservationRecord,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
export { generateAndSendOtp, validateOtp };
