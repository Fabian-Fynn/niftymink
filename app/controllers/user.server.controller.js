'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User', 'user'),
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
        newUser.local.password = User.encryptPassword(req.password);
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

exports.setFirstname = function(reqUser, firstname, callback) {
  if(reqUser && firstname) {
    User.findOne({'_id': reqUser._id}, function(err, user) {
      if(err) {
        return callback(err);
      } else if(user) {
        user.public.firstname = firstname;
        user.save();
        return callback(null, user);
      } else {
        return callback(null, null);
      }
    });
  }};

exports.delete = function(reqUser, password, callback) {
  User.findOne({ '_id': reqUser._id }, function(err, user) {
    if(err) {
      return callback(err);
    } else {
      user.remove(function(err) {
        if(err) {
          return callback(err);
        } else {
          return callback(null, true);
        }
      });
    }
  });
}

var storeCurrentImage = function(req, res) {
  req.user.currentImage = req.image;
  req.user.save();
};
