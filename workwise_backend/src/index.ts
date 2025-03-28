import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./router/auth_route";
import { bookingRouter } from "./router/booking_route";

const app: Express = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  res.send("Server is live & we are testing our Cd pipelin making this changes.");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/seat", bookingRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
