import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import ingredientsCode from "../ingredients/ingredientsCode.js";

const inventory = sequelize.define("Inventory", {
  ingredientsId: {
    type: DataTypes.STRING,
    references: {
      model: ingredientsCode,
      key: "code",
    },
    allowNull: false,
  },
  quantity: { type: DataTypes.FLOAT, allowNull: false },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});
ingredientsCode.hasMany(inventory, {
  foreignKey: "ingredientsId",
  sourceKey: "code",
});
inventory.belongsTo(ingredientsCode, {
  foreignKey: "ingredientsId",
  targetKey: "code",
});

export default inventory;
