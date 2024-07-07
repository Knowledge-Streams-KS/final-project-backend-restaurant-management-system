import authRouter from "./auth/index.js";
import recipeRouter from "./ingredients/index.js";
import ingredientCodeRouter from "./ingredients/ingredientsCode.js";
import inventoryRouter from "./stock/inventory.js";

const allRouters = [
  authRouter,
  ingredientCodeRouter,
  inventoryRouter,
  recipeRouter,
];

export default allRouters;
