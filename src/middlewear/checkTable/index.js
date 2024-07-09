import { Op } from "sequelize";
import reservation from "../../model/reservation/index.js";
import orderTable from "../../model/ordertable/index.js";


const findAvailableTable = async (startTime, endTime) => {
  try {
    const tables = await orderTable.findAll();
    for (const table of tables) {
      const conflictingReservation = await reservation.findOne({
        where: {
          tableId: table.id,
          [Op.or]: [
            {
              startTime: { [Op.lt]: endTime },
              endTime: { [Op.gt]: startTime },
            },
            {
              startTime: { [Op.gte]: startTime, [Op.lt]: endTime },
            },
            {
              endTime: { [Op.gt]: startTime, [Op.lte]: endTime },
            },
          ],
        },
      });

      if (!conflictingReservation) {
        return table;
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding available table:", error);
    throw new Error("Failed to find available table");
  }
};

export default findAvailableTable;


