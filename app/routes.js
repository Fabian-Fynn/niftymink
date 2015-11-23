var path = require('path');
var User = require('./controllers/user.server.controller.js');

module.exports = function(app, passport) {
  app.get('/', function(req, res){
    var user = false;
    if(req.user) {
      user = req.user.public;
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

  app.post('/delete', function(req, res) {
    User.delete(req.user, req.password, function(err, success) {
      if(err) {
        res.redirect('/?delete=false&error=true');
      } else if(success) {
        res.redirect('/?delete=true');
      } else {
        res.redirect('/?delete=false');
      }
    });
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

  app.post('/changefirstname', function(req, res) {
    if(req.isAuthenticated()) {
      User.setFirstname(req.user, req.body.firstname, function(err, res) { });
    }
  });

  app.get('/getfirstname', function(req, res) {
    if(req.isAuthenticated()) {
      res.send(req.user.public.firstname);
    } else {
      res.send(null);
    }
  });
}
