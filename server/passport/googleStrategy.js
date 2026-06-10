const passport = require("passport");
const GoogleStrategy =
    require("passport-google-oauth20").Strategy;

const config = require("../config");

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },

        async (accessToken, refreshToken, profile, done ) => {
            try {
                return done(
                    null,
                    profile
                );
            } catch (error) {
                return done(
                    error,
                    null
                );
            }
        }
    )
);