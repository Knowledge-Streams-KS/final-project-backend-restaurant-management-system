import { Router } from "express";
import recipeCurd from "../../controller/ingredients/index.js";
const recipeRouter = Router();
recipeRouter.get("/recipes", recipeCurd.getAll);
recipeRouter.get("/recipe/:id", recipeCurd.getSingle);
recipeRouter.post("/recipe", recipeCurd.create);
recipeRouter.put("/recipe/:id", recipeCurd.update);
recipeRouter.delete("/recipe/:id", recipeCurd.delete);

export default recipeRouter;
