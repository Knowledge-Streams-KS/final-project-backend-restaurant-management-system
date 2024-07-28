import stock from "../../model/stock/index.js";

const allStock = {
  getAll: async (req, res) => {
    try {
      const allInventory = await stock.findAll();
      allInventory.sort((a, b) => a.id - b.id);
      res.status(200).json({ allInventory });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
};
export default allStock;
