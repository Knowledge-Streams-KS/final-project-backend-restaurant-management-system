import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
const customerModel = sequelize.define("Customers", {
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
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default customerModel;
