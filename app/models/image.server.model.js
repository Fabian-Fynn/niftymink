'use strict';

/**
 *  * Module dependencies.
 *   */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ImageSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  user_id: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  url: {
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
