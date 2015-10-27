var path = require('path');
var User = require('./models/user.server.model.js');

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

  app.get('/newuser/:firstname/:surname/:email', function(req, res) {
    console.log('HERE');
    var newUser = new User();
    console.log(newUser);
    newUser.firstname = req.params.firstname;
    newUser.surname = req.params.surname;
    newUser.email = req.params.email;
    newUser.save();
    console.log(newUser);
  });
}
