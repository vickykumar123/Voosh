import passport from "passport";
import {Strategy as GoogleStrategy, Profile} from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.clientID || "",
      clientSecret: process.env.clientSecret || "",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    (
      request: any,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser<any, any>((user, done) => {
  // @ts-ignore
  done(null, user);
});

passport.deserializeUser<any, any>((user, done) => {
  done(null, user);
});

export default passport;
