import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import order from "./index.js";
import recipe from "../Recipe/index.js";

const orderItem = sequelize.define("Order Item", {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
});
orderItem.belongsTo(order, { foreignKey: "orderId" });
order.hasMany(orderItem, { foreignKey: "orderId" });
orderItem.belongsTo(recipe, { foreignKey: "recipeId" });
recipe.hasMany(orderItem, { foreignKey: "recipeId" });

export default orderItem;
