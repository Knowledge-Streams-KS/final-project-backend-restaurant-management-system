import sequelize from "../../db/config.js";
import findAvailableTable from "../../middlewear/checkTable/index.js";
import findTable from "../../middlewear/checkTable/index.js";
import reservation from "../../model/reservation/index.js";
import customerModel from "../../model/user/customer.js";

const reservationCURD = {
  getAll: async (req, res) => {
    try {
      const allReservations = await reservation.findAll();
      res.status(200).json(allReservations);
    } catch (error) {
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
    try {
      const { fName, lname, email, phoneNo, sTime, eTime } = req.body;
      const checkEmail = await customerModel.findOne({
        where: { email: email },
      });
      const checkOrderTable = await findAvailableTable(sTime, eTime);
      if (!checkOrderTable) {
        return res.status(409).json({
          message: `No table available for the time slot ${sTime}-${eTime}`,
        });
      }
      if (checkEmail) {
        const checkReservation = await reservation.findOne({
          where: {
            customerId: checkEmail.id,
            startTime: sTime,
            endTime: eTime,
          },
        });
        if (checkReservation) {
          return res.status(409).json({
            message: `Reservation already made of user ${email} with time slots ${sTime}-${eTime}`,
          });
        }
        const newReservation = await reservation.create({
          customerId: checkEmail.id,
          tableId: checkOrderTable.id,
          startTime: sTime,
          endTime: eTime,
        });
        return res.status(201).json({
          message: `Reservation Created Successfully!`,
          newReservation,
        });
      }
      const newUser = await customerModel.create({
        firstName: fName,
        lastName: lname,
        email: email,
        phoneNo: phoneNo,
      });
      const newReservation = await reservation.create({
        customerId: newUser.id,
        tableId: checkOrderTable.id,
        startTime: sTime,
        endTime: eTime,
      });
      return res.status(201).json({
        message: `Reservation successfully created!`,
        newReservation,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  update: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.paramas.id;
      const singleReservation = await reservation.findOne({
        where: { customerId: id },
      });
      if (!singleReservation) {
        return res
          .status(404)
          .json({ message: `No reservation found for this id ${id}` });
      }
      res.status(200).json({ message: `Reservation deleted with ${id}` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
};
export default reservationCURD;