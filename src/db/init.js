import recipeIngredients from "../model/ingredients/index.js";

import ingredientsCode from "../model/ingredients/ingredientsCode.js";
import recipe from "../model/Recipe/index.js";
import stock from "../model/stock/index.js";
import inventory from "../model/stock/inventory.js";
import tokenModel from "../model/token/index.js";
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
};

export default syncDB;
