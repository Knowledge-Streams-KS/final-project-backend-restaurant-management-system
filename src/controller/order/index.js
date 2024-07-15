import { Op } from "sequelize";
import sequelize from "../../db/config.js";
import findAvailableTable from "../../middlewear/checkTable/index.js";
import recipeIngredients from "../../model/ingredients/index.js";
import order from "../../model/order/index.js";
import orderItem from "../../model/order/orderItem.js";
import recipe from "../../model/Recipe/index.js";
import reservation from "../../model/reservation/index.js";
import stock from "../../model/stock/index.js";
import userModel from "../../model/user/index.js";
import customerModel from "../../model/user/customer.js";

const orderCURD = {
  getAll: async (req, res) => {
    try {
      const allOrders = await order.findAll({
        include: [
          {
            model: userModel,
          },
          {
            model: customerModel,
          },
        ],
      });
      res.status(200).json(allOrders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  getSingle: async (req, res) => {
    try {
      const id = req.params.id;
      const singleOrder = await order.findByPk(id);
      if (!singleOrder) {
        return res.status(404).json({ message: `No Order with this ${id}` });
      }
      res.status(200).json(singleOrder);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  create: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { userId, customerId, orderItems } = req.body;
      if (!userId || !orderItems || orderItems.length === 0) {
        return res.status(400).json({
          message: "Invalid request. Please provide userId and orderItems.",
        });
      }
      const checkUserId = await userModel.findByPk(userId);
      if (!checkUserId) {
        return res
          .status(409)
          .json({ message: `No Employee with the user id ${userId}` });
      }
      const checkCustomerId = await customerModel.findByPk(customerId);
      if (!checkCustomerId) {
        return res.status(409).json({
          message: `No customer registered with this id ${customerId}`,
        });
      }
      const checkActiveOrder = await order.findOne({
        where: { customerId: customerId, status: { [Op.ne]: "billed" } },
      });
      if (checkActiveOrder) {
        return res.status(409).json({
          message: `Customer ${customerId} already have an active order`,
        });
      }
      const checkReservation = await reservation.findOne({
        where: {
          customerId: customerId,
          status: "checked-in",
        },
        order: [["createdAt", "DESC"]],
        transaction: t,
      });
      if (!checkReservation) {
        await t.rollback();
        return res
          .status(409)
          .json({ message: `No reservation found for the ${checkCustomerId}` });
      }
      let totalAmount = 0;
      const newOrder = await order.create(
        {
          employeeId: userId,
          customerId: customerId || null,
          tableId: tableId,
          status: "pending",
          totalAmount: totalAmount,
        },
        { transaction: t }
      );

      for (const item of orderItems) {
        const checkRecipe = await recipe.findOne({
          where: { recipeId: item.recipeId },
          transaction: t,
        });

        if (!checkRecipe) {
          await t.rollback();
          return res.status(400).json({
            message: `Recipe with ID ${item.recipeId} does not exist`,
          });
        }
        const itemTotalPrice = checkRecipe.price * item.quantity;
        totalAmount += itemTotalPrice;
        const ingredients = await recipeIngredients.findAll({
          where: { recipeId: item.recipeId },
          transaction: t,
        });

        for (const ingredient of ingredients) {
          const checkStock = await stock.findOne({
            where: { ingredientCode: ingredient.ingredCode },
            transaction: t,
          });
          if (!checkStock) {
            return res.status(409).json({
              message: `Ingredient  ${ingredient.ingredCode} of recipe ${item.recipeId} are not available in stock`,
            });
          }
          if (
            !checkStock.totalQuantity ||
            checkStock.totalQuantity < ingredient.quantity * item.quantity
          ) {
            await t.rollback();
            return res.status(400).json({
              message: `Insufficient stock for ingredient ${ingredient.ingredCode} in recipe ID ${item.recipeId}`,
            });
          }
          const newQuantity =
            checkStock.totalQuantity - ingredient.quantity * item.quantity;
          await checkStock.update(
            {
              totalQuantity: newQuantity,
            },
            { transaction: t }
          );
        }
        await orderItem.create(
          {
            orderId: newOrder.id,
            recipeId: item.recipeId,
            quantity: item.quantity,
            price: checkRecipe.price,
          },
          { transaction: t }
        );
      }
      await newOrder.update({ totalAmount: totalAmount }, { transaction: t });
      await t.commit();
      return res.status(201).json({
        message: `Order created successfully!`,
        newOrder,
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const checkOrder = await order.findByPk(id, {
        where: { status: "pending" },
      });
      if (!checkOrder) {
        return res.status(404).json({ message: `No order with this id ${id}` });
      }
      if (!checkOrder.status === "pending") {
        return res
          .status(401)
          .json({ message: `Order with ${id} status is ${checkOrder.status}` });
      }
      await checkOrder.update({
        status: "served",
      });
      res.status(200).json({ message: `Order with id ${id} is served ` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  bill: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.params.id;
      const checkOrder = await order.findByPk(id);
      if (!checkOrder) {
        return res.status(404).json({ message: `No order with this id ${id}` });
      }
      if (checkOrder.status !== "served") {
        return res
          .status(409)
          .json({ message: `Order with ${id} status is ${checkOrder.status}` });
      }
      await checkOrder.update(
        {
          status: "billed",
        },
        { transaction: t }
      );
      const checkReservation = await reservation.findOne({
        where: {
          tableId: checkOrder.tableId,
          status: "checked-in",
        },
        transaction: t,
      });
      if (checkReservation) {
        await checkReservation.update(
          { status: "checked-out" },
          { transaction: t }
        );
      }
      await t.commit();
      res.status(200).json({ message: `Order Completed`, checkOrder });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const singleOrder = await order.findByPk(id);
      if (!singleOrder) {
        return res.status(404).json({ message: `No order with this ${id}` });
      }
      await singleOrder.destroy();
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!!" });
    }
  },
};

export default orderCURD;
