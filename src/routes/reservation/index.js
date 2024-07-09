import { Router } from "express";
import reservationCURD from "../../controller/reservation/index.js";

const reservationRouter = Router();
reservationRouter.get("/reservations", reservationCURD.getAll);
reservationRouter.get("/reservation/:id", reservationCURD.getSingle);
reservationRouter.post("/reservation", reservationCURD.create);
reservationRouter.put("/reservation/:id", reservationCURD.update);
reservationRouter.delete("/reservation/:id", reservationCURD.delete);

export default reservationRouter;
