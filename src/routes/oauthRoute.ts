import express from "express";
import passport from "passport";
import {appError} from "../lib/appError";
import {OauthGoogle} from "../controller/oauth";

const oauthRouter = express.Router();
// Google Auth consent screen route
oauthRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
// Call back route
oauthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  OauthGoogle
);
oauthRouter.get("/failed", (req, res, next) => {
  console.log("User is not authenticated");
  next(appError(500, "You are not authenticated yet"));
});

export {oauthRouter};
