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
      text: req,
      extras: [
        'url_o',
        'url_l'
      ],
      content_type: 1,
      owner_name: 'true',
      o_dims: 'true',
      l_dims: 'true'
    }, function(err, result) {

      if(result && result.photos.total > 0) {
        var index = Math.floor(Math.random() * (result.photos.photo.length - 1));
        var image = result.photos.photo[index];

        if(image.height_o > 1000 || image.height_l > 1000) {
          var imageurl = (typeof image.url_o === 'undefined') ? imageurl : image.url_l;
					console.log(chalk.black.bgGreen(' Image found '));
          callback({imageurl: imageurl});
        }
        else {
          console.log(chalk.black.bgYellow('Too small. Iteration: ' + iteration));
          if(iteration < 11) {
            flickrRequest(req, iteration + 1, callback);
          } else {
						console.log(chalk.white.bgRed(' No Results. Too Small '));
            return { error: 'No Results' };
          }
        }
      }
      else {
				console.log(chalk.white.bgRed(' No Results for Query '));
        return { error: 'No Results' };
      }
      if(err) { throw new Error(err); }

    })
  });
}
