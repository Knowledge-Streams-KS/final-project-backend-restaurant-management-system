import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import userModel from "../user/index.js";


const tokenModel = sequelize.define("Token", {
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
});

export default tokenModel;

userModel.hasOne(tokenModel);
tokenModel.belongsTo(userModel);

