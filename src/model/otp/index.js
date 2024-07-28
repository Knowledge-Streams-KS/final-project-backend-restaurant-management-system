import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import customerModel from "../user/customer.js";

const Otp = sequelize.define("Otp", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: customerModel,
      key: "id",
    },
  },
  otpCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

Otp.belongsTo(customerModel, { foreignKey: "customerId" });
customerModel.hasMany(Otp, { foreignKey: "customerId" });

export default Otp;
