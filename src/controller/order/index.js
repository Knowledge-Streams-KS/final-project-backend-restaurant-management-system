import orderTable from "../../model/ordertable/index.js";

const orderCURD = {
  getAll: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  getSingle: async (req, res) => {
    try {
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  create: async (req, res) => {
    try {
      const { tableId, userId, recipeId, quantity, price } = req.payload;
      const checkOrderTable = await orderTable.findByPk(tableId);
      if (checkOrderTable === "reserved") {
      }
    } catch (error) {
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
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
};

export default orderCURD;
