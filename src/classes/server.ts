import express, {Express, NextFunction, Request, Response} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import {authRouter} from "../routes/authRouter";
import {userRouter} from "../routes/userRouter";
import {adminRouter} from "../routes/adminRouter";
import {ErrorType} from "../types/customType";
import {oauthRouter} from "../routes/oauthRoute";
import session from "express-session";
import "../passport";

export class Server {
  private app: Express;
  constructor(app: Express) {
    this.app = app;
  }

  config() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());

    this.app.use(
      session({
        secret: process.env.secret!,
        resave: false,
        saveUninitialized: false,
      })
    );
  }

  connect() {
    const PORT = process.env.PORT || 3000;
    mongoose
      .connect(process.env.MONGODB_URL!)
      .then(() => {
        this.app.listen(PORT, () => {
          console.log(`Server is started at http://localhost:${3000}`);
        });
      })
      .catch((err) => console.log(err));
  }
  router() {
    this.app.use("/api/v1/auth", authRouter);
    this.app.use("/api/v1/user", userRouter);
    this.app.use("/api/v1/admin", adminRouter);
    this.app.use("/", oauthRouter);
  }
  globalError() {
    this.app.use(
      (err: ErrorType, req: Request, res: Response, next: NextFunction) => {
        const statusCode = err.statusCode! || 500;
        let message = err.message || "Something went wrong";
        if (err.message!.startsWith("E110")) {
          message = "User already exist";
        }
        return res.status(statusCode).json({
          status: "failed",
          message,
        });
      }
    );
  }
}
