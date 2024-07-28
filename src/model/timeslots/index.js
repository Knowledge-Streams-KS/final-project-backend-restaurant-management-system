import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";

const timeSlotModel = sequelize.define("TimeSlot", {
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
});

export default timeSlotModel;
