import {NextFunction, Request, Response} from "express";
import User from "../model/user";
import {appError} from "../lib/appError";

// Providing who can access what.
export const restrictedTo =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId).select("+role");
      if (!user) return next(appError(400, "User already exists"));
      if (!roles.includes(user.role!)) {
        return next(appError(403, "You dont have required permission"));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
