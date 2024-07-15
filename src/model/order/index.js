import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import orderTable from "../ordertable/index.js";
import userModel from "../user/index.js";
import customerModel from "../user/customer.js";

const order = sequelize.define("Order", {
  tableId: {
    type: DataTypes.STRING,
    references: {
      model: orderTable,
      key: "id",
    },
    allowNull: false,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: userModel,
      key: "id",
    },
    allowNull: false,
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: customerModel,
      key: "id",
    },
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "processed", "served", "billed"),
    defaultValue: "pending",
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
userModel.hasMany(order, { foreignKey: "employeeId" });
order.belongsTo(userModel, { foreignKey: "employeeId" });
customerModel.hasMany(order, { foreignKey: "customerId" });
order.belongsTo(customerModel, { foreignKey: "customerId" });
order.belongsTo(orderTable, { foreignKey: "tableId" });
orderTable.hasMany(order, { foreignKey: "tableId" });
export default order;
