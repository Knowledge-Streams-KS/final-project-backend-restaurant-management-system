import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
const userModel = sequelize.define("Users", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  allowAcess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default userModel;
