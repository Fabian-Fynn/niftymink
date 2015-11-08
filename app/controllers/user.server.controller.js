'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User', 'UserSchema'),
    mailer = require('../lib/mailer.js');

exports.findOrCreate = function(req, callback) {
  if(req.email) {
    User.findOne({'local.email': req.email}, function(err, user) {
      if(err) {
        return callback(err);
      } else if(user) {
        return callback(null, user, false);
      } else { //newUser
        var newUser = new User();
        newUser.local.email = req.email;
        newUser.local.password = req.password;
        newUser.save(function(err){
          if(err) {
            throw err;
          }
          mailer.send_confirmation_mail(newUser.local.email, function(err, res){
            if(err) {
              console.log('Error: ', err);
            } else {
              console.log('Sucessfully sent mail: ', res);
            }
          });
          storeCurrentImage({user: newUser, image: req.image});
          return callback(null, newUser, true);
       });
      }
    });
  } else if (req.facebookProfile) {
    User.findOne({'facebookId': req.id}, function(err, user) {
      if(err) {
        return callback(err);
      }

      if(user) {

      } else {
        var newUser = new User();
      }
    });
  }
};

var storeCurrentImage = function(req, res) {
  req.user.currentImage = req.image;
  req.user.save();
};
