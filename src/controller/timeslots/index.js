import moment from "moment-timezone";
import timeSlotModel from "../../model/timeslots/index.js";

const timeSlots = {
  getAll: async (req, res) => {
    try {
      const slots = await timeSlotModel.findAll();
      res.status(200).json(slots);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },

  create: async (req, res) => {
    try {
      const existingSlots = await timeSlotModel.findAll();
      if (existingSlots.length === 0) {
        const slots = [];
        const startTime = moment.tz("12:00 PM", "h:mm A", "Asia/Karachi");
        const endTime = moment
          .tz("1:00 AM", "h:mm A", "Asia/Karachi")
          .add(1, "day");

        while (startTime.isBefore(endTime)) {
          const end = startTime.clone().add(1, "hour");
          slots.push({
            startTime: startTime.format("HH:mm:ss"),
            endTime: end.format("HH:mm:ss"),
          });
          startTime.add(1, "hour");
        }

        await timeSlotModel.bulkCreate(slots);
        res.status(201).json({ message: "Time slots created successfully!" });
      } else {
        res.status(409).json({ message: "Time slots already exist!" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
};

export default timeSlots;
