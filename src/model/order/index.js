import { DataTypes, or } from "sequelize";
import sequelize from "../../db/config.js";
import orderTable from "../ordertable/index.js";
import userModel from "../user/index.js";

const order = sequelize.define("Order", {
  tableId: {
    type: DataTypes.STRING,
    references: {
      model: orderTable,
      key: "id",
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: userModel,
      key: "id",
    },
    allowNull: false,
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
userModel.hasMany(order, { foreignKey: "userId" });
order.belongsTo(userModel, { foreignKey: "userId" });
order.belongsTo(orderTable, { foreignKey: "tableId" });
orderTable.hasMany(order, { foreignKey: "tableId" });
export default order;
