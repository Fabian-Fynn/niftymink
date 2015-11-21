'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
    crypto = require('crypto');

var Schema = new mongoose.Schema({
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
  public: {
    firstname: {
      type: String,
      trim: true,
      default: ''
    }
  },
  currentImage: {
    type: String,
    default: null,
    ref: 'Image'
  }
}, {collection: 'User'});

module.exports = mongoose.model('User', Schema, 'user');
