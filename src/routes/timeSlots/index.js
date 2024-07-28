import { Router } from "express";
import timeSlots from "../../controller/timeslots/index.js";

const timeSlotsRouter = Router();
timeSlotsRouter.get("/timeslots", timeSlots.getAll);

timeSlotsRouter.post("/timeslots", timeSlots.create);

export default timeSlotsRouter;
