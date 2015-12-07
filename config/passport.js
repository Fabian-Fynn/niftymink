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
  passport.use('facebook-login', new FacebookStrategy({
      clientID: secrets.FACEBOOK_APP_ID,
      clientSecret: secrets.FACEBOOK_APP_SECRET,
      callbackURL: secrets.FACEBOOK_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
          User.findOne({'facebook.id': profile.id}, function(err, user){
            if(err)
              return done(err);
            if(user)
              return done(null, user);
            else {
              var newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.facebook.token = accessToken;
              newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
              newUser.save(function(err){
                if(err)
                  throw err;
                return done(null, newUser);
              })
            }
          });
        });
    }
  ));
}
