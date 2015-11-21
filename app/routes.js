var path = require('path');
var User = require('./controllers/user.server.controller.js');

module.exports = function(app, passport) {
  app.get('/', function(req, res){
    var user = false;
    if(req.user) {
      user = req.user.firstname;
    }
    res.render(path.resolve(__dirname + '/../client.ejs'), {user: user});
  });

  app.post('/local-login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/false',
    failureFlash: true
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
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
}
