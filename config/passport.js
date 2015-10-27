var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user.server.model');


module.exports = function(passport, secrets) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //passport
  passport.use(new FacebookStrategy({
      clientID: secrets.FACEBOOK_APP_ID,
      clientSecret: secrets.FACEBOOK_APP_SECRET,
      callbackURL: secrets.FACEBOOK_CALLBACK_URL,
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate(profile, function (err, user) {
        return done(err, user);
      });
    }
  ));
}
