import { Router } from "express";
import reservationCURD from "../../controller/reservation/index.js";
import { generateAndSendOtp, validateOtp } from "../../utils/otp/index.js";

const reservationRouter = Router();
reservationRouter.get("/reservations", reservationCURD.getAll);
reservationRouter.get("/reservation/:id", reservationCURD.getSingle);
reservationRouter.post("/reservation", reservationCURD.create);
reservationRouter.put("/reservation/:id", reservationCURD.update);
reservationRouter.delete("/reservation/:id", reservationCURD.delete);
reservationRouter.post("/reservation/verify", validateOtp);
reservationRouter.post("/reservation/otp", generateAndSendOtp);

export default reservationRouter;
