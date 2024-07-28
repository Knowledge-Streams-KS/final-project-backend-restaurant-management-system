import { Server } from "socket.io";
import Order from "../../model/order/index.js";
import Reservation from "../../model/reservation/index.js";

let io;

export const initSocket = (server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected with socket ID:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected with socket ID:", socket.id);
    });

    // Emit order status update to all connected clients
    socket.on("updateOrderStatus", async (id, newStatus) => {
      try {
        const [updated] = await Order.update(
          { status: newStatus },
          { where: { id }, returning: true }
        );

        if (updated) {
          const updatedOrder = await Order.findByPk(id);
          console.log("Order status updated:", updatedOrder);
          io.emit("orderStatusUpdated", updatedOrder); // Emit to all clients
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    });

    // Emit reservation status update to all connected clients
    socket.on("updateReservationStatus", async (id, newStatus) => {
      try {
        const [updated] = await Reservation.update(
          { status: newStatus },
          { where: { id }, returning: true }
        );

        if (updated) {
          const updatedReservation = await Reservation.findByPk(id);
          console.log("Reservation status updated:", updatedReservation);
          io.emit("reservationStatusUpdated", updatedReservation); // Emit to all clients
        } else {
          console.log("Reservation not found");
        }
      } catch (error) {
        console.error("Error updating reservation status:", error);
      }
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
