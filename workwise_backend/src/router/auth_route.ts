import { Router } from "express";
import { signup, signin } from "../controller/auth_controller";

const authRouter = Router();

//@ts-ignore
authRouter.post("/signup", signup);
//@ts-ignore
authRouter.post("/signin", signin);

export { authRouter };
