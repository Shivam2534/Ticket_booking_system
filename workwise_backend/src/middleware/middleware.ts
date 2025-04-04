import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  console.log("request is at the middleware");

  const token = req.headers["authorization"]?.replace("Bearer ", "");
  console.log("token-",token)
  if (!token || token.length === 0) {
    res.status(402).json({
      message: "Unothorised access",
      success: false,
    });

    return;
  }

  const secrete = process.env.JWT_SECRETE;

  if (!secrete) {
    res.status(403).json({
      message: "Wrong credentials",
      success: false,
    });
  } else {
    try {
      const decodedToken = jwt.verify(token, secrete);
      if (decodedToken) {
        // @ts-ignore
        req.userId = decodedToken.userId;
        next();
      } else {
        res.status(403).json({
          message: "Unauthorized",
        });
      }
    } catch (error) {
      console.log("error while validating user token", error);
    }
  }
}
