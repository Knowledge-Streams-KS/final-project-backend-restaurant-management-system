import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";

const recipe = sequelize.define("Recipe", {
  recipeId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.ENUM("small", "medium", "large"),
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default recipe;
