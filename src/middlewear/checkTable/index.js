import { Op } from "sequelize";
import reservation from "../../model/reservation/index.js";
import orderTable from "../../model/ordertable/index.js";

const findAvailableTable = async (TimeSlotId, date) => {
  try {
    const tables = await orderTable.findAll();

    for (const table of tables) {
      const conflictingReservation = await reservation.findOne({
        where: {
          tableId: table.id,
          date: date,
          status: {
            [Op.not]: "checked-out",
          },
          TimeSlotId: TimeSlotId,
        },
        order: [
          ["date", "ASC"],
          ["TimeSlotId", "ASC"],
        ],
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
