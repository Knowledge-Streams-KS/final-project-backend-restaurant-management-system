import moment from "moment-timezone";
import sequelize from "../../db/config.js";
import findAvailableTable from "../../middlewear/checkTable/index.js";
import reservation from "../../model/reservation/index.js";
import customerModel from "../../model/user/customer.js";
import { generateAndSendOtp } from "../../utils/otp/index.js";
import timeSlotModel from "../../model/timeslots/index.js";
import userModel from "../../model/user/index.js";
import { Op } from "sequelize";

const reservationCURD = {
  getAll: async (req, res) => {
    try {
      const allReservations = await reservation.findAll({
        include: [
          {
            model: customerModel,
          },
          {
            model: timeSlotModel,
          },
        ],
        order: [["date", "DESC"]],
      });
      res.status(200).json(allReservations);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  getSingle: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const singleReservation = await reservation.findOne({
        where: { customerId: id },
      });
      if (!singleReservation) {
        return res
          .status(404)
          .json({ message: `No reservation found for this id ${id}` });
      }
      res.status(200).json(singleReservation);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  create: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        fName,
        lName,
        email,
        phoneNo,
        date,
        TimeSlotId,
        seats,
        reservedBy,
      } = req.body;
      let customer = await customerModel.findOne({
        where: { email },
        transaction: t,
      });
      console.log(customer);
      if (!customer) {
        customer = await customerModel.create(
          {
            firstName: fName,
            lastName: lName,
            email,
            phoneNo,
          },
          { transaction: t }
        );
      }
      const existingReservation = await reservation.findOne({
        where: {
          customerId: customer.id,
          date,
          status: {
            [Op.or]: ["pending", "confirmed", "checked-in"],
          },
        },
        transaction: t,
      });

      if (existingReservation) {
        await t.rollback();
        return res.status(409).json({
          message: `Customer already has a ${existingReservation.status} reservation on this date!`,
        });
      }
      let timeSlot;
      if (reservedBy === "employee") {
        const currentHour = moment().tz("Asia/Karachi").hour();
        const slots = await timeSlotModel.findAll({
          where: {
            startTime: `${currentHour}:00:00`,
          },
          limit: 1,
          order: [["startTime", "ASC"]],
          transaction: t,
        });

        if (slots.length === 0) {
          await t.rollback();
          return res.status(409).json({
            message: "No available time slot found for the current time!",
          });
        }
        timeSlot = slots[0];
      } else {
        timeSlot = await timeSlotModel.findOne({
          where: { id: TimeSlotId },
          transaction: t,
        });

        if (!timeSlot) {
          await t.rollback();
          return res.status(409).json({ message: "Invalid time slot ID!" });
        }
        const startTimeUTC = moment
          .tz(
            `${date} ${timeSlot.startTime}`,
            "YYYY-MM-DD HH:mm",
            "Asia/Karachi"
          )
          .utc()
          .toISOString();
        if (moment.utc(startTimeUTC).isBefore(moment().utc())) {
          await t.rollback();
          return res.status(409).json({ message: "Time slot is in the past!" });
        }
      }
      const checkOrderTable = await findAvailableTable(timeSlot.id, date);
      if (!checkOrderTable) {
        await t.rollback();
        return res.status(409).json({
          message: `No table available for the time slot ${timeSlot.startTime}-${timeSlot.endTime}`,
        });
      }
      const newReservation = await reservation.create(
        {
          customerId: customer.id,
          tableId: checkOrderTable.id,
          date,
          TimeSlotId: timeSlot.id,
          reservedBy,
          seats,
          status: reservedBy === "employee" ? "checked-in" : "pending",
        },
        { transaction: t }
      );
      if (reservedBy === "customer") {
        const email = customer.email;

        generateAndSendOtp(email, t);
      }
      await t.commit();
      return res.status(201).json({
        message: "Reservation created successfully",
        newReservation,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { reservationId, userId } = req.body;
      const checkEmployee = await userModel.findByPk(userId);
      if (!checkEmployee) {
        return res
          .status(404)
          .json({ message: `No employee with this ${userId}` });
      }
      const checkReservation = await reservation.findByPk(reservationId, {
        where: {
          status: "confirmed",
        },
      });
      if (!checkReservation) {
        return res
          .status(404)
          .json({ message: `No reservation found with this ${reservationId}` });
      }
      const now = new Date();
      const reservationStartTime = new Date(checkReservation.startTime);
      const reservationEndTime = new Date(checkReservation.endTime);
      if (now >= reservationStartTime && now <= reservationEndTime) {
        checkReservation.status = "checked-in";
        await checkReservation.save();
        return res.json({
          message: "Reservation status updated to checked-in",
        });
      } else {
        return res.status(400).json({
          message: "Current time is not within the reservation time slot",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const singleReservation = await reservation.findOne({
        where: { id: id },
      });
      if (!singleReservation) {
        return res
          .status(404)
          .json({ message: `No reservation found for this id ${id}` });
      }
      if (
        singleReservation.status !== "pending" &&
        singleReservation.status !== "confirmed"
      ) {
        return res.status(409).json({
          message: `Reservation with id ${id} cannot be deleted. Only reservations with status "pending" or "confirmed" can be deleted.`,
        });
      }
      await singleReservation.destroy();
      res.status(200).json({ message: `Reservation deleted with ${id}` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  resendOtp: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email } = req.body;
      await generateAndSendOtp(email, t);
      res.status(200).json({ message: "OTP send again!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
};
export default reservationCURD;
