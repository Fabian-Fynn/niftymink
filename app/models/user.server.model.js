'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
  firstname: {
    type: String,
    trim: true,
    default: ''
  },
  surname: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    default: ''
  }
});

UserSchema.findOrCreate = function(req, callback) {
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
};
module.exports = mongoose.model('users', UserSchema);
