import Otp from "../../model/otp/index.js";
import otpGenerator from "otp-generator";
import sendEmail from "../email/index.js";
import { Op } from "sequelize";
import reservation from "../../model/reservation/index.js";
import customerModel from "../../model/user/customer.js";
import timeSlotModel from "../../model/timeslots/index.js";

const generateOtpCode = () => {
  return otpGenerator.generate(5, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};
const generateAndSendOtp = async (customerId) => {
  try {
    console.log("customerid", customerId);

    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const findCustomer = await customerModel.findByPk(customerId);
    if (!findCustomer) {
      throw new Error({ message: `No customer with this id: ${customerId}` });
    }

    // Destroy any existing OTP record for the customer
    const checkOtp = await Otp.findOne({
      where: {
        customerId: customerId,
      },
    });
    if (checkOtp) {
      await checkOtp.destroy();
    }

    // Create new OTP record
    await Otp.create({
      customerId,
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
    const { customerId, otpCode } = req.body;
    console.log(req.body);
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
      include: [
        {
          model: customerModel,
        },
        { model: timeSlotModel },
      ],
    });

    if (!reservationRecord) {
      return res.status(404).json({ message: "No pending reservation found" });
    }
    await reservationRecord.update({ status: "confirmed" });

    const data = {
      fname: reservationRecord.Customer.firstName,
      lname: reservationRecord.Customer.lastName,
      date: reservationRecord.date,
      stime: reservationRecord.TimeSlot.startTime,
      etime: reservationRecord.TimeSlot.endTime,
      tableId: reservationRecord.tableId,
    };
    await sendEmail(
      reservationRecord.Customer.email,
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
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
export { generateAndSendOtp, validateOtp };
