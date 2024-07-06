import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";

const ingredientsCode = sequelize.define("Ingredients Code", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default ingredientsCode;
