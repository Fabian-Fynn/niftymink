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
  },
  currentImage: {
    type: String,
    default: null,
    ref: 'Image'
  }
});


module.exports = mongoose.model('User', UserSchema);
