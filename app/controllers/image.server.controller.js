'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Image = mongoose.model('Image', 'ImageSchema'),
	chalk = require('chalk');

exports.search = function(req, callback) {
  var res = flickrRequest(req, 0, callback);
};

var flickrRequest = function(req, iteration, callback){
  var Flickr = require("flickrapi");
  var flickrOptions = require('../../config/flickr.js').app;

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photos.search({
      text: req.query,
      extras: [
        'url_o',
        'url_l',
        'url_m'
      ],
      content_type: 1,
      owner_name: 'true',
      o_dims: 'true',
      l_dims: 'true',
      per_page: '50'
    }, function(err, result) {

      if(result && result.photos.total > 0) {
        var index;
        var image;
        var images = [];

        for (var i = 0; i < result.photos.photo.length; i++) {
          if(images.length > 8) {
            break;
          }

          image = result.photos.photo[i];
          if(image.height_o > 1000 || image.height_l > 1000) {
            if(typeof image.url_o === 'undefined') {
              image.imageurl = image.url_o;
            } else {
              image.imageurl = image.url_l;
            }
            image.thumbnail_url = image.url_m;
            images.push(image);
          }
        }
        callback({images: images});
      }
      else {
        return { error: 'No Results' };
      }
      if(err) { throw new Error(err); }

    })
  });
}
