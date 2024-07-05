import "dotenv/config";
import express from "express";
import { connectDB } from "./db/config.js";
import syncDB from "./db/init.js";

connectDB();
syncDB().then(() => {
  console.log("DB data synced");
});
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("server started at port:3000");
});
