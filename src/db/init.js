import tokenModel from "../model/token/index.js";
import userModel from "../model/user/index.js";
import sequelize from "./config.js";

const syncDB = async () => {
  //   await sequelize.sync({ alter: true, force: true });
  await userModel.sync({ alter: true, force: false });
  await tokenModel.sync({ alter: true, force: false });
};

export default syncDB;
