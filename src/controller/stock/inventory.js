import ingredientsCode from "../../model/ingredients/ingredientsCode.js";
import stock from "../../model/stock/index.js";
import inventory from "../../model/stock/inventory.js";

const inventoryPurchase = {
  getAll: async (req, res) => {
    try {
      const allInventory = await inventory.findAll();
      res.status(200).json({ allInventory });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  getSingle: async (req, res) => {
    try {
      const code = req.params.id;
      const singleInventory = await inventory.findAll({
        where: { ingredientsId: code },
      });
      const singleStock = await stock.findOne({
        where: {
          ingredientCode: code,
        },
      });
      res.status(200).json({ singleStock, singleInventory });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  create: async (req, res) => {
    try {
      const { ingredientsId, quantity, unitPrice, date } = req.body;
      const checkIngredientId = await ingredientsCode.findOne({
        where: {
          code: ingredientsId,
        },
      });
      if (!checkIngredientId) {
        return res
          .status(400)
          .json({ message: "ingredient id does not exists!" });
      }
      const newIngredientsId = await inventory.create({
        ingredientsId: ingredientsId,
        quantity: quantity,
        unitPrice: unitPrice,
        date: date,
      });
      const newStock = await stock.findOne({
        where: { ingredientCode: ingredientsId },
      });
      if (newStock) {
        newStock.totalQuantity += quantity;
        await newStock.save();
        return res
          .status(201)
          .json({ message: "Inventory Added", newIngredientsId });
      }
      await stock.create({
        ingredientCode: ingredientsId,
        totalQuantity: quantity,
      });
      res.status(201).json({ message: "Inventory Added", newIngredientsId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  delete: async (req, res) => {
    try {
      const code = req.params.id;
      const checkInventory = await inventory.findByPk(code);

      const updateStock = await stock.findOne({
        where: {
          ingredientCode: checkInventory.ingredientsId,
        },
      });
      updateStock.totalQuantity -= checkInventory.quantity;
      await checkInventory.destroy();
      await updateStock.save();
      res.status(200).json({ message: "Inventory Deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  update: async (req, res) => {
    try {
      const payload = req.body;
      const id = parseInt(req.params.id);
      const checkInventoryId = await inventory.findByPk(id);
      console.log(checkInventoryId);
      if (!checkInventoryId) {
        return res.status(400).json({ message: "No inventory with this ID" });
      }
      if (payload.ingredientsId) {
        const checkIngredientId = await ingredientsCode.findOne({
          where: {
            code: payload.ingredientsId,
          },
        });
        if (!checkIngredientId) {
          return res
            .status(400)
            .json({ message: "ingredient id does not exists!" });
        }
      }
      if (payload.quantity) {
        const checkQuantity = payload.quantity - checkInventoryId.quantity;
        console.log(checkQuantity, payload.quantity, checkInventoryId.quantity);
        const updateStock = await stock.findOne({
          where: {
            ingredientCode: checkInventoryId.ingredientsId,
          },
        });
        updateStock.totalQuantity += checkQuantity;
        console.log(updateStock.totalQuantity, checkQuantity);
        await updateStock.save();
      }
      checkInventoryId.ingredientsId = payload.ingredientsId
        ? payload.ingredientsId
        : checkInventoryId.ingredientsId;
      checkInventoryId.quantity = payload.quantity
        ? payload.quantity
        : checkInventoryId.quantity;
      checkInventoryId.unitPrice = payload.unitPrice
        ? payload.unitPrice
        : checkInventoryId.unitPrice;
      checkInventoryId.date = payload.date
        ? payload.date
        : checkInventoryId.date;

      await checkInventoryId.save();
      res.status(200).json({ message: "Inventory Updated", checkInventoryId });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
};
export default inventoryPurchase;
