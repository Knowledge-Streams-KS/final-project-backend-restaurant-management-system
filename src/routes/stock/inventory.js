import { Router } from "express";
import inventoryPurchase from "../../controller/stock/inventory.js";

const inventoryRouter = Router();
inventoryRouter.get("/inventory", inventoryPurchase.getAll);
inventoryRouter.get("/inventory/:id", inventoryPurchase.getSingle);
inventoryRouter.post("/inventory", inventoryPurchase.create);
inventoryRouter.put("/inventory/:id", inventoryPurchase.update);
inventoryRouter.delete("/inventory/:id", inventoryPurchase.delete);

export default inventoryRouter;
