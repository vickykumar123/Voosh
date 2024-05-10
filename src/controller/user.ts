import {NextFunction, Request, Response} from "express";
import {appError} from "../lib/appError";
import User from "../model/user";

export async function currentUserDetail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    if (!user) {
      return next(appError(403, "No user found"));
    }

    res.status(200).json({
      message: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user || !req.userId) {
      return next(
        appError(401, "🙅🏻🙅🏻 You are not logged-in, Please login to access")
      );
    }
    const user = await User.findById(req.userId);
    if (!user) return;
    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.photo = req.body.photo || user.photo;
    if (req.body.password) {
      user.password = req.body.password;
      await user.save();
    }
    await user.save();
    res.status(201).json({
      status: "success",
      message: "User updated successfully..",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user || !req.userId) {
      return next(
        appError(401, "🙅🏻🙅🏻 You are not logged-in, Please login to access")
      );
    }
    if (!req.query.profile) return;
    const requestedProfile = req.query.profile as "public" | "private";
    const user = await User.findOne({_id: req.userId});
    if (!user) return;
    user.profile = requestedProfile;
    await user?.save();
    res.status(201).json({
      status: "success",
      message: "Profile updated",
      user,
    });
  } catch (error) {
    next(error);
  }
}

// Public profile for unauthorized user.
export async function publicUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const publicUserProfile = await User.find({profile: "public"});
    res.status(200).json({
      status: "success",
      publicUserProfile,
    });
  } catch (error) {
    next(error);
  }
}
