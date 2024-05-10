import {NextFunction, Request, Response} from "express";
import {appError} from "../lib/appError";
import User from "../model/user";

// Getting both public and private user.
export async function getAllUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.currUser.role !== "admin") {
      return next(appError(401, "You are not allowed"));
    }

    const allUser = await User.find();
    res.status(200).json({
      status: "success",
      allUser,
    });
  } catch (error) {
    next(error);
  }
}

// Updating the role, Only admin can update the role.
export async function updateRole(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.currUser.role !== "admin") {
      return next(appError(401, "You are not allowed"));
    }
    const {email, role} = req.body;
    if (!email || !role) {
      return next(appError(400, "Email and Role is requried"));
    }
    const user = await User.findOne({email});
    if (!user) return;
    user.role = role;
    await user.save();
    res.status(201).json({
      status: "success",
      message: "Updated user role",
      user,
    });
  } catch (error) {
    next(error);
  }
}
