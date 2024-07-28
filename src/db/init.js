import recipeIngredients from "../model/ingredients/index.js";
import ingredientsCode from "../model/ingredients/ingredientsCode.js";
import order from "../model/order/index.js";
import orderItem from "../model/order/orderItem.js";
import orderTable from "../model/ordertable/index.js";
import Otp from "../model/otp/index.js";
import recipe from "../model/Recipe/index.js";
import reservation from "../model/reservation/index.js";
import stock from "../model/stock/index.js";
import inventory from "../model/stock/inventory.js";
import timeSlotModel from "../model/timeslots/index.js";
import tokenModel from "../model/token/index.js";
import customerModel from "../model/user/customer.js";
import userModel from "../model/user/index.js";
import sequelize from "./config.js";

const syncDB = async () => {
  // await sequelize.sync({ alter: true, force: true });
  await userModel.sync({ alter: true, force: false });
  await tokenModel.sync({ alter: true, force: false });
  await ingredientsCode.sync({ alter: true, force: false });
  await inventory.sync({ alter: true, force: false });
  await stock.sync({ alter: true, force: false });
  await recipe.sync({ alter: true, force: false });
  await recipeIngredients.sync({ alter: true, force: false });
  await orderTable.sync({ alter: true, force: false });
  await order.sync({ alter: true, force: false });
  await orderItem.sync({ alter: true, force: false });
  await customerModel.sync({ alter: true, force: false });
  await Otp.sync({ alter: true, force: false });
  await timeSlotModel.sync({ alter: true, force: false });
  await reservation.sync({ alter: true, force: false });
};

export default syncDB;
