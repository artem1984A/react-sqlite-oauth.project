// auth.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy; // Import LocalStrategy
const CurrentUser = require('./models/sqlmodels/current_user.model'); // Import the CurrentUser model
const bcrypt = require('bcrypt');
require('dotenv').config(); // Load environment variables

// Setting up GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Logic to find or create a user in your database based on GitHub profile
    return done(null, profile);
  }
));
// Configure Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    // Find user by email
    const user = await CurrentUser.findOne({ where: { email } });

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    // If email and password are correct, return user
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));


// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;