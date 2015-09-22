'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  }
});

mongoose.model('users', UserSchema);
