import { Router } from "express";
import orderTableCURD from "../../controller/orderTable/index.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";

const orderTableAuth = Router();
orderTableAuth.get(
  "/ordertables",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderTableCURD.getAll
);
orderTableAuth.get(
  "/ordertable/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderTableCURD.getSingle
);
orderTableAuth.post(
  "/ordertable",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderTableCURD.create
);
orderTableAuth.put(
  "/ordertable/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderTableCURD.update
);
orderTableAuth.delete(
  "/ordertable/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  orderTableCURD.delete
);

export default orderTableAuth;
