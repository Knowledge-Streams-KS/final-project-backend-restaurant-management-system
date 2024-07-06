import { Router } from "express";
import ingredientsName from "../../controller/ingredients/ingredientsCode.js";

const ingredientCodeRouter = Router();
ingredientCodeRouter.get("/ingredients/code", ingredientsName.getAll);
ingredientCodeRouter.post("/ingredients/code", ingredientsName.create);
ingredientCodeRouter.delete("/ingredients/code/:id", ingredientsName.delete);

export default ingredientCodeRouter;
