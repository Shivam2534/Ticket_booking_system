import { Router } from "express";
import {
  bookingNewTicket,
  initialCoachMatrixHandler,
} from "../controller/Booking";
import { middleware } from "../middleware/middleware";

const bookingRouter = Router();

bookingRouter.post("/booking", middleware, bookingNewTicket);
bookingRouter.get("/initialCoachMatrix", initialCoachMatrixHandler);

export { bookingRouter };
