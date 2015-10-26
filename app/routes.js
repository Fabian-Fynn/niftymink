var path = require('path');
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
}
