import { Router } from "express";
import orderCURD from "../../controller/order/index.js";

const orderAuth = Router();
orderAuth.get("/orders", orderCURD.getAll);
orderAuth.get("/order/:id", orderCURD.getSingle);
orderAuth.post("/order", orderCURD.create);
orderAuth.put("/order/served/:id", orderCURD.update);
orderAuth.put("/order/bill/:id", orderCURD.bill);
orderAuth.delete("/order/:id", orderCURD.delete);

export default orderAuth;
