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
  var flickrOptions = require('../../config/secrets.js').flickr_app;

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
          if(image.height_o > 2000 || image.height_l > 2000) {
            if(typeof image.url_o === 'undefined') {
              image.imageurl = image.url_l;
            } else {
              image.imageurl = image.url_o;
            }
            image.thumbnail_url = image.url_m;
            images.push(image);
          }
        }

      }
      if(images && images.length > 0) {
        callback({images: images});
        return;
      } else {
        callback({ error: 'No Results' });
      }
      if(err) { throw new Error(err); }

    })
  });
};

exports.save = function(req, callback) {
  var user = req.user;


  getImageData(req, function(err, res) {
    if(err) {
      throw ('Couldn`t get image data. Error:', err);
    } else {
      var imageInfo = res;
      var newImage = new Image();
      newImage.provider = 'flickr';
      newImage.providerId = imageInfo.id;
      newImage.secret = imageInfo.secret;
      newImage.originalsecret = imageInfo.originalsecret;
      newImage.owner = {
        ownerId: imageInfo.owner.nsid,
        username: imageInfo.owner.username,
        realname: imageInfo.owner.realname
      };
      newImage.title = imageInfo.title._content;
      newImage.published = imageInfo.dates.posted;
      newImage.location = {
        latitude: imageInfo.location.latitude,
        longitude: imageInfo.location.longitude,
        locality: imageInfo.location.locality._content,
        country: imageInfo.location.country._content
      };
      newImage.photopageURL = imageInfo.urls.url[0]._content;
      newImage.shared = false;
      newImage.granted = false;
      newImage.url = imageInfo.url;
      newImage.originalUrl = imageInfo.originalUrl;
      newImage.save();

    }
  });
};

var getImageData = function(req, callback) {

  var flickrRequest = function(req, callback){
    var Flickr = require("flickrapi");
    var flickrOptions = require('../../config/secrets.js').flickr_app;

    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      flickr.photos.getInfo({
        photo_id: req.id
      }, function(err, res) {
        if(err) {
          return callback(err);
        } else {
          return callback(null, res);
        }
      });
    });
  };
  flickrRequest(req, function(err, res) {
    if(err) {
      return callback(err);
    } else {
      var imageData = res.photo;
      getFlickrUrls( imageData.id, function(err, res){
        if(err) {
          return callback(err);
        } else {
          imageData.originalUrl = res.originalUrl;
          imageData.url = res.selectedUrl;

          return callback(null, imageData);
        }
      });
    }
  });
};

var getFlickrUrls = function(req, callback) {
  var flickrRequest = function(req, callback){
    var Flickr = require("flickrapi");
    var flickrOptions = require('../../config/secrets.js').flickr_app;
    Flickr.tokenOnly(flickrOptions, function(error, flickr) {
      flickr.photos.getSizes({
        api_key: flickrOptions.api_key,
        photo_id: req
      }, function(err, res) {
        if(err) {
          return callback(err);
        } else {
          return callback(null, res);
        }
      });
    });
  };

  flickrRequest(req, function(err, res) {
    if(err) {
      return callback(err);
    } else {
      var imageSizes = res.sizes.size;
      var urls = [];
      var selectedImage = imageSizes[0];
      var originalImage;

      for (var i = imageSizes.length - 1; i >= 0; i--) {
        var image = imageSizes[i];

        if(imageSizes[i].label === 'Original') {
          originalImage = image;
        } else {

          image.width = parseInt(image.width);
          image.height = parseInt(image.height);

          if(image.width > selectedImage.width) {
            selectedImage = imageSizes[i];
          } else {
            break;
          }
        }
      }

      if(selectedImage.width < 1500) {
        selectedImage = originalImage;
      }
    }

    return callback(null, { selectedUrl: selectedImage.source, originalUrl: originalImage.source });
  });
};
