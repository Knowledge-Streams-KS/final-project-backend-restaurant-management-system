import { Router } from "express";
import ingredientsName from "../../controller/ingredients/ingredientsCode.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";
import ingredientsCodeValidator from "../../validators/ingredientsCode/index.js";

const ingredientCodeRouter = Router();
ingredientCodeRouter.get(
  "/ingredients/code",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  ingredientsName.getAll
);
ingredientCodeRouter.post(
  "/ingredients/code",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  ingredientsCodeValidator.create,
  ingredientsName.create
);
ingredientCodeRouter.delete(
  "/ingredients/code/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  ingredientsName.delete
);

export default ingredientCodeRouter;
