import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import ingredientsCode from "../ingredients/ingredientsCode.js";

const stock = sequelize.define("Total Stock", {
  ingredientCode: {
    type: DataTypes.STRING,
    references: {
      model: ingredientsCode,
      key: "code",
    },
    allowNull: false,
    unique: true,
  },
  totalQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
ingredientsCode.hasOne(stock, {
  foreignKey: "ingredientCode",
  sourceKey: "code",
});
stock.belongsTo(ingredientsCode, {
  foreignKey: "ingredientCode",
  targetKey: "code",
});

export default stock;
