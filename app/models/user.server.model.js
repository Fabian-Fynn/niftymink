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

mongoose.model('users', UserSchema);
