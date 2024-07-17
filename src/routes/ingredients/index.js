import { Router } from "express";
import recipeCurd from "../../controller/ingredients/index.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";
import recipeValidator from "../../validators/recipe/index.js";
const recipeRouter = Router();
recipeRouter.get(
  "/recipes",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  recipeCurd.getAll
);
recipeRouter.get(
  "/recipe/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  recipeCurd.getSingle
);
recipeRouter.post(
  "/recipe",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  recipeValidator.create,
  recipeCurd.create
);
recipeRouter.put(
  "/recipe/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  recipeValidator.update,
  recipeCurd.update
);
recipeRouter.delete(
  "/recipe/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),
  recipeCurd.delete
);

export default recipeRouter;
