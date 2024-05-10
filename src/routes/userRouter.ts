import express from "express";
import {
  currentUserDetail,
  publicUser,
  updateProfile,
  updateUser,
} from "../controller/user";
import {verify} from "../middleware/verifyUser";

const userRouter = express.Router();
userRouter.get("/", verify, currentUserDetail);
userRouter.post("/", verify, updateUser);
userRouter.post("/profile", verify, updateProfile);
userRouter.get("/public_user", publicUser);
export {userRouter};
