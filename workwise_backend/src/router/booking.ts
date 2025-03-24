import { Router } from "express";
import { booking } from "../controller/booking";
import { middleware } from "../middleware/middleware";

const bookingRouter = Router();

bookingRouter.post("/booking", middleware, booking);

export { bookingRouter };
