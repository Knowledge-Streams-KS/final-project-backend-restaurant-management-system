import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";

const orderTable = sequelize.define(
  "Order Tables",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tableNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    seats: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
  },
  {
    hooks: {
      beforeCreate: async (table) => {
        const lastTable = await orderTable.findOne({
          order: [["createdAt", "DESC"]],
        });

        const lastIdNumber = lastTable
          ? parseInt(lastTable.id.split("-")[1])
          : 0;
        table.id = `TB-${(lastIdNumber + 1).toString().padStart(4, "0")}`;
      },
    },
  }
);

export default orderTable;
