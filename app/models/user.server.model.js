'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
  local: {
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    }
  },
  firstname: {
    type: String,
    trim: true,
    default: ''
  },
  surname: {
    type: String,
    trim: true,
    default: ''
  }
});

UserSchema.findOrCreate = function(req, callback) {
  if(req.email) {
    User.findOne({'local.email': req.email}, function(err, user) {
      if(err) {
        return callback(err);
      } else if(user) {

      } else { //newUser
        var newUser = new User();
        newUser.local.email = req.email;
        newUser.local.password = req.password;
        newUser.save(function(err){
          if(err) {
            throw err;
          }
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
        console.log(req);
      }
    });
  }
};
module.exports = mongoose.model('users', UserSchema);
