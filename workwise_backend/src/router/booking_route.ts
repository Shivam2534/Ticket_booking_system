import { Router } from "express";
import {
  bookingNewTicket,
  initialCoachMatrixHandler,
  bookDiscrateSeats,
} from "../controller/booking_controller";
import { middleware } from "../middleware/middleware";

const bookingRouter = Router();

bookingRouter.post("/booking", middleware, bookingNewTicket);
bookingRouter.post("/bookdiscreateseat", middleware, bookDiscrateSeats);
bookingRouter.get("/initialCoachMatrix", initialCoachMatrixHandler);

export { bookingRouter };
