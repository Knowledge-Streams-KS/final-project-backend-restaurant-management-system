import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import customerModel from "../user/customer.js";
import orderTable from "../ordertable/index.js";

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
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});
reservation.belongsTo(customerModel, { foreignKey: "customerId" });
customerModel.hasMany(reservation, { foreignKey: "customerId" });
reservation.belongsTo(orderTable, { foreignKey: "tableId" });
orderTable.hasMany(reservation, { foreignKey: "tableId" });
export default reservation;
