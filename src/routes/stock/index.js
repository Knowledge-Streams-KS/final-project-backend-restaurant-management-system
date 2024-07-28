import { Router } from "express";
import allStock from "../../controller/stock/index.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";

const stockRouter = Router();
stockRouter.get(
  "/allstock",
  authenticateToken,
  checkRole([roles.ADMIN]),
  allStock.getAll
);

export default stockRouter;
