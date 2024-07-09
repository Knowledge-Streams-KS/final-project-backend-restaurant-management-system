import authRouter from "./auth/index.js";
import recipeRouter from "./ingredients/index.js";
import ingredientCodeRouter from "./ingredients/ingredientsCode.js";
import orderTableAuth from "./orderTable/index.js";
import reservationRouter from "./reservation/index.js";
import inventoryRouter from "./stock/inventory.js";

const allRouters = [
  authRouter,
  ingredientCodeRouter,
  inventoryRouter,
  recipeRouter,
  orderTableAuth,
  reservationRouter,
];

export default allRouters;
