import { Router } from "express";
import orderCURD from "../../controller/order/index.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";
import orderValidator from "../../validators/order/index.js";

const orderAuth = Router();
orderAuth.get(
  "/orders",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER, roles.CHEF]),
  orderCURD.getAll
);
orderAuth.get(
  "/order/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER, roles.CHEF]),
  orderCURD.getSingle
);
orderAuth.post(
  "/order",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderValidator.create,
  orderCURD.create
);
orderAuth.put(
  "/order/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderValidator.update,
  orderCURD.add
);
orderAuth.put(
  "/order/prepared/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.CHEF]),

  orderCURD.prepares
);
orderAuth.patch(
  "/order/served/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderCURD.update
);
orderAuth.put(
  "/order/bill/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  orderCURD.bill
);
orderAuth.delete(
  "/order/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  orderCURD.delete
);

export default orderAuth;
