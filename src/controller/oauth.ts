import {NextFunction, Request, Response} from "express";
import User from "../model/user";
import {session} from "../lib/session";
import bcrypt from "bcryptjs";

declare global {
  namespace Express {
    interface User {
      displayName: string;
      emails: {
        value: string;
      }[];
      photos: {
        value: string;
      }[];
    }
  }
}

export async function OauthGoogle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findOne({email: req?.user?.emails[0].value});
    if (user) {
      //if user exist signIn directly
      req.currUser = user;
      const token = session(res, user._id);
      user.password = undefined;
      res.status(200).json({
        status: "success",
        user,
        token,
      });
    } else {
      // If user not exists
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      const newUser = new User({
        name: req.user?.displayName,
        bio: "Update the bio",
        phone: "1212",
        email: req.user?.emails[0].value,
        password: hashedPassword,
        photo: req.user?.photos[0].value,
        profile: "public",
      });
      await newUser.save();

      req.currUser = newUser;
      const token = session(res, newUser._id);
      newUser.password = undefined;
      res.status(200).json({
        status: "success",
        user: newUser,
        token,
      });
    }
  } catch (error) {
    next(error);
  }
}
