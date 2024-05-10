import {NextFunction, Request, Response} from "express";
import bcrypt from "bcryptjs";
import {UserType} from "../types/modelTypes";
import {appError} from "../lib/appError";
import User from "../model/user";
import {session} from "../lib/session";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {email, password, name, bio, phone, profile, photo} =
      req.body as UserType;
    if (!email || !password || !name || !bio || !phone || !profile || !photo) {
      return next(appError(400, "Invalid inputs"));
    }
    const isUserExisting = await User.findOne({email});
    if (isUserExisting) {
      return next(appError(400, "User already exists"));
    }

    const newUser = await User.create({
      email,
      password,
      name,
      bio,
      phone,
      profile,
      photo,
    });
    newUser.password = undefined;
    const token = session(res, newUser._id);
    res.status(200).json({
      status: "success",
      user: newUser,
      token,
    });
  } catch (err) {
    next(err);
  }
}

// Login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return next(appError(400, "Email and Password are required"));
    }

    const user = await User.findOne({email}).select("+password");
    if (!user) {
      return next(appError(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return next(appError(400, "Incorrect Password or Email"));
    }
    user.password = undefined;

    const token = session(res, user._id);
    res.status(302).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
}

// Logout
export function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    res.status(200).json({
      status: "success",
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
}
