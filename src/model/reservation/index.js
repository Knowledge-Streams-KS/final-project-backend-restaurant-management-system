import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import customerModel from "../user/customer.js";
import orderTable from "../ordertable/index.js";
import timeSlotModel from "../timeslots/index.js";

const reservation = sequelize.define("Reservation", {
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: customerModel,
      key: "id",
    },
    allowNull: false,
  },
  tableId: {
    type: DataTypes.STRING,
    references: {
      model: orderTable,
      key: "id",
    },
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  reservedBy: {
    type: DataTypes.ENUM("customer", "employee"),
    defaultValue: "customer",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  seats: { type: DataTypes.INTEGER, allowNull: false },
});
reservation.belongsTo(customerModel, { foreignKey: "customerId" });
customerModel.hasMany(reservation, { foreignKey: "customerId" });
reservation.belongsTo(orderTable, { foreignKey: "tableId" });
orderTable.hasMany(reservation, { foreignKey: "tableId" });
reservation.belongsTo(timeSlotModel);
timeSlotModel.hasMany(reservation);
export default reservation;
