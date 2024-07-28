import "dotenv/config";
import express from "express";
import { connectDB } from "./db/config.js";
import syncDB from "./db/init.js";
import allRouters from "./routes/index.js";
import scheduleTokenCleanup from "./utils/cornjob/index.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
connectDB();
syncDB().then(() => {
  console.log("DB data synced");
});
const corsOptions = {
  origin: "http://localhost:5173",
};
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});
app.use(express.json());
app.use(cors(corsOptions));
scheduleTokenCleanup();
app.use(express.json());
app.use(allRouters);
io.on("connection", (socket) => {
  console.log("-------------A user connected=========");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
server.listen(3000, () => {
  console.log("server started at port:3000");
});
export { io };
