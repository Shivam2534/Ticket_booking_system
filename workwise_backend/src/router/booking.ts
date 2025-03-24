import { Router } from "express";
import { booking, initialCoachMatrixHandler } from "../controller/booking";
import { middleware } from "../middleware/middleware";

const bookingRouter = Router();

bookingRouter.post("/booking", middleware, booking);
bookingRouter.get("/initialCoachMatrix", initialCoachMatrixHandler);

export { bookingRouter };
