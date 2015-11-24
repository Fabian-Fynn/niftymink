var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user.server.model');
var userController = require('../app/controllers/user.server.controller.js');

module.exports = function(passport, secrets) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
   var mongoose = require('mongoose');
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //local
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    imageField: 'image',
    passReqToCallback: true
  },
  function(req, email, password, callback) {
    process.nextTick(function() {
      userController.findOrCreate({ 'email': email, 'password': password, image: req.body.image },
        function(err, user, isNewUser) {
          if(err){
            return callback(err);
          } else if(isNewUser){//new User
            return callback(null, user, isNewUser);
          } else if(!user.validatePassword(password)) { //wrong password
            return callback(null, false);
          } else { //login
            return(callback(null, user, isNewUser));
          }
        }
      );
    });
  }
  ));
  //facebook
  /*passport.use('facebook-login', new FacebookStrategy({
      clientID: secrets.FACEBOOK_APP_ID,
      clientSecret: secrets.FACEBOOK_APP_SECRET,
      callbackURL: secrets.FACEBOOK_CALLBACK_URL,
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({'facebookProfile': profile}, function (err, user) {
        return done(err, user);
      });
    }
  ));*/
}
