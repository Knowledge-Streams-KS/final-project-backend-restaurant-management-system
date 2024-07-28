import { Op } from "sequelize";
import orderTable from "../../model/ordertable/index.js";
import reservation from "../../model/reservation/index.js";

const orderTableCURD = {
  getAll: async (req, res) => {
    try {
      const orderTables = await orderTable.findAll();
      res.status(200).json({ orderTables });
    } catch (error) {
      res.status(500).json({ message: "Internal server Error" });
    }
  },
  getSingle: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const checkOrderTable = await orderTable.findOne({
        where: { tableNo: id },
      });
      if (!checkOrderTable) {
        return res.status(404).json({ message: `No table with this id ${id}` });
      }
      res.status(200).json(checkOrderTable);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server Error" });
    }
  },
  create: async (req, res) => {
    try {
      const { tableNo, seats } = req.body;
      console.log(tableNo);
      const checktableNo = await orderTable.findOne({
        where: {
          tableNo: tableNo,
        },
      });
      if (checktableNo) {
        return res
          .status(409)
          .json({ message: `Table with this no ${tableNo} already exists` });
      }
      const newOrderTable = await orderTable.create({
        tableNo,
        seats,
      });
      res.status(201).json({
        message: `New order table created with no ${tableNo} and id ${newOrderTable.id} `,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(req.params.id);
      const { seats } = req.body;
      const checkOrderTable = await orderTable.findOne({
        where: { id: id },
      });
      console.log(checkOrderTable);
      if (!checkOrderTable) {
        return res
          .status(404)
          .json({ message: `No order table with this id ${id}` });
      }
      checkOrderTable.seats = seats;
      await checkOrderTable.save();
      res
        .status(200)
        .json({ message: `Seats of table id ${id} updated ${seats}` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("iddddd-------------", id, req.params.id);
      const checkOrderTable = await orderTable.findOne({
        where: { id: id },
      });
      if (!checkOrderTable) {
        return res.status(404).json({ message: `No table with this id ${id}` });
      }
      const checkReservation = await reservation.findAll({
        where: {
          tableId: id,
          status: {
            [Op.in]: ["pending", "checked-in", "confirmed"],
          },
        },
      });
      if (checkReservation.length > 0) {
        return res.status(409).json({ message: "Table is currently in use" });
      }
      checkOrderTable.destroy();
      res.status(200).json({ message: `Table with this id ${id} deleted` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error!" });
    }
  },
};
export default orderTableCURD;
