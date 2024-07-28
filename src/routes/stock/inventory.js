import { Router } from "express";
import inventoryPurchase from "../../controller/stock/inventory.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";
import inventoryValidator from "../../validators/inventory/index.js";

const inventoryRouter = Router();
inventoryRouter.get(
  "/inventory",
  authenticateToken,
  checkRole([roles.ADMIN]),
  inventoryPurchase.getAll
);
inventoryRouter.get(
  "/inventory/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  inventoryPurchase.getSingle
);
inventoryRouter.post(
  "/inventory",
  authenticateToken,
  checkRole([roles.ADMIN]),
  inventoryValidator.create,
  inventoryPurchase.create
);
inventoryRouter.put(
  "/inventory/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  inventoryValidator.update,
  inventoryPurchase.update
);
inventoryRouter.delete(
  "/inventory/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  inventoryPurchase.delete
);

export default inventoryRouter;
