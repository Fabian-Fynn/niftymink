var path = require('path');
var User = require('./models/user.server.model.js');
var imageController = require('./controllers/image.server.controller.js');

module.exports = function(app, passport) {
  app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../client.html'));
  });

  app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){
  });

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
  });

  app.get('/getInfo/:id', function(req, res) {
    imageController.save({ id: req.params.id }, function(err, res) {
      if(err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  });
}
