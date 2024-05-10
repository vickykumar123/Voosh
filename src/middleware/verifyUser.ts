import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {UserType} from "../types/modelTypes";
import {appError} from "../lib/appError";
import User from "../model/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      currUser: UserType;
    }
  }
}
// Creating JWT token and assigning it to cookie
export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return next(
        appError(401, "🙅🏻🙅🏻 You are not logged-in, Please login to access")
      );
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    const currentUser = await User.findById(decode);
    req.userId = currentUser?._id!;
    req.currUser = currentUser!;
    next();
  } catch (err) {
    next(err);
  }
}
