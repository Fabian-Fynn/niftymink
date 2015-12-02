'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt');

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
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
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

Schema.statics.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

Schema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', Schema, 'user');
