import mongoose from "mongoose";
import {NextFunction} from "express";
import bcrypt from "bcryptjs";
import {UserType} from "../types/modelTypes";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 60,
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  photo: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);
export default User;
