import { Router } from "express";
import orderTableCURD from "../../controller/orderTable/index.js";

const orderTableAuth = Router();
orderTableAuth.get("/ordertables", orderTableCURD.getAll);
orderTableAuth.get("/ordertable/:id", orderTableCURD.getSingle);
orderTableAuth.post("/ordertable", orderTableCURD.create);
orderTableAuth.put("/ordertable/:id", orderTableCURD.update);
orderTableAuth.delete("/ordertable/:id", orderTableCURD.delete);

export default orderTableAuth;
