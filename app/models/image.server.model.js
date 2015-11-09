'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ImageSchema = new Schema({
  provider: {
    type: String,
    default: ''
  },
  providerId: {
    type: String,
    default: ''
  },
  secret: {
    type: String,
    default: ''
  },
  originalsecret: {
    type: String,
    default: ''
  },
  owner: {
    ownerId: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    realname: {
      type: String,
      default: ''
    }
  },
  title: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    latitude: {
      type: String,
      default: ''
    },
    longitude: {
      type: String,
      default: ''
    },
    locality: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    }
  },
  user_id: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  published: {
    type: Date
  },
  url: {
    type: String
  },
  originalUrl: {
    type: String
  },
  photopageURL: {
    type: String
  },
  shared: {
    type: Boolean,
    default: false
  },
  granted: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Image', ImageSchema);
