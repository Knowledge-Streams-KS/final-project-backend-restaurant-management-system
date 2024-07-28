import { Router } from "express";
import reservationCURD from "../../controller/reservation/index.js";
import { validateOtp } from "../../utils/otp/index.js";
import authenticateToken from "../../middlewear/token/index.js";
import checkRole from "../../middlewear/checkRole/index.js";
import { roles } from "../../roles/index.js";
import reservationValidator from "../../validators/reservations/index.js";

const reservationRouter = Router();
reservationRouter.get(
  "/reservations",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  reservationCURD.getAll
);
reservationRouter.get(
  "/reservation/:id",
  authenticateToken,
  checkRole([roles.ADMIN, roles.WAITER]),
  reservationCURD.getSingle
);
reservationRouter.post(
  "/reservation",
  reservationValidator.create,
  reservationCURD.create
);
reservationRouter.delete(
  "/reservation/:id",
  authenticateToken,
  checkRole([roles.ADMIN]),
  reservationCURD.delete
);
reservationRouter.post("/reservation/verify", validateOtp);
reservationRouter.post("/reservation/otp", reservationCURD.resendOtp);

export default reservationRouter;
